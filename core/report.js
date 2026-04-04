// ════════════════════════════════════════════════════════════════
//  SESAME EXAM — core/report.js
//  Génération de rapports IA via DeepSeek (OpenRouter)
//
//  Dépendances globales attendues (définies dans index.html) :
//    MODULE_MAP, SCRIPT_URL, showOverlay, hideOverlay, showToast, apiGet
//
//  Clé API stockée dans :
//    localStorage["sesame:openrouterKey"]
// ════════════════════════════════════════════════════════════════

const REPORT_OR_KEY = "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";
const REPORT_OR_URL = "https://openrouter.ai/api/v1/chat/completions";
const REPORT_DEEPSEEK = "deepseek/deepseek-chat";

// Labels lisibles pour les modules (fallback si MODULE_MAP non dispo)
const REPORT_MODULE_LABELS = {
    digital: { label: "Compétences Digitales", icon: "💻" },
    docs: { label: "Analyse Documentaire", icon: "📄" },
    maths: { label: "Mathématiques", icon: "📐" },
    enjeux: { label: "Enjeux Contemporains", icon: "🌍" },
};

// ══════════════════════════════════════════════════════════════
//  POINT D'ENTRÉE — appelé depuis le bouton admin
// ══════════════════════════════════════════════════════════════
async function generateCandidateReport(candidateId, prenom, nom) {
    const apiKey = localStorage.getItem("REPORT_OR_KEY");
    if (!apiKey) {
        showToast("Clé OpenRouter manquante — configurez-la dans Paramètres.", "error");
        return;
    }

    showOverlay("Récupération des résultats depuis Google Sheets…");

    let rawData;
    try {
        rawData = await apiGet({ action: "getCandidateResults", prenom, nom });
    } catch (e) {
        hideOverlay();
        showToast("Erreur réseau : " + e.message, "error");
        return;
    }

    if (!rawData.ok || !rawData.results || rawData.results.length === 0) {
        hideOverlay();
        showToast("Aucun résultat trouvé pour " + prenom + " " + nom + ".", "error");
        return;
    }

    // Enrichir les résultats avec les questions détaillées
    const enriched = rawData.results.map(r => reportEnrichModule(r));

    showOverlay("Analyse IA en cours — DeepSeek 🤖…");

    let analysis;
    try {
        analysis = await reportCallDeepSeek(prenom, nom, enriched, apiKey);
    } catch (e) {
        hideOverlay();
        showToast("Erreur DeepSeek : " + e.message, "error");
        return;
    }

    hideOverlay();
    reportRenderWindow(prenom, nom, enriched, analysis);
}

// ══════════════════════════════════════════════════════════════
//  ENRICHISSEMENT — croise réponses du Sheet avec MODULE_MAP
// ══════════════════════════════════════════════════════════════
function reportEnrichModule(result) {
    const { moduleId, score, total, date, temps, auto, answers } = result;

    const modCfg = (typeof MODULE_MAP !== "undefined") ? MODULE_MAP[moduleId] : null;
    const fallback = REPORT_MODULE_LABELS[moduleId] || { label: moduleId, icon: "📋" };
    const label = modCfg?.label || fallback.label;
    const icon = modCfg?.icon || fallback.icon;

    if (!modCfg || !modCfg.questions) {
        // Pas de config locale — on retourne les données brutes
        return { moduleId, label, icon, score, total, date, temps, auto, questions: [], rawAnswers: answers };
    }

    const questions = modCfg.questions.map((q, idx) => {
        const qKey = "Q" + (idx + 1);
        const studentRaw = answers[qKey] || "—";
        const skipped = studentRaw === "—";

        let correct = false, studentText = studentRaw, correctText = "";

        if (!skipped) {
            if (q.type === "single") {
                correct = studentRaw === q.answer;
                const sc = q.choices.find(c => c.l.toLowerCase() === studentRaw);
                const cc = q.choices.find(c => c.l.toLowerCase() === q.answer);
                studentText = sc ? sc.l + ". " + sc.t : studentRaw;
                correctText = cc ? cc.l + ". " + cc.t : q.answer;

            } else if (q.type === "multi") {
                const given = studentRaw.split(",").map(s => s.trim()).filter(Boolean);
                const expected = (q.answers || []).slice().sort();
                correct = given.slice().sort().join(",") === expected.join(",");
                studentText = given.map(l => { const c = q.choices.find(ch => ch.l.toLowerCase() === l); return c ? c.l : l; }).join(", ") || "—";
                correctText = expected.map(l => { const c = q.choices.find(ch => ch.l.toLowerCase() === l); return c ? c.l : l; }).join(", ");

            } else if (q.type === "fill") {
                const parts = studentRaw.split("/");
                correct = q.vars && q.vars.every((v, i) => parts[i] === v.answer);
                studentText = q.vars ? q.vars.map((v, i) => "[" + v.key + "]=" + (parts[i] || "—")).join(", ") : studentRaw;
                correctText = q.vars ? q.vars.map(v => "[" + v.key + "]=" + v.answer).join(", ") : "";
            }
        }

        return {
            num: idx + 1,
            text: q.q,
            type: q.type,
            section: q.section || "",
            correct,
            skipped,
            studentText,
            correctText,
        };
    });

    return { moduleId, label, icon, score, total, date, temps, auto, questions };
}

// ══════════════════════════════════════════════════════════════
//  APPEL DEEPSEEK via OpenRouter
// ══════════════════════════════════════════════════════════════
async function reportCallDeepSeek(prenom, nom, modules, apiKey) {
    const totalScore = modules.reduce((s, m) => s + (m.score || 0), 0);
    const totalMax = modules.reduce((s, m) => s + (m.total || 20), 0);
    const globalPct = totalMax > 0 ? Math.round((totalScore / totalMax) * 100) : 0;

    // Construire le résumé détaillé par module
    const modulesSummary = modules.map(m => {
        const pct = m.total > 0 ? Math.round((m.score / m.total) * 100) : 0;
        const wrong = (m.questions || []).filter(q => !q.correct && !q.skipped);
        const skipped = (m.questions || []).filter(q => q.skipped);

        let txt = "\n### " + m.label + " : " + m.score + "/" + m.total + " (" + pct + "%)\n";
        txt += "Date : " + m.date + " | Durée : " + m.temps + "\n";

        if (wrong.length > 0) {
            txt += "Questions incorrectes (" + wrong.length + ") :\n";
            wrong.slice(0, 10).forEach(q => {
                txt += "- Q" + q.num;
                if (q.section) txt += " [" + q.section + "]";
                txt += " : « " + q.text.substring(0, 90) + (q.text.length > 90 ? "…" : "") + " »\n";
                txt += "  ↳ Répondu : " + q.studentText + "\n";
                txt += "  ✓ Correct : " + q.correctText + "\n";
            });
        } else if (m.questions.length > 0) {
            txt += "✓ Toutes les questions correctes.\n";
        }

        if (skipped.length > 0) {
            txt += "Non répondues : " + skipped.map(q => "Q" + q.num).join(", ") + "\n";
        }

        if (m.questions.length === 0 && m.rawAnswers) {
            txt += "(Détail des réponses non disponible localement)\n";
        }

        return txt;
    }).join("\n");

    const prompt = `Tu es un expert pédagogique spécialisé dans la préparation aux concours de grandes écoles de commerce françaises (concours SESAME).
Ton rôle est d'analyser les résultats d'un candidat et de produire un rapport d'évaluation personnalisé, professionnel et bienveillant, entièrement en français.

═══ DONNÉES DU CANDIDAT ═══
Nom : ${prenom} ${nom}
Modules évalués : ${modules.length}
Score global : ${totalScore}/${totalMax} (${globalPct}%)

═══ RÉSULTATS DÉTAILLÉS ═══
${modulesSummary}

═══ INSTRUCTIONS ═══
Génère un rapport d'analyse JSON avec EXACTEMENT la structure suivante.
Réponds UNIQUEMENT avec le JSON pur — aucun texte autour, aucune balise markdown.

{
  "synthese_globale": "3-4 phrases synthétisant le profil global du candidat, son niveau et ses caractéristiques principales",
  "points_forts": [
    "Point fort précis et argumenté 1",
    "Point fort précis et argumenté 2",
    "Point fort précis et argumenté 3"
  ],
  "points_amelioration": [
    "Axe d'amélioration précis avec conseil concret 1",
    "Axe d'amélioration précis avec conseil concret 2",
    "Axe d'amélioration précis avec conseil concret 3"
  ],
  "analyse_modules": {
    ${modules.map(m => `"${m.moduleId}": "Analyse de 2-3 phrases spécifiques à ce module, en lien direct avec les erreurs observées"`).join(",\n    ")}
  },
  "recommandations": [
    "Recommandation d'entraînement concrète et actionnable 1",
    "Recommandation d'entraînement concrète et actionnable 2",
    "Recommandation d'entraînement concrète et actionnable 3",
    "Recommandation d'entraînement concrète et actionnable 4"
  ],
  "encouragement": "Message d'encouragement personnalisé, chaleureux et motivant (4-5 phrases), qui reconnaît les efforts du candidat et l'encourage à persévérer en vue du concours SESAME"
}`;

    const response = await fetch(REPORT_OR_URL, {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + apiKey,
            "Content-Type": "application/json",
            "HTTP-Referer": window.location.origin,
            "X-Title": "SESAME Exam Platform"
        },
        body: JSON.stringify({
            model: REPORT_DEEPSEEK,
            max_tokens: 2500,
            temperature: 0.72,
            messages: [{ role: "user", content: prompt }]
        })
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error?.message || "Erreur HTTP " + response.status);
    }

    const result = await response.json();
    const raw = result.choices?.[0]?.message?.content || "{}";

    try {
        const clean = raw.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
        return JSON.parse(clean);
    } catch (e) {
        console.warn("[SESAME Report] Parsing JSON IA échoué, fallback texte brut :", raw);
        return {
            synthese_globale: raw,
            points_forts: [],
            points_amelioration: [],
            analyse_modules: {},
            recommandations: [],
            encouragement: ""
        };
    }
}

// ══════════════════════════════════════════════════════════════
//  RENDU HTML — ouvre une nouvelle fenêtre print-ready
// ══════════════════════════════════════════════════════════════
function reportRenderWindow(prenom, nom, modules, analysis) {
    const totalScore = modules.reduce((s, m) => s + (m.score || 0), 0);
    const totalMax = modules.reduce((s, m) => s + (m.total || 20), 0);
    const globalPct = totalMax > 0 ? Math.round((totalScore / totalMax) * 100) : 0;
    const today = new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });

    const scoreColor = globalPct >= 75 ? "#2e8b6e" : globalPct >= 50 ? "#c0700a" : "#e8533a";

    // Base URL pour charger core/report.css depuis la nouvelle fenêtre
    const baseHref = window.location.href.substring(0, window.location.href.lastIndexOf("/") + 1);

    // ── Cartes de scores par module ──
    const scoreCells = modules.map(m => {
        const pct = m.total > 0 ? Math.round((m.score / m.total) * 100) : 0;
        const c = pct >= 75 ? "#2e8b6e" : pct >= 50 ? "#c0700a" : "#e8533a";
        return `<div class="score-card">
      <div class="score-module-icon">${m.icon}</div>
      <div class="score-module-name">${m.label}</div>
      <div class="score-value" style="color:${c}">${m.score}/${m.total}</div>
      <div class="score-bar-bg"><div class="score-bar-fill" style="width:${pct}%;background:${c}"></div></div>
    </div>`;
    }).join("");

    // ── Détail par module ──
    const modulesHTML = modules.map(m => {
        const pct = m.total > 0 ? Math.round((m.score / m.total) * 100) : 0;
        const wrong = (m.questions || []).filter(q => !q.correct && !q.skipped);
        const skipped = (m.questions || []).filter(q => q.skipped);
        const modAnalysis = analysis.analyse_modules?.[m.moduleId] || "";

        const wrongRows = wrong.map(q => `
      <tr>
        <td class="q-num">Q${q.num}</td>
        <td class="q-text">${reportEsc(q.text.substring(0, 100))}${q.text.length > 100 ? "…" : ""}</td>
        <td class="q-student">${reportEsc(q.studentText)}</td>
        <td class="q-correct">${reportEsc(q.correctText)}</td>
      </tr>`).join("");

        return `
    <div class="module-section">
      <div class="module-header">
        <div>
          <div class="module-title">${m.icon} ${m.label}</div>
          <div class="module-meta">Passé le ${m.date} · Durée : ${m.temps}${m.auto === "OUI" ? " · ⏱ Soumission automatique" : ""}</div>
        </div>
        <div class="module-score-block">
          <div class="module-score">${m.score}<span class="module-total">/${m.total}</span></div>
          <div class="module-pct" style="color:${pct >= 75 ? "#2e8b6e" : pct >= 50 ? "#c0700a" : "#e8533a"}">${pct}%</div>
        </div>
      </div>
      ${modAnalysis ? `<div class="module-analysis">${reportEsc(modAnalysis)}</div>` : ""}
      ${wrong.length > 0 ? `
      <div class="errors-section">
        <div class="errors-title">Points à retravailler — ${wrong.length} question${wrong.length > 1 ? "s" : ""} incorrecte${wrong.length > 1 ? "s" : ""}</div>
        <table class="errors-table">
          <thead><tr><th>#</th><th>Question</th><th>Réponse donnée</th><th>Réponse correcte</th></tr></thead>
          <tbody>${wrongRows}</tbody>
        </table>
      </div>` : m.questions.length > 0 ? `<div class="all-correct">✓ Toutes les questions correctement répondues pour ce module.</div>` : ""}
      ${skipped.length > 0 ? `<div class="skipped-note">⚠ Questions non répondues : ${skipped.map(q => "Q" + q.num).join(", ")}</div>` : ""}
    </div>`;
    }).join("");

    // ── Listes IA ──
    const toUL = arr => (arr || []).map(p => `<li>${reportEsc(p)}</li>`).join("");
    const toRec = arr => (arr || []).map((r, i) => `
    <div class="rec-item">
      <div class="rec-num">${i + 1}</div>
      <div>${reportEsc(r)}</div>
    </div>`).join("");

    const html = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<base href="${baseHref}"/>
<title>Rapport — ${prenom} ${nom}</title>
<link rel="stylesheet" href="core/report.css"/>
</head>
<body>
<div class="report-page">

  <!-- ══ EN-TÊTE ══ -->
  <header class="report-header">
    <div class="header-left">
      <div class="report-logo">SESAME · Exam</div>
      <div class="report-subtitle">Rapport d'évaluation personnalisé</div>
    </div>
    <div class="header-right">
      <div class="report-date">Généré le ${today}</div>
      <div class="report-confidential">Confidentiel — Usage administrateur</div>
    </div>
  </header>

  <!-- ══ CANDIDAT ══ -->
  <section class="candidate-block">
    <div class="candidate-name">${prenom} ${nom}</div>
    <div class="candidate-info-row">
      <span>Concours SESAME</span>
      <span>${modules.length} module${modules.length > 1 ? "s" : ""} évalué${modules.length > 1 ? "s" : ""}</span>
    </div>
  </section>

  <!-- ══ SCORE GLOBAL ══ -->
  <section class="global-score-section">
    <div class="global-score-card">
      <div class="global-label">Score global</div>
      <div class="global-value" style="color:${scoreColor}">${totalScore}<span class="global-max">/${totalMax}</span></div>
      <div class="global-pct" style="color:${scoreColor}">${globalPct}%</div>
    </div>
    <div class="scores-grid">${scoreCells}</div>
  </section>

  <!-- ══ SYNTHÈSE IA ══ -->
  ${analysis.synthese_globale ? `
  <section class="ai-section">
    <div class="section-title">📊 Synthèse globale</div>
    <div class="synthese-text">${reportEsc(analysis.synthese_globale)}</div>
  </section>` : ""}

  <!-- ══ POINTS FORTS / AXES D'AMÉLIORATION ══ -->
  <section class="sw-section">
    <div class="sw-col sw-strong">
      <div class="sw-title">✓ Points forts</div>
      <ul class="sw-list">${toUL(analysis.points_forts)}</ul>
    </div>
    <div class="sw-col sw-weak">
      <div class="sw-title">△ Axes d'amélioration</div>
      <ul class="sw-list">${toUL(analysis.points_amelioration)}</ul>
    </div>
  </section>

  <div class="page-break"></div>

  <!-- ══ DÉTAIL MODULES ══ -->
  <section class="ai-section">
    <div class="section-title">📋 Détail par module</div>
    ${modulesHTML}
  </section>

  <!-- ══ RECOMMANDATIONS ══ -->
  ${(analysis.recommandations || []).length > 0 ? `
  <section class="ai-section">
    <div class="section-title">🎯 Recommandations personnalisées</div>
    <div class="rec-grid">${toRec(analysis.recommandations)}</div>
  </section>` : ""}

  <!-- ══ ENCOURAGEMENT ══ -->
  ${analysis.encouragement ? `
  <section class="encouragement-section">
    <div class="encouragement-title">💬 Mot de l'évaluateur</div>
    <div class="encouragement-text">${reportEsc(analysis.encouragement)}</div>
  </section>` : ""}

  <!-- ══ PIED DE PAGE ══ -->
  <footer class="report-footer">
    <div>SESAME Exam Platform · Rapport généré automatiquement via DeepSeek</div>
    <div>${prenom} ${nom} · ${today}</div>
  </footer>

</div>

<!-- Boutons visibles uniquement à l'écran -->
<div class="screen-actions">
  <button class="print-btn" onclick="window.print()">🖨 Imprimer / Enregistrer en PDF</button>
  <button class="close-btn" onclick="window.close()">✕ Fermer</button>
</div>

</body>
</html>`;

    const w = window.open("", "_blank", "width=960,height=760,scrollbars=yes,resizable=yes");
    if (!w) {
        showToast("Popup bloquée — autorisez les popups pour ce site.", "error");
        return;
    }
    w.document.write(html);
    w.document.close();
}

// Échapper le HTML pour éviter les injections dans le rapport
function reportEsc(str) {
    return String(str || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}
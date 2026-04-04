// ══════════════════════════════════════════════════════════
//  MODULE : Compétences Mathématiques
//  40 questions · 30 minutes
//  Source : Livret d'entraînement SESAME pp. 37-42
// ══════════════════════════════════════════════════════════
const MODULE_MATHS = {
  id:       "maths",
  label:    "Compétences Mathématiques",
  icon:     "📐",
  duration: "40 minutes",
  seconds:  40 * 60,
  hasPdf:   false,
  pdfPath:  null,
  questions: [
    // Q1
    {type:"single",q:"On considère les ensembles A = {1 ; 2 ; 3 ; 4 ; 5} et B = {5 ; 6 ; 7 ; 8}. Déterminez A ∪ B.",choices:[{l:"A",t:"A ∪ B = {1 ; 2 ; 3 ; 4 ; 5 ; 6 ; 7 ; 8}"},{l:"B",t:"A ∪ B = {5}"},{l:"C",t:"A ∪ B = [1;8]"},{l:"D",t:"A ∪ B = { }"}],answer:"a"},
    // Q2
    {type:"single",q:"Simplifiez l'expression suivante : -3x - 2(x-5)",choices:[{l:"A",t:"5x-10"},{l:"B",t:"-5x+10"},{l:"C",t:"-x+5"},{l:"D",t:"x-5"}],answer:"b"},
    // Q3
    {type:"single",q:"Sur une plateforme de réseau social, le nombre de vidéos postées par les créateurs est proportionnel au nombre de vues. Un créateur obtient 4 000 vues en publiant 8 vidéos. Combien de vues obtiendrait-il s'il poste 12 vidéos ?",choices:[{l:"A",t:"5 000 vues"},{l:"B",t:"6 000 vues"},{l:"C",t:"7 000 vues"},{l:"D",t:"8 000 vues"}],answer:"b"},
    // Q4
    {type:"single",q:"Quels sont le type et la raison de la suite suivante : 12, 7, 2, -3, -8, -13, -18 ... ?",choices:[{l:"A",t:"Suite arithmétique de raison 5"},{l:"B",t:"Suite géométrique de raison 5"},{l:"C",t:"Suite arithmétique de raison -5"},{l:"D",t:"Cette suite n'est ni arithmétique ni géométrique."}],answer:"c"},
    // Q5
    {type:"single",q:"Soit f(x) = 3x³ − 5x² + 3. Quelle est f'(x) ?",choices:[{l:"A",t:"f'(x) = 3x² - 5"},{l:"B",t:"f'(x) = 9x² - 10x"},{l:"C",t:"f'(x) = 9x² - 5x + 3"},{l:"D",t:"f'(x) = 9x² - 10x + 3"}],answer:"b"},
    // Q6
    {type:"single",q:"Quelle est l'équation de la droite passant par les points A(0;-3) et B(1;-4) ?",choices:[{l:"A",t:"y = x + 3"},{l:"B",t:"y = -x - 3"},{l:"C",t:"y = -7x + 3"},{l:"D",t:"y = 7x - 3"}],answer:"b"},
    // Q7
    {type:"single",q:"Soit A(a;b) un point du repère et B(-2;-4) un autre point. On sait que M(1;-2) est le milieu du segment [AB]. Quelles sont les coordonnées du point A ?",choices:[{l:"A",t:"A(2;-6)"},{l:"B",t:"A(0;4)"},{l:"C",t:"A(-0,5;-3)"},{l:"D",t:"A(4;0)"}],answer:"d"},
    // Q8
    {type:"single",q:"La vitesse d'un cycliste est de 10 km/h. Quelle est sa vitesse en m/s (arrondie au centième près si nécessaire) ?",choices:[{l:"A",t:"2,78 m/s"},{l:"B",t:"36 m/s"},{l:"C",t:"10 m/s"},{l:"D",t:"27,8 m/s"}],answer:"a"},
    // Q9
    {type:"single",q:"Le volume d'un cube est de 4 096 m³. Quelle est la longueur de son côté ?",choices:[{l:"A",t:"16 m"},{l:"B",t:"64 m"},{l:"C",t:"32 m"},{l:"D",t:"8 m"}],answer:"a"},
    // Q10-I
    {type:"single",q:"Dans une étude, P(A) = 0,8 (utilisateur actif) et P(B|A) = 0,3 (partage si actif). Quelle est la probabilité qu'un utilisateur soit actif ET partage un contenu ?",choices:[{l:"A",t:"0,06"},{l:"B",t:"0,24"},{l:"C",t:"0,7"},{l:"D",t:"0,8"}],answer:"b"},
    // Q10-II
    {type:"single",q:"Avec P(A) = 0,8 et P(B|A) = 0,3, quelle est la probabilité qu'un utilisateur soit actif ET ne partage PAS un contenu ?",choices:[{l:"A",t:"0,76"},{l:"B",t:"0,56"},{l:"C",t:"0,7"},{l:"D",t:"0,24"}],answer:"b"},
    // Q10-III
    {type:"single",q:"Avec P(A) = 0,8 et P(B|A) = 0,3, si un utilisateur partage un contenu, quelle est la probabilité qu'il soit actif sur la plateforme ?",choices:[{l:"A",t:"0,06"},{l:"B",t:"0,24"},{l:"C",t:"0,56"},{l:"D",t:"1"}],answer:"d"},
    // Q11
    {type:"single",q:"Quel est le domaine de définition de la fonction f(x) = 2eˣ ?",choices:[{l:"A",t:"]-∞ ; +∞["},{l:"B",t:"]-∞ ; 0["},{l:"C",t:"]0 ; +∞["},{l:"D",t:"[0 ; +∞["}],answer:"a"},
    // Q12
    {type:"single",q:"Quel est l'ensemble des solutions de l'équation (x+2)(x-3) - 2(x-3) = 0 ?",choices:[{l:"A",t:"S = {-2 ; 3}"},{l:"B",t:"S = {-3 ; 2}"},{l:"C",t:"S = {0 ; 3}"},{l:"D",t:"S = {-3 ; 0}"}],answer:"c"},
    // Q13
    {type:"single",q:"Parmi les fonctions suivantes, laquelle est impaire ?",choices:[{l:"A",t:"f(x) = x + 5"},{l:"B",t:"f(x) = 2x"},{l:"C",t:"f(x) = x(x-2)"},{l:"D",t:"f(x) = 5"}],answer:"b"},
    // Q14
    {type:"single",q:"On considère les notes de 6 étudiants : 12, 15, 16, 8, 20, 13. Laquelle des propositions suivantes est FAUSSE ?",choices:[{l:"A",t:"La moyenne est 14."},{l:"B",t:"La médiane est 14."},{l:"C",t:"50 % des notes sont supérieures à 14."},{l:"D",t:"La médiane et la moyenne ne peuvent pas être identiques."}],answer:"d"},
    // Q15-I
    {type:"single",q:"D'après le tableau de variation de f(x) (f décroît de -∞ vers 10 en x=-2, puis vers 3 en x=2, puis croît vers +∞), combien de solution(s) l'équation f(x) = 0 admet-elle ?",choices:[{l:"A",t:"Aucune solution."},{l:"B",t:"Une solution unique."},{l:"C",t:"Deux solutions distinctes."},{l:"D",t:"On ne peut pas le déterminer."}],answer:"b"},
    // Q15-II
    {type:"single",q:"D'après ce même tableau de variation de f(x), combien de point(s) cette fonction admet une tangente parallèle à l'axe des x ?",choices:[{l:"A",t:"Aucun point."},{l:"B",t:"Un seul point."},{l:"C",t:"Deux points distincts."},{l:"D",t:"Trois points distincts."}],answer:"c"},
    // Q15-III
    {type:"single",q:"D'après ce même tableau de variation de f(x), sur quel intervalle la fonction f'(x) est-elle strictement positive ?",choices:[{l:"A",t:"]-∞ ; 2["},{l:"B",t:"]-∞ ; -2[ ∪ ]2 ; +∞["},{l:"C",t:"]-2 ; 2["},{l:"D",t:"]3 ; +∞["}],answer:"b"},
    // Q16-I
    {type:"single",q:"On considère la fonction f(x) = -2x² + 10. Quelle est la valeur de f(-3) ?",choices:[{l:"A",t:"28"},{l:"B",t:"-8"},{l:"C",t:"-2"},{l:"D",t:"22"}],answer:"b"},
    // Q16-II
    {type:"single",q:"Pour f(x) = -2x² + 10, laquelle des propositions suivantes est VRAIE ?",choices:[{l:"A",t:"La fonction est paire, donc son graphe est symétrique par rapport à l'axe des y."},{l:"B",t:"La fonction est paire, donc son graphe est symétrique par rapport à l'axe des x."},{l:"C",t:"La fonction est impaire, donc son graphe est symétrique par rapport à l'axe des y."},{l:"D",t:"La fonction est impaire, donc son graphe est symétrique par rapport à l'axe des x."}],answer:"a"},
    // Q17
    {type:"single",q:"Quelle est la valeur de A = 1 - (5 + 1/3) / 2 - 2 × 3 ?",choices:[{l:"A",t:"A = -23/3"},{l:"B",t:"A = -19"},{l:"C",t:"A = -22/3"},{l:"D",t:"A = -51/2"}],answer:"a"},
    // Q18
    {type:"single",q:"Un rectangle mesure 3 cm de longueur et 4 cm de largeur. Quelle est la longueur de ses diagonales ?",choices:[{l:"A",t:"3 cm"},{l:"B",t:"4 cm"},{l:"C",t:"5 cm"},{l:"D",t:"7 cm"}],answer:"c"},
    // Q19
    {type:"single",q:"Une urne contient des boules numérotées de 1 à 20. On choisit une boule au hasard. Quelle est la probabilité que le numéro soit un nombre premier ?",choices:[{l:"A",t:"5/10"},{l:"B",t:"6/10"},{l:"C",t:"4/10"},{l:"D",t:"3/10"}],answer:"c"},
    // Q20
    {type:"single",q:"Un client achète une veste à 115 euros avec une réduction de 15 %. Quel sera le prix final ?",choices:[{l:"A",t:"97,75 euros"},{l:"B",t:"99 euros"},{l:"C",t:"100 euros"},{l:"D",t:"98,50 euros"}],answer:"a"},
  ]
};

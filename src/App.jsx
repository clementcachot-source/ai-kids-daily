import { useState, useEffect, useRef } from "react";
import { supabase } from "./supabaseClient";

// ─── DATA ───────────────────────────────────────────────────────────────────

const PROFILES_DATA = {
  adele: {
    id: "adele", name: "Adèle", age: 13, avatar: "🌸",
    color: "#e879a0", light: "#fce7f3", colorDark: "#be185d",
    maxXp: 1000,
  },
  soline: {
    id: "soline", name: "Soline", age: 12, avatar: "⚡",
    color: "#7c3aed", light: "#ede9fe", colorDark: "#5b21b6",
    maxXp: 1000,
  },
};

const PHASES = [
  {
    icon: "🌱", name: "Éveil", months: "Mois 1–3",
    desc: "Logique, culture tech, Python débutant",
    project: "Un chatbot texte qui répond à des questions",
    color: "#0ea5e9", bg: "#e0f2fe", text: "#0369a1",
  },
  {
    icon: "🔧", name: "Construction", months: "Mois 4–9",
    desc: "Python solide, HTML/CSS, premiers appels API",
    project: "Une mini app web avec une vraie interface",
    color: "#10b981", bg: "#dcfce7", text: "#15803d",
  },
  {
    icon: "🤖", name: "Intelligence", months: "Mois 10–18",
    desc: "Prompting avancé, agents IA, automatisations",
    project: "Un outil IA qui résout un vrai problème de ta vie",
    color: "#f59e0b", bg: "#fef9c3", text: "#92400e",
  },
  {
    icon: "🚀", name: "Création", months: "Mois 19–24",
    desc: "Projets libres, portfolio, publication",
    project: "Ton app, ton idée, ton code — top 1%",
    color: "#ef4444", bg: "#fee2e2", text: "#991b1b",
  },
];

const LESSONS = [
  {
    id: 1, phase: 1, title: "Qu'est-ce qu'un programme ?",
    tag: "Culture tech · Leçon 1",
    desc: "Avant de coder, comprendre ce que c'est vraiment.",
    steps: [
      {
        type: "cours", icon: "📖", label: "C'est quoi coder ?",
        content: `Un programme, c'est une liste d'instructions que tu donnes à l'ordinateur. Lui, il les suit à la lettre — sans jamais réfléchir, sans jamais improviser.`,
        analogy: "🧠 C'est comme une recette de cuisine. Si tu écris \"ajouter du sel\", l'ordi ajoute du sel. Il ne goûtera jamais pour vérifier si c'est bon.",
      },
      {
        type: "exemple", icon: "👀", label: "Ton premier programme",
        code: `# Mon tout premier programme Python\nprint("Bonjour le monde !")\nprint("Je m'appelle Adèle")\nprint("Je vais apprendre à coder !")`,
        result: `Bonjour le monde !\nJe m'appelle Adèle\nJe vais apprendre à coder !`,
      },
      {
        type: "exercice", icon: "✏️", label: "À toi !",
        prompt: `Écris un programme qui affiche 3 choses sur toi : ton prénom, ton âge, et quelque chose que tu aimes. Utilise print() pour chaque ligne.`,
        placeholder: "# Écris ton code ici\nprint(...)",
        cleoPrompt: `L'exercice : écrire 3 print() qui affichent des infos personnelles (prénom, âge, quelque chose qu'on aime). Vérifie que l'élève a bien 3 print() différents avec du contenu pertinent.`,
      },
    ],
  },
  {
    id: 2, phase: 1, title: "print() — afficher du texte",
    tag: "Python · Leçon 2",
    desc: "La commande la plus utilisée en Python. Tu vas t'en servir partout.",
    steps: [
      {
        type: "cours", icon: "📖", label: "La fonction print()",
        content: `print() est une fonction Python qui affiche du texte à l'écran. Tu mets ce que tu veux afficher entre les parenthèses, entre guillemets si c'est du texte.`,
        analogy: "🧠 print() c'est comme parler : tu mets tes mots dans la bouche de l'ordinateur, et il les dit à voix haute (enfin, à l'écran).",
      },
      {
        type: "exemple", icon: "👀", label: "print() en action",
        code: `print("Salut !")\nprint("J'ai", 13, "ans")\nprint("2 + 2 =", 2 + 2)\nprint()  # ligne vide`,
        result: `Salut !\nJ'ai 13 ans\n2 + 2 = 4\n`,
      },
      {
        type: "exercice", icon: "✏️", label: "À toi !",
        prompt: `Utilise print() pour afficher : une phrase de présentation, le résultat de 7 × 8, et une phrase de conclusion. Tu peux faire calculer l'ordinateur directement dans le print() !`,
        placeholder: "print(...)\nprint(7 * ...)\nprint(...)",
        cleoPrompt: `L'exercice : 3 print() — une phrase de présentation, le résultat de 7×8 (affiché via calcul dans print), une conclusion. Vérifie que le calcul est bien fait par Python (pas juste "56" écrit à la main).`,
      },
    ],
  },
  {
    id: 3, phase: 1, title: "Les variables — stocker une info",
    tag: "Python · Leçon 3",
    desc: "Une variable c'est comme une boîte avec une étiquette. Tu mets quelque chose dedans, tu le retrouves plus tard.",
    steps: [
      {
        type: "cours", icon: "📖", label: "C'est quoi une variable ?",
        content: `Une variable, c'est un nom qui pointe vers une valeur. Tu crées une variable en écrivant son nom, puis =, puis sa valeur.\n\n3 types de base :\n· Texte (entre guillemets) → "bonjour"\n· Nombre entier → 13\n· Nombre décimal → 3.14`,
        analogy: "🧠 Imagine une boîte à chaussures avec une étiquette \"prénom\". Tu peux mettre \"Adèle\" dedans, puis changer pour autre chose plus tard. La boîte reste, le contenu change.",
      },
      {
        type: "exemple", icon: "👀", label: "Des variables en vrai",
        code: `# Je crée des variables\nprenom = "Adèle"\nage = 13\ntaille = 1.62\n\n# Je les utilise\nprint("Je m'appelle", prenom)\nprint("J'ai", age, "ans")\nprint("Je mesure", taille, "m")`,
        result: `Je m'appelle Adèle\nJ'ai 13 ans\nJe mesure 1.62 m`,
      },
      {
        type: "exercice", icon: "✏️", label: "À toi !",
        prompt: `Crée 3 variables qui te décrivent : ton prénom, ton âge, et ta couleur préférée. Puis affiche-les avec print().`,
        placeholder: "prenom = ...\nage = ...\ncouleur = ...\nprint(...)",
        cleoPrompt: `L'exercice : créer 3 variables (prénom, âge, couleur préférée) et les afficher avec print(). Vérifie que les variables sont bien créées (pas juste des print directs), que le texte est entre guillemets, et que les nombres n'ont pas de guillemets.`,
      },
    ],
  },
  {
    id: 4, phase: 1, title: "Nombres et calculs",
    tag: "Python · Leçon 4",
    desc: "Python est une super calculatrice. Apprends à lui faire faire des maths.",
    steps: [
      {
        type: "cours", icon: "📖", label: "Python et les maths",
        content: `Python sait faire tous les calculs de base :\n· + pour additionner\n· - pour soustraire\n· * pour multiplier\n· / pour diviser\n· ** pour la puissance (2**3 = 8)\n· % pour le reste de division (modulo)`,
        analogy: "🧠 Python est la calculatrice la plus puissante du monde — et elle ne tombe jamais en panne de pile.",
      },
      {
        type: "exemple", icon: "👀", label: "Des calculs en Python",
        code: `age = 13\nannee = 2025\n\nnaissance = annee - age\nprint("Je suis née en", naissance)\n\ndouble_age = age * 2\nprint("Dans", age, "ans, j'aurai", double_age, "ans")\n\nprint("La moitié de mon âge :", age / 2)`,
        result: `Je suis née en 2012\nDans 13 ans, j'aurai 26 ans\nLa moitié de mon âge : 6.5`,
      },
      {
        type: "exercice", icon: "✏️", label: "À toi !",
        prompt: `Crée une variable "annee_naissance" avec ton année de naissance. Calcule et affiche : ton âge en 2025, ton âge dans 10 ans, et l'année où tu auras 30 ans.`,
        placeholder: "annee_naissance = ...\nage_maintenant = 2025 - ...\nprint(...)",
        cleoPrompt: `L'exercice : variable annee_naissance, puis calculer et afficher l'âge en 2025 (2025 - annee_naissance), l'âge dans 10 ans (age + 10), et l'année où elle aura 30 ans (annee_naissance + 30). Vérifie que les calculs sont faits par Python et pas écrits en dur.`,
      },
    ],
  },
  {
    id: 5, phase: 1, title: "input() — l'ordi te parle",
    tag: "Python · Leçon 5",
    desc: "Pour la première fois, ton programme va poser des questions et attendre ta réponse.",
    steps: [
      {
        type: "cours", icon: "📖", label: "Demander quelque chose",
        content: `input() permet à ton programme de poser une question et d'attendre que l'utilisateur tape une réponse. La réponse est stockée dans une variable.\n\nAttention : input() renvoie toujours du texte. Pour un nombre, il faut écrire int(input()) ou float(input()).`,
        analogy: "🧠 C'est comme un formulaire : ton programme pose une question, tu réponds, et il se souvient de ta réponse.",
      },
      {
        type: "exemple", icon: "👀", label: "Un programme interactif",
        code: `prenom = input("Comment tu t'appelles ? ")\nage = int(input("Tu as quel âge ? "))\n\nprint("Bonjour", prenom, "!")\nprint("Dans 5 ans tu auras", age + 5, "ans")`,
        result: `Comment tu t'appelles ? Adèle\nTu as quel âge ? 13\nBonjour Adèle !\nDans 5 ans tu auras 18 ans`,
      },
      {
        type: "exercice", icon: "✏️", label: "À toi !",
        prompt: `Crée un programme qui demande le prénom et l'année de naissance, puis affiche un message personnalisé avec l'âge calculé.`,
        placeholder: "prenom = input(...)\nannee = int(input(...))\nage = 2025 - annee\nprint(...)",
        cleoPrompt: `L'exercice : utiliser input() pour demander prénom et année de naissance, calculer l'âge (2025 - annee), et afficher un message personnalisé. Vérifie l'utilisation de int() autour de input() pour l'année, et que le calcul de l'âge est correct.`,
      },
    ],
  },
  {
    id: 6, phase: 1, title: "if / else — prendre des décisions",
    tag: "Python · Leçon 6",
    desc: "Ton programme peut maintenant choisir quoi faire selon les situations.",
    steps: [
      {
        type: "cours", icon: "📖", label: "Les conditions",
        content: `if / else permet à ton programme de prendre des décisions :\n\nif condition:\n    # si c'est vrai\nelse:\n    # si c'est faux\n\nLes comparaisons : == (égal), != (différent), > (supérieur), < (inférieur), >= , <=`,
        analogy: "🧠 C'est comme un carrefour : si le feu est vert → tu avances, sinon → tu attends. Ton programme fait pareil avec des données.",
      },
      {
        type: "exemple", icon: "👀", label: "if / else en action",
        code: `age = int(input("Quel âge as-tu ? "))\n\nif age >= 18:\n    print("Tu es majeure !")\nelse:\n    print("Tu es mineure.")\n    annees = 18 - age\n    print("Il te reste", annees, "ans.")`,
        result: `Quel âge as-tu ? 13\nTu es mineure.\nIl te reste 5 ans.`,
      },
      {
        type: "exercice", icon: "✏️", label: "À toi !",
        prompt: `Écris un programme qui demande une note (sur 20), et affiche :\n- "Excellent !" si la note >= 16\n- "Bien !" si la note >= 12\n- "Continue tes efforts !" sinon\nUtilise if / elif / else.`,
        placeholder: "note = int(input(...))\nif note >= 16:\n    print(...)\nelif note >= 12:\n    print(...)\nelse:\n    print(...)",
        cleoPrompt: `L'exercice : if/elif/else sur une note. Vérifie que les 3 conditions couvrent >=16, >=12, et le reste. Vérifie l'utilisation de elif (pas deux if séparés). Les messages peuvent être différents de l'exemple.`,
      },
    ],
  },
  {
    id: 7, phase: 1, title: "Évaluation 1 — Les bases",
    tag: "Évaluation · Leçon 7",
    desc: "Tu as fait 6 leçons. Montre ce que tu sais faire !",
    isEval: true,
    steps: [
      {
        type: "cours", icon: "📋", label: "Ce que tu sais déjà",
        content: `Tu maîtrises maintenant :\n✅ print() — afficher du texte\n✅ Les variables — stocker des infos\n✅ Les calculs — +, -, *, /\n✅ input() — demander une info\n✅ if/elif/else — prendre des décisions\n\nL'évaluation va tester tout ça ensemble dans un vrai mini programme.`,
        analogy: "🏆 Ce n'est pas un examen pour te juger — c'est pour voir ce que tu as vraiment compris et ce qu'on va renforcer.",
      },
      {
        type: "exemple", icon: "👀", label: "Ce que tu vas créer",
        code: `# Un programme de calcul de ticket\n# Il demande la quantité et le prix\n# Il calcule le total et la TVA\n# Il affiche un ticket formaté`,
        result: `Le programme pose des questions\nIl fait des calculs\nIl affiche un résultat personnalisé`,
      },
      {
        type: "exercice", icon: "🏆", label: "Mini projet !",
        prompt: `Crée un programme "calculateur de voyage" :\n1. Demande la distance en km\n2. Demande la vitesse moyenne en km/h\n3. Calcule la durée (distance / vitesse)\n4. Affiche "Ton voyage dure X heures"\n5. Si < 1 heure : "C'est rapide !"\n   Si > 5 heures : "Prévois des snacks !"`,
        placeholder: "# Calculateur de voyage\ndistance = float(input(...))\nvitesse = float(input(...))\nduree = ...\nprint(...)\nif duree < 1:\n    print(...)",
        cleoPrompt: `Évaluation 1. Programme complet : 2 input(), calcul de durée, affichage du résultat, condition sur la durée. Critères stricts : les deux float(input()), le calcul distance/vitesse, l'affichage du résultat, et au moins une condition (< 1 ou > 5). Sois encourageante mais ne valide que si tout fonctionne.`,
      },
    ],
  },
  {
    id: 8, phase: 1, title: "Les boucles for",
    tag: "Python · Leçon 8",
    desc: "Répéter une action sans tout réécrire — la magie des boucles.",
    steps: [
      {
        type: "cours", icon: "📖", label: "Répéter avec for",
        content: `Une boucle for répète un bloc de code plusieurs fois. La syntaxe de base :\n\nfor i in range(5):\n    print(i)\n\nrange(5) génère les nombres 0, 1, 2, 3, 4.\nrange(1, 6) génère 1, 2, 3, 4, 5.\nrange(0, 10, 2) génère 0, 2, 4, 6, 8 (par pas de 2).`,
        analogy: "🧠 C'est comme dire \"fais ça 10 fois\" au lieu de copier-coller 10 fois la même ligne.",
      },
      {
        type: "exemple", icon: "👀", label: "Les boucles en action",
        code: `# Compter jusqu'à 5\nfor i in range(1, 6):\n    print(i)\n\n# Table de multiplication de 3\nfor i in range(1, 11):\n    print("3 x", i, "=", 3 * i)`,
        result: `1\n2\n3\n4\n5\n3 x 1 = 3\n3 x 2 = 6\n...`,
      },
      {
        type: "exercice", icon: "✏️", label: "À toi !",
        prompt: `Écris un programme qui affiche la table de multiplication d'un nombre choisi par l'utilisateur (de 1 à 10).`,
        placeholder: "nombre = int(input(\"Quelle table ? \"))\nfor i in range(1, 11):\n    print(nombre, \"x\", i, \"=\", ...)",
        cleoPrompt: `L'exercice : utiliser input() pour choisir un nombre, puis une boucle for de 1 à 10 (range(1,11)) pour afficher la table de multiplication. Vérifie que le calcul dans la boucle est correct (nombre * i) et que l'affichage est lisible.`,
      },
    ],
  },
  {
    id: 9, phase: 1, title: "Les listes",
    tag: "Python · Leçon 9",
    desc: "Stocker plusieurs valeurs dans une seule variable.",
    steps: [
      {
        type: "cours", icon: "📖", label: "C'est quoi une liste ?",
        content: `Une liste permet de stocker plusieurs valeurs dans une seule variable. On l'écrit avec des crochets [] et on sépare les éléments par des virgules.\n\nOn accède aux éléments par leur position (indice), qui commence à 0.\n\nOpérations utiles :\n· len(liste) → nombre d'éléments\n· liste.append(valeur) → ajouter\n· liste[0] → premier élément`,
        analogy: "🧠 Une liste c'est comme une liste de courses : tu as tout au même endroit, numéroté de 0 à la fin.",
      },
      {
        type: "exemple", icon: "👀", label: "Les listes en action",
        code: `# Créer une liste\nfilms = ["Dune", "Interstellar", "Avatar"]\n\n# Accéder aux éléments\nprint(films[0])   # Dune\nprint(films[2])   # Avatar\nprint(len(films)) # 3\n\n# Ajouter un film\nfilms.append("Oppenheimer")\nprint(films)`,
        result: `Dune\nAvatar\n3\n['Dune', 'Interstellar', 'Avatar', 'Oppenheimer']`,
      },
      {
        type: "exercice", icon: "✏️", label: "À toi !",
        prompt: `Crée une liste de 4 matières que tu aimes à l'école. Affiche la première, la dernière, et le nombre total. Puis ajoute une 5ème matière et affiche la liste complète.`,
        placeholder: "matieres = [..., ..., ..., ...]\nprint(matieres[0])\nprint(matieres[-1])\nprint(len(matieres))\nmatieres.append(...)\nprint(matieres)",
        cleoPrompt: `L'exercice : créer une liste de 4 éléments, afficher le premier (indice 0), le dernier (indice -1 ou 3), len(), puis append() et afficher la liste complète. Vérifie que la liste a bien 4 éléments au départ, que append fonctionne, et que la liste finale a 5 éléments.`,
      },
    ],
  },
  {
    id: 10, phase: 1, title: "Parcourir une liste",
    tag: "Python · Leçon 10",
    desc: "Combiner for et les listes pour traiter chaque élément.",
    steps: [
      {
        type: "cours", icon: "📖", label: "for et les listes",
        content: `On peut utiliser for pour parcourir tous les éléments d'une liste, un par un :\n\nfor element in ma_liste:\n    print(element)\n\nPython prend chaque élément de la liste à tour de rôle et le met dans la variable "element".`,
        analogy: "🧠 C'est comme lire une liste de courses : tu regardes chaque article un par un, tu coches, tu passes au suivant.",
      },
      {
        type: "exemple", icon: "👀", label: "Parcourir une liste",
        code: `notes = [14, 18, 12, 16, 9]\n\nprint("Mes notes :")\nfor note in notes:\n    print("-", note, "/20")\n\ntotal = 0\nfor note in notes:\n    total = total + note\n\nmoyenne = total / len(notes)\nprint("Ma moyenne :", moyenne)`,
        result: `Mes notes :\n- 14 /20\n- 18 /20\n- 12 /20\n- 16 /20\n- 9 /20\nMa moyenne : 13.8`,
      },
      {
        type: "exercice", icon: "✏️", label: "À toi !",
        prompt: `Crée une liste de 5 températures (en degrés). Écris un programme qui affiche chaque température, dit si elle est froide (<10), douce (10-20), ou chaude (>20), et calcule la température moyenne.`,
        placeholder: "temperatures = [5, 15, 28, 10, 22]\nfor t in temperatures:\n    print(t, \"degrés\")\n    if t < 10:\n        print(\"→ Froid !\")\n    ...",
        cleoPrompt: `L'exercice : liste de 5 températures, boucle for qui affiche chaque température avec sa catégorie (froid/doux/chaud), puis calcul de la moyenne. Vérifie les 3 conditions, le calcul de moyenne, et que tout est dans une boucle.`,
      },
    ],
  },
  {
    id: 11, phase: 1, title: "Les fonctions",
    tag: "Python · Leçon 11",
    desc: "Créer tes propres commandes réutilisables.",
    steps: [
      {
        type: "cours", icon: "📖", label: "Créer une fonction",
        content: `Une fonction c'est un bloc de code qu'on peut réutiliser. On la définit avec def, puis on l'appelle par son nom.\n\ndef nom_de_la_fonction(parametre):\n    # code ici\n    return resultat\n\n· def → définir\n· parametre → ce qu'on lui donne\n· return → ce qu'elle renvoie`,
        analogy: "🧠 Une fonction c'est comme une machine : tu mets quelque chose dedans (les paramètres), elle fait son truc, et te rend le résultat.",
      },
      {
        type: "exemple", icon: "👀", label: "Des fonctions en action",
        code: `def saluer(prenom):\n    message = "Bonjour " + prenom + " !"\n    return message\n\ndef calculer_moyenne(liste_notes):\n    total = sum(liste_notes)\n    return total / len(liste_notes)\n\nprint(saluer("Adèle"))\nnotes = [14, 16, 12]\nprint("Moyenne :", calculer_moyenne(notes))`,
        result: `Bonjour Adèle !\nMoyenne : 14.0`,
      },
      {
        type: "exercice", icon: "✏️", label: "À toi !",
        prompt: `Crée deux fonctions :\n1. "convertir_celsius_fahrenheit(celsius)" qui convertit une température (formule : celsius * 9/5 + 32)\n2. "est_chaud(temp_celsius)" qui retourne True si la temp est > 25\n\nTest avec quelques valeurs.`,
        placeholder: "def convertir_celsius_fahrenheit(celsius):\n    fahrenheit = celsius * 9/5 + 32\n    return fahrenheit\n\ndef est_chaud(temp_celsius):\n    return temp_celsius > 25\n\nprint(convertir_celsius_fahrenheit(100))\nprint(est_chaud(30))",
        cleoPrompt: `L'exercice : deux fonctions — une qui convertit celsius en fahrenheit (formule: celsius * 9/5 + 32), une qui retourne True/False si > 25. Vérifie la formule de conversion, l'utilisation de return, et que les deux fonctions sont testées avec des appels.`,
      },
    ],
  },
  {
    id: 12, phase: 1, title: "Mini projet — Jeu de devinette",
    tag: "Projet · Leçon 12",
    desc: "Tu combines tout ce que tu sais pour créer un vrai jeu !",
    steps: [
      {
        type: "cours", icon: "📖", label: "Ce que tu vas créer",
        content: `Un jeu de devinette complet :\n· L'ordi choisit un nombre secret entre 1 et 20\n· Tu devines\n· Il te dit "trop petit", "trop grand", ou "bravo !"\n· Il compte tes essais\n· Il te félicite si tu trouves en moins de 5 essais\n\nPour le nombre aléatoire, tu auras besoin de :\nimport random\nnombre_secret = random.randint(1, 20)`,
        analogy: "🏆 C'est un vrai programme. Quand tu auras fini, tu pourras le faire jouer à tes amis.",
      },
      {
        type: "exemple", icon: "👀", label: "La structure du jeu",
        code: `import random\n\n# 1. Choisir un nombre secret\n# 2. Mettre le nombre d'essais à 0\n# 3. Boucle : demander une devinette\n# 4. Comparer avec le secret\n# 5. Trop petit / trop grand / gagné\n# 6. Compter les essais\n# 7. Fin du jeu`,
        result: `Devine le nombre entre 1 et 20 !\nTon choix : 10\nTrop petit !\nTon choix : 15\nTrop grand !\nTon choix : 12\nBravo ! Trouvé en 3 essais !`,
      },
      {
        type: "exercice", icon: "🏆", label: "Crée le jeu !",
        prompt: `Écris le jeu de devinette complet. Le programme doit :\n1. Importer random et choisir un nombre entre 1 et 20\n2. Demander des devinettes en boucle\n3. Dire "trop petit" ou "trop grand"\n4. S'arrêter quand le joueur a trouvé\n5. Afficher le nombre d'essais\n6. Dire "Champion !" si <= 5 essais`,
        placeholder: "import random\nnombre_secret = random.randint(1, 20)\nessais = 0\ntrouve = False\n\nwhile not trouve:\n    devinette = int(input(\"Ton choix : \"))\n    essais += 1\n    if devinette < nombre_secret:\n        print(\"Trop petit !\")\n    elif devinette > nombre_secret:\n        print(\"Trop grand !\")\n    else:\n        trouve = True\n        print(\"Bravo ! En\", essais, \"essais !\")",
        cleoPrompt: `Mini projet : jeu de devinette complet. Critères : import random + randint(1,20), boucle while, input() pour les devinettes, les 3 conditions (trop petit/grand/trouvé), compteur d'essais, message de fin avec le nombre d'essais. Bonus si <= 5 essais. Sois très encourageante — c'est leur premier vrai programme !`,
      },
    ],
  },
];

// ─── STYLES ─────────────────────────────────────────────────────────────────

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --adele: #e879a0;
    --adele-light: #fce7f3;
    --soline: #7c3aed;
    --soline-light: #ede9fe;
    --bg: #f8f7f4;
    --surface: #ffffff;
    --border: rgba(0,0,0,0.08);
    --text: #1a1a1a;
    --muted: #6b7280;
    --hint: #9ca3af;
    --code-bg: #1e1e2e;
    --radius: 16px;
    --radius-sm: 10px;
    --accent: #e879a0;
  }

  body {
    font-family: 'Nunito', sans-serif;
    background: var(--bg);
    color: var(--text);
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
  }

  .app { min-height: 100vh; position: relative; }

  .screen { display: none; padding: 1.5rem 1.25rem 88px; max-width: 480px; margin: 0 auto; }
  .screen.active { display: block; }

  .card {
    background: var(--surface);
    border-radius: var(--radius);
    border: 1px solid var(--border);
    padding: 1.25rem;
    margin-bottom: 0.875rem;
  }

  .btn {
    display: inline-flex; align-items: center; justify-content: center;
    gap: 6px; padding: 0.65rem 1.25rem;
    border-radius: var(--radius-sm); font-size: 14px; font-weight: 700;
    cursor: pointer; border: none; transition: all 0.15s;
    font-family: 'Nunito', sans-serif;
  }
  .btn:active { transform: scale(0.97); }
  .btn-primary { color: white; }
  .btn-outline { background: transparent; border: 1.5px solid var(--border); color: var(--text); }
  .btn-outline:hover { background: var(--bg); }
  .btn-full { width: 100%; }
  .btn-sm { padding: 0.45rem 0.9rem; font-size: 13px; }

  .welcome-hero { text-align: center; padding: 2.5rem 1rem 2rem; }
  .welcome-logo { font-size: 40px; margin-bottom: 10px; }
  .welcome-title { font-size: 28px; font-weight: 800; color: var(--text); margin-bottom: 6px; letter-spacing: -0.5px; }
  .welcome-sub { font-size: 14px; color: var(--muted); line-height: 1.6; }
  .welcome-tagline { font-size: 12px; color: var(--hint); margin-top: 4px; font-style: italic; }

  .profiles-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 1rem; }
  .profile-card {
    background: var(--surface); border-radius: var(--radius);
    border: 1.5px solid var(--border);
    padding: 1.5rem 1rem; text-align: center;
    cursor: pointer; transition: all 0.2s;
  }
  .profile-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.08); }
  .profile-card.adele:hover { border-color: var(--adele); }
  .profile-card.soline:hover { border-color: var(--soline); }

  .profile-avatar {
    width: 72px; height: 72px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 32px; margin: 0 auto 12px;
  }
  .profile-name { font-size: 18px; font-weight: 800; margin-bottom: 3px; }
  .profile-age { font-size: 12px; color: var(--muted); margin-bottom: 12px; }
  .profile-pill {
    font-size: 11px; font-weight: 700; padding: 4px 12px;
    border-radius: 999px; display: inline-block; margin-bottom: 10px;
  }

  .xp-bar-wrap { background: var(--bg); border-radius: 999px; height: 6px; overflow: hidden; }
  .xp-bar { height: 100%; border-radius: 999px; transition: width 0.6s ease; }
  .xp-label { font-size: 11px; color: var(--muted); margin-top: 4px; }

  .dash-header { display: flex; align-items: center; gap: 12px; margin-bottom: 1.25rem; }
  .dash-avatar { width: 52px; height: 52px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; flex-shrink: 0; }

  .streak-card {
    border-radius: var(--radius); padding: 1rem 1.25rem;
    display: flex; align-items: center; gap: 14px;
    margin-bottom: 0.875rem;
  }
  .streak-fire { font-size: 32px; }
  .streak-num { font-size: 32px; font-weight: 800; line-height: 1; }
  .streak-label { font-size: 13px; margin-top: 2px; color: var(--muted); }

  .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 0.875rem; }
  .stat-card {
    background: var(--surface); border-radius: var(--radius-sm);
    border: 1px solid var(--border); padding: 0.75rem; text-align: center;
  }
  .stat-num { font-size: 22px; font-weight: 800; }
  .stat-label { font-size: 11px; color: var(--muted); margin-top: 2px; }

  .section-title { font-size: 11px; font-weight: 700; color: var(--muted); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 8px; }

  .badges-row { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px; margin-bottom: 0.875rem; }
  .badge-chip {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--radius-sm); padding: 8px 12px;
    display: flex; align-items: center; gap: 6px; white-space: nowrap;
    font-size: 12px; font-weight: 700; flex-shrink: 0;
  }
  .badge-chip.locked { opacity: 0.35; }
  .badge-icon { font-size: 18px; }

  .phase-card {
    background: var(--surface); border: 1.5px solid var(--border);
    border-radius: var(--radius); padding: 1rem 1.25rem;
    display: flex; gap: 14px; align-items: flex-start;
    margin-bottom: 10px; cursor: pointer; transition: all 0.15s;
  }
  .phase-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.07); }
  .phase-icon-wrap { width: 44px; height: 44px; border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; }
  .phase-badge { font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 999px; white-space: nowrap; }

  .step-row {
    display: flex; align-items: center; gap: 12px; padding: 0.75rem;
    border-radius: var(--radius-sm); background: var(--bg);
    cursor: pointer; margin-bottom: 8px; transition: background 0.1s;
    border: 1.5px solid transparent;
  }
  .step-row.active { background: var(--surface); border-color: rgba(0,0,0,0.1); }
  .step-num {
    width: 30px; height: 30px; border-radius: 50%; display: flex;
    align-items: center; justify-content: center; font-size: 12px;
    font-weight: 700; flex-shrink: 0;
    background: var(--surface); border: 1.5px solid var(--border); color: var(--muted);
  }
  .step-num.done { color: white; border: none; background: #10b981; }
  .step-num.current { color: white; border: none; }
  .step-text { font-size: 14px; font-weight: 700; }
  .step-sub { font-size: 12px; color: var(--muted); }

  .content-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 1.25rem; margin-bottom: 0.875rem; }
  .content-title { font-size: 17px; font-weight: 800; margin-bottom: 10px; }
  .content-body { font-size: 15px; line-height: 1.7; color: var(--text); white-space: pre-line; }
  .analogy-box {
    background: var(--bg); border-left: 3px solid;
    border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
    padding: 0.75rem 1rem; margin: 12px 0;
    font-size: 14px; color: var(--muted); font-style: italic; line-height: 1.5;
  }

  .code-block {
    background: var(--code-bg); border-radius: var(--radius-sm);
    padding: 1rem; margin: 12px 0;
    font-family: 'JetBrains Mono', monospace; font-size: 13px;
    color: #cdd6f4; line-height: 1.7; overflow-x: auto;
  }
  .code-result {
    background: #1a2a1a; border-radius: var(--radius-sm);
    padding: 0.75rem 1rem; margin-top: 8px;
    font-family: 'JetBrains Mono', monospace; font-size: 12px;
    color: #a6e3a1; line-height: 1.6; white-space: pre;
  }

  .code-input {
    width: 100%; min-height: 100px;
    background: var(--code-bg); border: 1.5px solid rgba(255,255,255,0.08);
    border-radius: var(--radius-sm); padding: 0.875rem;
    font-family: 'JetBrains Mono', monospace; font-size: 13px;
    color: #cdd6f4; resize: vertical; outline: none; line-height: 1.6;
    transition: border-color 0.15s;
  }
  .code-input:focus { border-color: rgba(255,255,255,0.2); }

  .cleo-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 1.25rem; margin-bottom: 0.875rem; }
  .cleo-header { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
  .cleo-avatar {
    width: 38px; height: 38px; border-radius: 50%;
    background: linear-gradient(135deg, #7c3aed, #e879a0);
    display: flex; align-items: center; justify-content: center; font-size: 18px;
    flex-shrink: 0;
  }
  .cleo-name { font-size: 14px; font-weight: 700; }
  .cleo-role { font-size: 12px; color: var(--muted); }
  .cleo-bubble {
    background: var(--bg); border-radius: var(--radius-sm);
    padding: 0.875rem; font-size: 14px; line-height: 1.7;
    min-height: 52px; color: var(--text);
  }

  .dots { display: flex; gap: 5px; align-items: center; padding: 4px 0; }
  .dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: var(--muted); animation: bounce 1.2s infinite;
  }
  .dot:nth-child(2) { animation-delay: 0.2s; }
  .dot:nth-child(3) { animation-delay: 0.4s; }
  @keyframes bounce { 0%,100%{transform:translateY(0);opacity:0.4} 50%{transform:translateY(-5px);opacity:1} }

  .confetti { position: fixed; width: 9px; height: 9px; border-radius: 2px; animation: fall 2.2s ease-in forwards; z-index: 500; pointer-events: none; }
  @keyframes fall { 0%{opacity:1;transform:translateY(-20px) rotate(0deg)} 100%{opacity:0;transform:translateY(105vh) rotate(900deg)} }

  .toast {
    position: fixed; top: 1rem; left: 50%;
    transform: translateX(-50%) translateY(-80px);
    background: var(--text); color: white;
    border-radius: var(--radius-sm); padding: 0.75rem 1.25rem;
    font-size: 14px; font-weight: 700; z-index: 400;
    transition: transform 0.3s; pointer-events: none;
  }
  .toast.show { transform: translateX(-50%) translateY(0); }

  .bottom-nav {
    position: fixed; bottom: 0; left: 0; right: 0;
    background: var(--surface); border-top: 1px solid var(--border);
    display: flex; padding: 0.5rem 0 0.75rem; z-index: 100;
  }
  .nav-btn {
    flex: 1; display: flex; flex-direction: column; align-items: center;
    gap: 3px; padding: 0.4rem; cursor: pointer;
    color: var(--hint); font-size: 10px; font-weight: 700;
    border: none; background: none; font-family: 'Nunito', sans-serif;
    transition: color 0.15s;
  }
  .nav-btn.active { color: var(--text); }
  .nav-icon { font-size: 22px; }

  .pin-wrap { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 65vh; }
  .pin-title { font-size: 22px; font-weight: 800; margin-bottom: 6px; }
  .pin-sub { font-size: 14px; color: var(--muted); margin-bottom: 1.5rem; }
  .pin-dots { display: flex; gap: 14px; margin-bottom: 0.5rem; }
  .pin-dot { width: 15px; height: 15px; border-radius: 50%; border: 2px solid var(--border); background: transparent; transition: all 0.15s; }
  .pin-dot.filled { background: var(--text); border-color: var(--text); }
  .pin-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; width: 240px; margin-top: 1rem; }
  .pin-key {
    padding: 1.1rem; background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--radius-sm); font-size: 22px; font-weight: 700;
    cursor: pointer; text-align: center; transition: background 0.1s;
    font-family: 'Nunito', sans-serif; color: var(--text);
  }
  .pin-key:hover { background: var(--bg); }
  .pin-error { color: #e24b4a; font-size: 13px; font-weight: 700; margin-top: 8px; min-height: 20px; text-align: center; }
  .pin-hint { font-size: 12px; color: var(--hint); margin-top: 16px; }

  .tab-bar { display: flex; background: var(--bg); border-radius: var(--radius-sm); padding: 3px; margin-bottom: 1.25rem; gap: 3px; }
  .tab-btn { flex: 1; padding: 0.5rem; text-align: center; font-size: 13px; font-weight: 700; border-radius: 8px; cursor: pointer; color: var(--muted); border: none; background: transparent; font-family: 'Nunito', sans-serif; transition: all 0.15s; }
  .tab-btn.active { background: var(--surface); color: var(--text); border: 1px solid var(--border); }

  .child-tab { display: none; }
  .child-tab.active { display: block; }

  .skill-row { margin-bottom: 12px; }
  .skill-label { display: flex; justify-content: space-between; font-size: 13px; font-weight: 600; margin-bottom: 5px; }
  .eval-row {
    display: flex; align-items: center; gap: 10px; padding: 0.75rem;
    background: var(--bg); border-radius: var(--radius-sm); margin-bottom: 6px;
  }
  .eval-score { font-size: 16px; font-weight: 800; min-width: 44px; }
  .eval-name { font-size: 13px; font-weight: 600; flex: 1; }
  .eval-date { font-size: 11px; color: var(--muted); }

  .alert-box { background: #fef9c3; border: 1px solid #d97706; border-radius: var(--radius-sm); padding: 0.75rem 1rem; font-size: 13px; font-weight: 600; color: #92400e; margin-bottom: 1rem; }
  .good-box { background: #dcfce7; border: 1px solid #16a34a; border-radius: var(--radius-sm); padding: 0.75rem 1rem; font-size: 13px; font-weight: 600; color: #15803d; margin-bottom: 1rem; }

  .timeline-item { display: flex; gap: 12px; align-items: flex-start; margin-bottom: 12px; }
  .tl-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; margin-top: 4px; }
  .tl-text { font-size: 13px; font-weight: 600; }
  .tl-date { font-size: 11px; color: var(--muted); margin-top: 2px; }

  .back-btn { display: inline-flex; align-items: center; gap: 6px; font-size: 14px; font-weight: 700; color: var(--muted); cursor: pointer; background: none; border: none; font-family: 'Nunito', sans-serif; margin-bottom: 1.25rem; padding: 0; }

  .complete-screen { text-align: center; padding: 2rem 0; }
  .complete-trophy { font-size: 64px; margin-bottom: 12px; }
  .xp-gained { display: inline-block; background: var(--bg); border-radius: var(--radius-sm); padding: 0.75rem 1.5rem; font-size: 24px; font-weight: 800; margin: 1rem 0; }

  .loading-overlay { display: flex; align-items: center; justify-content: center; min-height: 60vh; flex-direction: column; gap: 12px; }
  .loading-text { font-size: 14px; color: var(--muted); font-weight: 600; }
`;

// ─── MAIN APP ────────────────────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen] = useState("welcome");
  const [profile, setProfile] = useState(null);
  const [progression, setProgression] = useState({ adele: null, soline: null });
  const [loadingDb, setLoadingDb] = useState(true);
  const [pinEntry, setPinEntry] = useState("");
  const [pinError, setPinError] = useState("");
  const [parentTab, setParentTab] = useState("adele");
  const [currentLesson, setCurrentLesson] = useState(LESSONS[0]);
  const [currentStep, setCurrentStep] = useState(0);
  const [cleoMessage, setCleoMessage] = useState("");
  const [cleoLoading, setCleoLoading] = useState(false);
  const [cleoValid, setCleoValid] = useState(null);
  const [cleoXp, setCleoXp] = useState(0);
  const [codeValue, setCodeValue] = useState("");
  const [toast, setToast] = useState({ msg: "", show: false });
  const [lessonDone, setLessonDone] = useState(false);
  const toastTimer = useRef(null);
  const CORRECT_PIN = "1234";

  // ── Charger la progression depuis Supabase ──
  useEffect(() => {
    const loadProgression = async () => {
      setLoadingDb(true);
      try {
        const { data, error } = await supabase
          .from("progression")
          .select("*");
        if (error) throw error;
        const prog = {};
        data.forEach(row => {
          prog[row.profil] = row;
        });
        setProgression(prog);
      } catch (err) {
        console.error("Erreur Supabase:", err);
        showToast("Impossible de charger la progression 😕");
      }
      setLoadingDb(false);
    };
    loadProgression();
  }, []);

  useEffect(() => {
    const styleEl = document.createElement("style");
    styleEl.textContent = css;
    document.head.appendChild(styleEl);
    return () => document.head.removeChild(styleEl);
  }, []);

  const goTo = (s) => { setScreen(s); window.scrollTo(0, 0); };

  const showToast = (msg) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ msg, show: true });
    toastTimer.current = setTimeout(() => setToast({ msg: "", show: false }), 2500);
  };

  const confetti = (color) => {
    const colors = [color, "#f59e0b", "#10b981", "#60a5fa", "#f472b6"];
    for (let i = 0; i < 35; i++) {
      const el = document.createElement("div");
      el.className = "confetti";
      el.style.left = Math.random() * 100 + "vw";
      el.style.top = "-10px";
      el.style.background = colors[Math.floor(Math.random() * colors.length)];
      el.style.animationDelay = Math.random() * 0.9 + "s";
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 2500);
    }
  };

  // ── Sauvegarder dans Supabase après une leçon ──
  const saveProgression = async (profileId, xpGained) => {
    const current = progression[profileId];
    if (!current) return;
    const today = new Date().toISOString().split("T")[0];
    const newXp = (current.xp || 0) + xpGained;
    const newLecons = (current.lecons_terminees || 0) + 1;
    const newStreak = current.derniere_activite === today
      ? current.streak
      : (current.streak || 0) + 1;

    const { error } = await supabase
      .from("progression")
      .update({
        xp: newXp,
        lecons_terminees: newLecons,
        streak: newStreak,
        derniere_activite: today,
      })
      .eq("profil", profileId);

    if (error) {
      console.error("Erreur sauvegarde:", error);
      showToast("Progression non sauvegardée 😕");
    } else {
      setProgression(prev => ({
        ...prev,
        [profileId]: { ...prev[profileId], xp: newXp, lecons_terminees: newLecons, streak: newStreak, derniere_activite: today }
      }));
      showToast("Progression sauvegardée ! 🎉");
    }
  };

  // ── Helper : données du profil actif (Supabase + statique) ──
  const getProfileData = (id) => {
    const base = PROFILES_DATA[id];
    const db = progression[id];
    return {
      ...base,
      xp: db?.xp ?? 0,
      lessons: db?.lecons_terminees ?? 0,
      streak: db?.streak ?? 0,
      score: 90,
      phase: db ? Math.round(((db.lecons_terminees || 0) / 28) * 100) : 0,
      phaseLabel: `Leçon ${db?.lecons_terminees ?? 0} / 28`,
    };
  };

  // PIN
  const handlePin = (n) => {
    if (pinEntry.length >= 4) return;
    const next = pinEntry + n;
    setPinEntry(next);
    if (next.length === 4) {
      setTimeout(() => {
        if (next === CORRECT_PIN) {
          setPinEntry(""); setPinError("");
          goTo("parent");
        } else {
          setPinError("Code incorrect, réessaie.");
          setPinEntry("");
        }
      }, 200);
    }
  };
  const pinBack = () => setPinEntry(p => p.slice(0, -1));
  const pinClear = () => { setPinEntry(""); setPinError(""); };

  // Lesson navigation
  const openLesson = (lesson) => {
    setCurrentLesson(lesson);
    setCurrentStep(0);
    setCleoMessage(""); setCleoValid(null); setCleoXp(0);
    setCodeValue(""); setLessonDone(false);
    goTo("lesson");
  };

  const goStep = (n) => {
    setCurrentStep(n);
    setCleoMessage(""); setCleoValid(null);
  };

  // Cleo AI
  const askCleo = async () => {
    if (!codeValue.trim() || codeValue.trim().length < 5) {
      showToast("Écris du code avant de soumettre !"); return;
    }
    setCleoLoading(true); setCleoMessage(""); setCleoValid(null);
    const step = currentLesson.steps[currentStep];
    const profileName = profile ? PROFILES_DATA[profile].name : "l'élève";
    const profileAge = profile ? PROFILES_DATA[profile].age : 12;
    try {
      const resp = await fetch("/api/cleo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-opus-4-5",
          max_tokens: 1000,
          system: `Tu es Cleo, une coach IA bienveillante et exigeante pour des jeunes qui apprennent Python. L'élève s'appelle ${profileName}, ${profileAge} ans, débutante absolue. Règles : commence par valoriser ce qui est bien, explique les erreurs très simplement avec des analogies, ne valide JAMAIS un code incomplet ou incorrect, si tout est correct félicite chaleureusement. Max 4 phrases. Réponds UNIQUEMENT en JSON : {"feedback":"...","valid":true/false,"xp":0 ou 50}`,
          messages: [{
            role: "user",
            content: `Exercice attendu : ${step.cleoPrompt}\n\nCode soumis :\n${codeValue}`
          }]
        })
      });
      const data = await resp.json();
      const raw = data.content?.[0]?.text || "{}";
      let result;
      try { result = JSON.parse(raw.replace(/```json|```/g, "").trim()); }
      catch { result = { feedback: raw, valid: false, xp: 0 }; }
      setCleoMessage(result.feedback || "");
      setCleoValid(result.valid || false);
      setCleoXp(result.xp || 50);
      if (result.valid) {
        confetti(profile ? PROFILES_DATA[profile].color : "#7c3aed");
      }
    } catch {
      setCleoMessage("Oups, Cleo n'arrive pas à te répondre. Vérifie ta connexion !");
      setCleoValid(false);
    }
    setCleoLoading(false);
  };

  const validateLesson = async () => {
    if (profile) {
      await saveProgression(profile, cleoXp || 50);
    }
    setLessonDone(true);
    setCleoMessage(""); setCleoValid(null);
  };

  // ── RENDER ──────────────────────────────────────────────────────────────────

  const p = profile ? getProfileData(profile) : null;

  if (loadingDb) {
    return (
      <div className="app">
        <style>{css}</style>
        <div className="loading-overlay">
          <div style={{ fontSize: 40 }}>✨</div>
          <div className="dots"><div className="dot" /><div className="dot" /><div className="dot" /></div>
          <div className="loading-text">Chargement de ta progression…</div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className={`toast ${toast.show ? "show" : ""}`}>{toast.msg}</div>

      {/* WELCOME */}
      <div className={`screen ${screen === "welcome" ? "active" : ""}`}>
        <div className="welcome-hero">
          <div className="welcome-logo">✨</div>
          <div className="welcome-title">AI Kids Daily</div>
          <div className="welcome-sub">Ton aventure tech commence ici.</div>
          <div className="welcome-tagline">10 min par soir. Dans 2 ans, top 1%.</div>
        </div>
        <div className="profiles-grid">
          {Object.values(PROFILES_DATA).map(prof => {
            const dbData = progression[prof.id];
            const xp = dbData?.xp ?? 0;
            return (
              <div
                key={prof.id}
                className={`profile-card ${prof.id}`}
                onClick={() => { setProfile(prof.id); goTo("dashboard"); }}
              >
                <div className="profile-avatar" style={{ background: prof.light }}>{prof.avatar}</div>
                <div className="profile-name">{prof.name}</div>
                <div className="profile-age">{prof.age} ans</div>
                <div className="profile-pill" style={{ background: prof.light, color: prof.color }}>
                  Niveau 1 · Éveil
                </div>
                <div className="xp-bar-wrap">
                  <div className="xp-bar" style={{ width: `${(xp / prof.maxXp) * 100}%`, background: prof.color }} />
                </div>
                <div className="xp-label">{xp} / {prof.maxXp} XP</div>
              </div>
            );
          })}
        </div>
        <button className="btn btn-outline btn-full" style={{ fontSize: 13, color: "var(--muted)" }} onClick={() => goTo("pin")}>
          🔒 Espace parents
        </button>
      </div>

      {/* DASHBOARD */}
      {p && (
        <div className={`screen ${screen === "dashboard" ? "active" : ""}`}>
          <div className="dash-header">
            <div className="dash-avatar" style={{ background: p.light }}>{p.avatar}</div>
            <div>
              <div style={{ fontSize: 19, fontWeight: 800 }}>{p.name}</div>
              <div style={{ fontSize: 13, color: "var(--muted)" }}>{p.age} ans · Phase 1 Éveil · Niveau 1</div>
            </div>
            <button className="btn btn-outline btn-sm" style={{ marginLeft: "auto" }} onClick={() => goTo("welcome")}>Changer</button>
          </div>

          <div className="streak-card" style={{ background: p.light }}>
            <div className="streak-fire">🔥</div>
            <div>
              <div className="streak-num">{p.streak}</div>
              <div className="streak-label">jours de suite · continue !</div>
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-card"><div className="stat-num">{p.lessons}</div><div className="stat-label">leçons</div></div>
            <div className="stat-card"><div className="stat-num">{p.xp}</div><div className="stat-label">XP</div></div>
            <div className="stat-card"><div className="stat-num">{p.score}%</div><div className="stat-label">score moy.</div></div>
          </div>

          <div className="card">
            <div className="section-title">Phase 1 · Éveil 🌱</div>
            <div className="xp-bar-wrap" style={{ height: 10, marginBottom: 6 }}>
              <div className="xp-bar" style={{ width: `${p.phase}%`, background: p.color }} />
            </div>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>{p.phaseLabel} · Mois 1 sur 3</div>
          </div>

          <div className="section-title">Badges</div>
          <div className="badges-row">
            {[
              { icon: "🐍", label: "Premier print", locked: p.lessons < 1 },
              { icon: "📦", label: "Variable maîtrisée", locked: p.lessons < 3 },
              { icon: "🔄", label: "Boucle for", locked: p.lessons < 8 },
              { icon: "🔀", label: "if/else pro", locked: p.lessons < 6 },
              { icon: "📋", label: "Listes", locked: p.lessons < 9 },
              { icon: "🤖", label: "Hello IA", locked: true },
            ].map((b, i) => (
              <div key={i} className={`badge-chip ${b.locked ? "locked" : ""}`}>
                <span className="badge-icon">{b.icon}</span>
                <span>{b.label}</span>
              </div>
            ))}
          </div>

          <button
            className="btn btn-primary btn-full"
            style={{ background: p.color, marginBottom: 8 }}
            onClick={() => openLesson(LESSONS[Math.min(p.lessons, LESSONS.length - 1)])}
          >
            Leçon du jour →
          </button>
          <button className="btn btn-outline btn-full" style={{ fontSize: 13 }} onClick={() => goTo("roadmap")}>
            Voir la roadmap 2 ans
          </button>

          <div className="bottom-nav">
            <button className="nav-btn active"><span className="nav-icon">🏠</span>Accueil</button>
            <button className="nav-btn" onClick={() => goTo("roadmap")}><span className="nav-icon">🗺</span>Roadmap</button>
            <button className="nav-btn" onClick={() => goTo("lessons")}><span className="nav-icon">📚</span>Leçons</button>
            <button className="nav-btn" onClick={() => goTo("pin")}><span className="nav-icon">👨‍👩‍👧</span>Parents</button>
          </div>
        </div>
      )}

      {/* LESSONS LIST */}
      <div className={`screen ${screen === "lessons" ? "active" : ""}`}>
        <button className="back-btn" onClick={() => goTo("dashboard")}>← Retour</button>
        <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>Toutes les leçons</div>
        <div style={{ fontSize: 14, color: "var(--muted)", marginBottom: 20 }}>Phase 1 · Éveil — 12 leçons</div>
        {LESSONS.map((lesson) => {
          const lessonsCount = p?.lessons ?? 0;
          const done = lesson.id <= lessonsCount;
          const current = lesson.id === lessonsCount + 1;
          return (
            <div
              key={lesson.id}
              className="card"
              style={{
                display: "flex", gap: 14, alignItems: "center",
                opacity: (!done && !current) ? 0.5 : 1,
                cursor: (done || current) ? "pointer" : "default",
                borderColor: current && p ? p.color : undefined,
                borderWidth: current ? 1.5 : 1,
              }}
              onClick={() => (done || current) && openLesson(lesson)}
            >
              <div style={{
                width: 40, height: 40, borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 18, flexShrink: 0,
                background: done ? "#dcfce7" : current && p ? p.light : "var(--bg)",
              }}>
                {done ? "✅" : lesson.isEval ? "🏆" : `${lesson.id}`}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{lesson.title}</div>
                <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{lesson.tag}</div>
              </div>
              {current && <div style={{ fontSize: 12, fontWeight: 700, color: p?.color }}>En cours</div>}
            </div>
          );
        })}
        <div className="bottom-nav">
          <button className="nav-btn" onClick={() => goTo("dashboard")}><span className="nav-icon">🏠</span>Accueil</button>
          <button className="nav-btn" onClick={() => goTo("roadmap")}><span className="nav-icon">🗺</span>Roadmap</button>
          <button className="nav-btn active"><span className="nav-icon">📚</span>Leçons</button>
          <button className="nav-btn" onClick={() => goTo("pin")}><span className="nav-icon">👨‍👩‍👧</span>Parents</button>
        </div>
      </div>

      {/* ROADMAP */}
      <div className={`screen ${screen === "roadmap" ? "active" : ""}`}>
        <button className="back-btn" onClick={() => goTo("dashboard")}>← Retour</button>
        <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>Ta roadmap 2 ans</div>
        <div style={{ fontSize: 14, color: "var(--muted)", marginBottom: 20 }}>Chaque phase = un projet concret que tu gardes pour toujours.</div>
        {PHASES.map((ph, i) => (
          <div key={i} className="phase-card" style={{ opacity: i === 0 ? 1 : i === 1 ? 0.6 : i === 2 ? 0.35 : 0.2 }}>
            <div className="phase-icon-wrap" style={{ background: ph.bg }}>{ph.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 2 }}>Phase {i + 1} · {ph.name}</div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4 }}>{ph.months} · {ph.desc}</div>
              <div style={{ fontSize: 12, color: ph.text, fontWeight: 700 }}>🎯 {ph.project}</div>
            </div>
            {i === 0 && <div className="phase-badge" style={{ background: ph.bg, color: ph.text }}>En cours</div>}
          </div>
        ))}
        <div className="bottom-nav">
          <button className="nav-btn" onClick={() => goTo("dashboard")}><span className="nav-icon">🏠</span>Accueil</button>
          <button className="nav-btn active"><span className="nav-icon">🗺</span>Roadmap</button>
          <button className="nav-btn" onClick={() => goTo("lessons")}><span className="nav-icon">📚</span>Leçons</button>
          <button className="nav-btn" onClick={() => goTo("pin")}><span className="nav-icon">👨‍👩‍👧</span>Parents</button>
        </div>
      </div>

      {/* LESSON */}
      <div className={`screen ${screen === "lesson" ? "active" : ""}`}>
        <button className="back-btn" onClick={() => goTo("lessons")}>← Retour</button>

        <div className="card" style={{ marginBottom: "0.875rem" }}>
          <div style={{
            fontSize: 11, fontWeight: 700, padding: "3px 10px",
            borderRadius: 999, display: "inline-block", marginBottom: 8,
            background: p ? p.light : "#f3f4f6", color: p ? p.color : "#6b7280"
          }}>
            {currentLesson.tag}
          </div>
          <div style={{ fontSize: 17, fontWeight: 800, marginBottom: 4 }}>{currentLesson.title}</div>
          <div style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.5 }}>{currentLesson.desc}</div>
        </div>

        <div className="card">
          {currentLesson.steps.map((step, i) => {
            const isDone = i < currentStep || lessonDone;
            const isCurrent = i === currentStep && !lessonDone;
            return (
              <div
                key={i}
                className={`step-row ${isCurrent ? "active" : ""}`}
                onClick={() => !lessonDone && goStep(i)}
                style={{ opacity: i > currentStep && !lessonDone ? 0.4 : 1 }}
              >
                <div
                  className={`step-num ${isDone ? "done" : isCurrent ? "current" : ""}`}
                  style={isCurrent && p ? { background: p.color } : undefined}
                >
                  {isDone ? "✓" : i + 1}
                </div>
                <div>
                  <div className="step-text">{step.icon} {step.label}</div>
                  <div className="step-sub">
                    {step.type === "cours" ? "Lis et comprends" :
                      step.type === "exemple" ? "Regarde bien" : "À toi de coder"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {!lessonDone && currentLesson.steps.map((step, i) => {
          if (i !== currentStep) return null;
          return (
            <div key={i}>
              {step.type === "cours" && (
                <div className="content-card">
                  <div className="content-title">{step.icon} {step.label}</div>
                  <div className="content-body">{step.content}</div>
                  {step.analogy && (
                    <div className="analogy-box" style={{ borderColor: p ? p.color : "#7c3aed" }}>
                      {step.analogy}
                    </div>
                  )}
                  <button
                    className="btn btn-primary btn-sm"
                    style={{ background: p ? p.color : "#7c3aed", marginTop: 12 }}
                    onClick={() => goStep(i + 1)}
                  >
                    J'ai compris → voir l'exemple
                  </button>
                </div>
              )}
              {step.type === "exemple" && (
                <div className="content-card">
                  <div className="content-title">{step.icon} {step.label}</div>
                  <div className="code-block">
                    {step.code.split("\n").map((line, li) => {
                      const formatted = line
                        .replace(/^(# .*)$/, '<span class="code-comment">$1</span>')
                        .replace(/\b(print|input|int|float|len|range|sum|def|return|import)\b/g, '<span class="code-kw">$1</span>')
                        .replace(/\b(if|else|elif|for|in|while|not|and|or|True|False)\b/g, '<span class="code-kw">$1</span>');
                      return (
                        <span key={li} dangerouslySetInnerHTML={{ __html: formatted + (li < step.code.split("\n").length - 1 ? "\n" : "") }} />
                      );
                    })}
                  </div>
                  {step.result && (
                    <>
                      <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4 }}>Résultat :</div>
                      <div className="code-result">{step.result}</div>
                    </>
                  )}
                  <button
                    className="btn btn-primary btn-sm"
                    style={{ background: p ? p.color : "#7c3aed", marginTop: 12 }}
                    onClick={() => goStep(i + 1)}
                  >
                    C'est clair → à mon tour !
                  </button>
                </div>
              )}
              {step.type === "exercice" && (
                <div className="content-card">
                  <div className="content-title">{step.icon} {step.label}</div>
                  <div style={{ fontSize: 14, lineHeight: 1.6, marginBottom: 12, whiteSpace: "pre-line" }}>
                    {step.prompt}
                  </div>
                  <textarea
                    className="code-input"
                    value={codeValue}
                    onChange={e => setCodeValue(e.target.value)}
                    placeholder={step.placeholder}
                    rows={6}
                  />
                  <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                    <button className="btn btn-outline btn-sm" onClick={() => {
                      setCleoMessage("💡 " + (step.prompt.split(".")[0]) + " — commence par la première ligne, et avance pas à pas !");
                      setCleoValid(null);
                    }}>Indice 💡</button>
                    <button
                      className="btn btn-primary btn-sm"
                      style={{ background: p ? p.color : "#7c3aed", marginLeft: "auto" }}
                      onClick={askCleo}
                      disabled={cleoLoading}
                    >
                      {cleoLoading ? "Cleo réfléchit…" : "Soumettre à Cleo →"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {(cleoLoading || cleoMessage) && (
          <div className="cleo-card">
            <div className="cleo-header">
              <div className="cleo-avatar">🤖</div>
              <div>
                <div className="cleo-name">Cleo</div>
                <div className="cleo-role">Ta coach IA</div>
              </div>
            </div>
            <div className="cleo-bubble">
              {cleoLoading ? (
                <div className="dots">
                  <div className="dot" /><div className="dot" /><div className="dot" />
                </div>
              ) : cleoMessage}
            </div>
            {!cleoLoading && cleoValid !== null && (
              <div style={{ marginTop: 10 }}>
                {cleoValid ? (
                  <>
                    <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 8 }}>+{cleoXp} XP gagnés !</div>
                    <button
                      className="btn btn-primary btn-full"
                      style={{ background: p ? p.color : "#7c3aed" }}
                      onClick={validateLesson}
                    >
                      Continuer →
                    </button>
                  </>
                ) : (
                  <button className="btn btn-outline btn-full" onClick={() => { setCleoMessage(""); setCleoValid(null); }}>
                    Corriger mon code
                  </button>
                )}
              </div>
            )}
            {!cleoLoading && cleoValid === null && cleoMessage && (
              <button className="btn btn-outline btn-sm" style={{ marginTop: 8 }} onClick={() => setCleoMessage("")}>
                Fermer
              </button>
            )}
          </div>
        )}

        {lessonDone && (
          <div className="content-card complete-screen">
            <div className="complete-trophy">🎉</div>
            <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>Leçon terminée !</div>
            <div style={{ fontSize: 14, color: "var(--muted)", marginBottom: 12 }}>
              Tu viens de maîtriser : <strong>{currentLesson.title}</strong>
            </div>
            <div className="xp-gained">+{cleoXp || 50} XP</div>
            <button
              className="btn btn-primary btn-full"
              style={{ background: p ? p.color : "#7c3aed", marginTop: 8 }}
              onClick={() => goTo("lessons")}
            >
              Leçon suivante →
            </button>
          </div>
        )}

        <div className="bottom-nav">
          <button className="nav-btn" onClick={() => goTo("dashboard")}><span className="nav-icon">🏠</span>Accueil</button>
          <button className="nav-btn" onClick={() => goTo("roadmap")}><span className="nav-icon">🗺</span>Roadmap</button>
          <button className="nav-btn active"><span className="nav-icon">📚</span>Leçons</button>
          <button className="nav-btn" onClick={() => goTo("pin")}><span className="nav-icon">👨‍👩‍👧</span>Parents</button>
        </div>
      </div>

      {/* PIN */}
      <div className={`screen ${screen === "pin" ? "active" : ""}`}>
        <button className="back-btn" onClick={() => { pinClear(); goTo(profile ? "dashboard" : "welcome"); }}>← Retour</button>
        <div className="pin-wrap">
          <div className="pin-title">Espace parents</div>
          <div className="pin-sub">Entre ton code PIN</div>
          <div className="pin-dots">
            {[0, 1, 2, 3].map(i => (
              <div key={i} className={`pin-dot ${i < pinEntry.length ? "filled" : ""}`} />
            ))}
          </div>
          <div className="pin-error">{pinError}</div>
          <div className="pin-grid">
            {["1","2","3","4","5","6","7","8","9"].map(n => (
              <div key={n} className="pin-key" onClick={() => handlePin(n)}>{n}</div>
            ))}
            <div className="pin-key" style={{ fontSize: 14 }} onClick={pinClear}>✕</div>
            <div className="pin-key" onClick={() => handlePin("0")}>0</div>
            <div className="pin-key" style={{ fontSize: 16 }} onClick={pinBack}>⌫</div>
          </div>
          <div className="pin-hint">PIN par défaut : 1234</div>
        </div>
      </div>

      {/* PARENT DASHBOARD */}
      <div className={`screen ${screen === "parent" ? "active" : ""}`}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: "1.25rem" }}>
          <button className="back-btn" style={{ marginBottom: 0 }} onClick={() => { pinClear(); goTo("welcome"); }}>← Quitter</button>
          <div style={{ fontSize: 18, fontWeight: 800, marginLeft: "auto" }}>Suivi parents</div>
        </div>

        <div className="tab-bar">
          {[["adele", "🌸 Adèle"], ["soline", "⚡ Soline"], ["global", "📊 Global"]].map(([id, label]) => (
            <button key={id} className={`tab-btn ${parentTab === id ? "active" : ""}`} onClick={() => setParentTab(id)}>
              {label}
            </button>
          ))}
        </div>

        {["adele", "soline"].map(pid => {
          const pd = getProfileData(pid);
          const db = progression[pid];
          const streakOk = (db?.streak ?? 0) >= 2;
          return (
            <div key={pid} className={`child-tab ${parentTab === pid ? "active" : ""}`}>
              {streakOk
                ? <div className="good-box">🔥 {pd.streak} jours de suite — {pd.name} est en bonne dynamique !</div>
                : <div className="alert-box">⚠️ {pd.name} n'a pas beaucoup de streak — encourage-la ce soir !</div>
              }
              <div className="stats-grid" style={{ marginBottom: "1rem" }}>
                <div className="stat-card"><div className="stat-num" style={{ color: pd.color }}>{pd.lessons}</div><div className="stat-label">leçons</div></div>
                <div className="stat-card"><div className="stat-num">{pd.xp} XP</div><div className="stat-label">total</div></div>
                <div className="stat-card"><div className="stat-num">🔥 {pd.streak}j</div><div className="stat-label">streak</div></div>
              </div>
              <div className="card">
                <div className="section-title">Progression roadmap</div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                  <span>Phase 1 · Éveil</span><span style={{ color: pd.color }}>{pd.phase}%</span>
                </div>
                <div className="xp-bar-wrap" style={{ height: 8, marginBottom: 8 }}>
                  <div className="xp-bar" style={{ width: `${pd.phase}%`, background: pd.color }} />
                </div>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>{pd.phaseLabel}</div>
              </div>
            </div>
          );
        })}

        <div className={`child-tab ${parentTab === "global" ? "active" : ""}`}>
          <div className="card">
            <div className="section-title">Comparatif</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 8 }}>
              {["adele", "soline"].map(pid => {
                const pd = getProfileData(pid);
                return (
                  <div key={pid}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: pd.color, marginBottom: 8 }}>{pd.avatar} {pd.name}</div>
                    <div style={{ fontSize: 13, lineHeight: 2, color: "var(--muted)" }}>
                      {pd.lessons} leçons<br />{pd.xp} XP<br />🔥 Streak {pd.streak}j
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

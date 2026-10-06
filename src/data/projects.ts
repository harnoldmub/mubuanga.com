import { galleryCounts } from "./gallery.generated";

/**
 * Case-study source of truth. Adding a project = adding one entry here:
 * the index page, the homepage selection, the case study, its metadata,
 * its JSON-LD and the prev/next navigation all derive from this array.
 *
 * `year` is declarative (year the site went live as I know it) — adjust freely.
 * Nothing in `outcome` is a measured statistic; it only states what shipped.
 */

export type Project = {
  slug: string;
  name: string;
  year: string;
  category: string;
  role: string;
  url: string;
  /** One line, shown on the index and in the project hero. */
  tagline: string;
  /** Two or three sentences, shown under the big preview. */
  summary: string;
  stack: readonly string[];
  context: string;
  challenge: string;
  solution: string;
  contribution: readonly string[];
  features: readonly string[];
  outcome?: string;
  /** Homepage order: the eight most recent projects. Undefined = index only. */
  featured?: number;
};

export const projects: readonly Project[] = [
  {
    slug: "e-visa",
    name: "E-Visa RDC",
    year: "2025",
    category: "Application publique",
    role: "Développement · Conception produit",
    url: "https://e-visa.mubuanga.com/",
    tagline: "Demander un visa pour la RD Congo, entièrement en ligne.",
    summary:
      "Un parcours de demande de visa dématérialisé : formulaire long, pièces justificatives, paiement et suivi de dossier, pour un public international qui ne recommencera pas deux fois si l'expérience échoue.",
    stack: ["React", "TypeScript", "Node.js", "Formulaires longs", "Upload sécurisé"],
    context:
      "Une demande de visa est une procédure administrative dense : plusieurs dizaines de champs, des pièces à fournir, des règles qui changent selon la nationalité et le motif du voyage. Portée sur le web, elle se heurte à des utilisateurs qui remplissent le formulaire une seule fois dans leur vie, souvent depuis un mobile et une connexion moyenne.",
    challenge:
      "Transformer un dossier papier en parcours numérique sans le simplifier abusivement. Le formulaire devait rester exhaustif tout en restant franchissable : sauvegarde de la progression, erreurs compréhensibles, et une interface qui ne demande jamais deux fois la même information.",
    solution:
      "Un parcours découpé en étapes courtes avec état sauvegardé, une validation champ par champ plutôt qu'un mur d'erreurs à la fin, un module d'upload de pièces qui contrôle format et poids côté client, et un suivi de dossier consultable après soumission. L'interface reste volontairement sobre : c'est une démarche officielle, pas un produit marketing.",
    contribution: [
      "Conception du parcours de demande et du modèle de données",
      "Développement de l'interface et des composants de formulaire",
      "Gestion des pièces justificatives et des états de dossier",
      "Intégration avec les écrans de suivi et de vérification",
    ],
    features: [
      "Formulaire multi-étapes avec sauvegarde de progression",
      "Validation contextuelle selon nationalité et motif",
      "Dépôt et contrôle des pièces justificatives",
      "Suivi de dossier et vérification de visa",
      "Interface bilingue et responsive",
    ],
    outcome: "Plateforme en ligne, du formulaire public jusqu'au suivi de dossier.",
  },
  {
    slug: "daylora",
    name: "Daylora",
    year: "2025",
    category: "Produit SaaS",
    role: "Fondateur · Architecture · Développement",
    url: "https://daylora.co/",
    tagline: "Le SaaS qui donne à chaque mariage son propre site.",
    summary:
      "Une plateforme multi-tenant où un couple crée son site de mariage, gère sa liste d'invités, encaisse une cagnotte et pilote sa journée — sans jamais toucher à du code.",
    stack: ["Next.js", "TypeScript", "PostgreSQL", "Multi-tenant", "PDF dynamique"],
    context:
      "J'ai construit une dizaine de sites de mariage sur mesure. À chaque fois les mêmes besoins revenaient : informations pratiques, RSVP, accès privé, plan de table, cagnotte. Refaire ce travail projet par projet n'avait plus de sens : le besoin était devenu un produit.",
    challenge:
      "Passer du sur-mesure au SaaS sans perdre ce qui faisait la valeur du sur-mesure. Chaque mariage doit garder son identité visuelle propre tout en s'appuyant sur un socle unique, isolé par tenant, administrable par des gens qui ne sont pas techniques.",
    solution:
      "Une architecture multi-tenant où chaque mariage dispose de son espace, de son thème et de son domaine, servie par une base de code unique. Une interface d'administration pensée pour des couples : invités, événements datés, quotas, invitations PDF générées dynamiquement, codes d'accès privés.",
    contribution: [
      "Architecture multi-tenant et modèle de données",
      "Développement complet, interface et services",
      "Génération dynamique des invitations PDF",
      "Direction artistique du produit et du site vitrine",
      "Mise en production et exploitation",
    ],
    features: [
      "Création de site guidée, sans code",
      "Gestion des invités, des événements et des quotas",
      "Invitations PDF générées à la volée",
      "Accès privé par code",
      "Cagnotte et suivi des participations",
    ],
    outcome: "Produit en production, plusieurs mariages servis depuis la même base de code.",
  },
  {
    slug: "mboka-hub",
    name: "Mboka Hub",
    year: "2026",
    category: "Plateforme événementielle",
    role: "Conception · Développement · Direction artistique",
    url: "https://mbokahub.com/",
    tagline: "Tout un week-end de concert, organisé depuis une seule plateforme.",
    summary:
      "Un hub qui rassemble programme, prestataires et communauté autour d'un événement musical majeur de la diaspora congolaise, avec un compte à rebours qui rythme l'attente.",
    stack: ["React", "Node.js", "Direction artistique", "Espace prestataires"],
    context:
      "Autour d'un grand concert, tout un écosystème se met en mouvement : transport, hébergement, restauration, tenue, groupes d'amis qui s'organisent. Cette logistique se joue habituellement dans des dizaines de conversations dispersées.",
    challenge:
      "Créer un point de convergence qui serve deux publics opposés dans le même produit : le public qui prépare son week-end, et les prestataires qui veulent être trouvés. Deux parcours, une seule interface, sans que l'un dilue l'autre.",
    solution:
      "Une plateforme à deux entrées assumées dès le hero — « préparer mon week-end » et « je suis prestataire » — construite sur une direction artistique sombre et saturée qui emprunte au registre du concert plutôt qu'à celui du site de services.",
    contribution: [
      "Direction artistique et conception de l'interface",
      "Développement de la plateforme et des deux parcours",
      "Espace prestataires et mise en relation",
      "Compte à rebours et animation éditoriale",
    ],
    features: [
      "Double parcours public et prestataires",
      "Programme et prestations par catégorie",
      "Compte à rebours événementiel",
      "Espace communauté et playlists",
      "Inscription prestataire",
    ],
  },
  {
    slug: "bloc-leopards",
    name: "Bloc Léopards",
    year: "2025",
    category: "Plateforme communauté",
    role: "Conception · Développement · Direction artistique",
    url: "https://blocleopards.mubuanga.com/",
    tagline: "Une tribune numérique pour les supporters des Léopards.",
    summary:
      "Le point de ralliement digital du mouvement de supporters de la RD Congo : mobilisation avant match, charte du bloc, coordination des tribunes.",
    stack: ["Astro", "React", "PostgreSQL", "Direction artistique"],
    context:
      "Un mouvement de supporters existe d'abord dans la rue et dans le stade. Sa version numérique doit servir la mobilisation réelle — annoncer, rassembler, coordonner — et pas simplement raconter.",
    challenge:
      "Traduire l'énergie d'une tribune dans une interface, sans tomber dans le site de club générique. Il fallait un objet visuel qui ait le volume, le bruit et les couleurs du mouvement, tout en restant lisible sur un téléphone au milieu d'une foule.",
    solution:
      "Une direction artistique construite sur le jaune et le bleu de la sélection, une typographie de tribune, et une structure qui met en avant l'action à faire maintenant : rejoindre le bloc, voir la mobilisation du prochain match, connaître les règles du groupe.",
    contribution: [
      "Direction artistique et système visuel",
      "Développement du site et de l'espace de mobilisation",
      "Modèle de données membres et événements",
      "Mise en production et déploiement",
    ],
    features: [
      "Mobilisation par match",
      "Adhésion au bloc",
      "Charte et piliers du mouvement",
      "Actualités et médias",
      "Bandeau d'annonces les jours de match",
    ],
  },
  {
    slug: "luxos",
    name: "Luxos RDC",
    year: "2026",
    category: "Immobilier",
    role: "Refonte · Direction artistique · Développement",
    url: "https://luxos-production.up.railway.app/",
    tagline: "Investir dans l'immobilier en RDC, avec confiance et clarté.",
    summary:
      "La refonte complète de l'application d'un groupe immobilier congolais — parcelles viabilisées, construction, concessions — pensée aussi pour la diaspora qui achète à distance.",
    stack: ["React", "Vite", "Express", "PostgreSQL"],
    context:
      "Luxos accompagne des particuliers, des entreprises et de nombreux acheteurs de la diaspora dans des projets de terrain et de construction à Kinshasa. Son application existante fonctionnait, mais ne transmettait ni l'ampleur du groupe ni la confiance qu'exige un achat à distance.",
    challenge:
      "Tout redessiner sans rien casser : l'assistante conversationnelle, la collecte de prospects, le simulateur et le contact WhatsApp devaient continuer de fonctionner pendant et après la refonte, en français comme en anglais.",
    solution:
      "Une direction « terre et or » — ivoire, encre, or — portée par une typographie architecturale et des photographies pleine largeur, et une refonte menée section par section, fonction préservée à chaque étape. Un espace diaspora dédié rend visibles le suivi et les fuseaux horaires.",
    contribution: [
      "Audit de l'existant et plan de refonte progressive",
      "Direction artistique et système visuel",
      "Refonte de l'interface, bilingue FR / EN",
      "Préservation des fonctions métier existantes",
    ],
    features: [
      "Campagnes et concessions",
      "Espace diaspora",
      "Assistante conversationnelle",
      "Simulateur et contact WhatsApp",
      "Version française et anglaise",
    ],
    featured: 7,
  },
  {
    slug: "lombayo-consulting",
    name: "Lombayo Consulting",
    year: "2026",
    category: "Site vitrine premium",
    role: "Conception · Développement · Direction artistique",
    url: "https://lombayo-consulting.com/",
    tagline: "Comprendre la valeur. Connecter les opportunités.",
    summary:
      "Le site d'un cabinet de conseil et de négociation installé entre Dubaï et la Belgique : six univers d'expertise, une méthode, et un premier échange à engager.",
    stack: ["Astro", "Node.js", "Resend"],
    context:
      "Le cabinet travaille dans la discrétion, sur des sujets où la confiance précède tout : investissement, actifs précieux, mise en relation internationale. Son site devait inspirer ce sérieux sans rien promettre de chiffré.",
    challenge:
      "Donner une présence premium à une activité dont une grande partie des missions reste confidentielle — sans inventer de références, de rendements ni de clients — et la rendre lisible en français comme en anglais.",
    solution:
      "Un noir dominant, de l'ivoire et un or rare ; une typographie éditoriale à très grande échelle ; une mise en scène au défilement qui déroule les univers puis la méthode. Le contenu suit le profil réel du cabinet, et tout ce qui n'est pas validé reste hors ligne.",
    contribution: [
      "Direction artistique et système typographique",
      "Développement Astro et animations au défilement",
      "Version française et anglaise",
      "Formulaire de contact et envoi des demandes",
    ],
    features: [
      "Six univers d'expertise",
      "Méthode en quatre temps",
      "Présence Dubaï, Europe et Afrique",
      "Formulaire de premier échange",
      "Site bilingue FR / EN",
    ],
    featured: 2,
  },
  {
    slug: "amcros-institut",
    name: "Amcros Institut",
    year: "2026",
    category: "Beauté · Réservation",
    role: "Conception · Développement · Direction artistique",
    url: "https://amcros-institut.com/",
    tagline: "Une maison de beauté à Gombe, et sa réservation en ligne.",
    summary:
      "Le site d'un institut de beauté de Kinshasa — coiffure, ongles, soins — avec un parcours de réservation sans création de compte et un back-office pour l'équipe.",
    stack: ["Next.js", "React", "PostgreSQL", "Motion"],
    context:
      "À Kinshasa, la prise de rendez-vous se fait surtout par téléphone et messagerie. L'institut voulait une vitrine à la hauteur de son lieu et un moyen de réserver qui ne dépende plus d'une réponse manuelle.",
    challenge:
      "Allier l'image douce et premium d'une maison de beauté à un vrai outil : prestations, créneaux, confirmations, sans imposer de compte à une clientèle qui veut réserver en une minute.",
    solution:
      "Une palette crème et caramel, une typographie fine et des photographies du lieu ; une réservation en quelques étapes avec confirmation immédiate, et un espace d'administration pour suivre les rendez-vous.",
    contribution: [
      "Direction artistique",
      "Développement du site et du parcours de réservation",
      "Back-office des rendez-vous",
      "Gestion du consentement et de la mesure d'audience",
    ],
    features: [
      "Réservation sans compte",
      "Prestations par expertise",
      "Lookbook et sélection de mèches",
      "Avis clientes",
      "Back-office des rendez-vous",
    ],
    featured: 4,
  },
  {
    slug: "amcros-events",
    name: "Amcros Events",
    year: "2026",
    category: "Événementiel",
    role: "Conception · Développement · Direction artistique",
    url: "https://amcros.events/",
    tagline: "Faire rayonner la culture congolaise.",
    summary:
      "Le site d'une agence événementielle et maison de création culturelle de Kinshasa : expériences, films, partenaires et demande de projet.",
    stack: ["Next.js", "React", "Administration"],
    context:
      "L'agence produit des événements, des activations de marque et des projets culturels avec des partenaires de premier plan. Son site devait se placer au niveau de ces collaborations.",
    challenge:
      "Évoquer le luxe et l'hospitalité sans surcharger : laisser parler les images d'événements et les partenaires, tout en conduisant vers une demande de projet exploitable.",
    solution:
      "Une composition centrée et retenue, des titres en capitales fines, un menu plein écran, et un formulaire « votre projet » relié à un espace d'administration où l'équipe traite les demandes.",
    contribution: [
      "Direction artistique",
      "Développement du site, en français et en anglais",
      "Formulaire de projet et espace d'administration",
    ],
    features: [
      "Expériences et films",
      "Mur de partenaires",
      "Demande de projet",
      "Administration des demandes",
      "Version anglaise",
    ],
    featured: 5,
  },
  {
    slug: "avc",
    name: "AVC — Autre Vision du Congo",
    year: "2026",
    category: "Politique · Institutionnel",
    role: "Conception · Développement · Direction artistique",
    url: "https://parti-avc.cd/",
    tagline: "Une autre vision. Un Congo plus fort.",
    summary:
      "Le site d'un parti politique congolais : vision, président, implantation, actualités et adhésion, en RDC comme dans la diaspora.",
    stack: ["Next.js", "React"],
    context:
      "Un parti politique s'adresse à des militants, à des sympathisants, à la presse et à la diaspora. Son site est à la fois une carte d'identité et un outil de mobilisation.",
    challenge:
      "Trouver un ton affirmé et moderne, loin des sites partisans saturés, tout en rendant immédiatement visibles les deux actions qui comptent : comprendre la vision, rejoindre le mouvement.",
    solution:
      "Une direction graphique construite sur les couleurs du parti en grands aplats, une typographie compacte à très grande échelle, et une page d'accueil qui enchaîne vision, frise chronologique, président, actualités et engagement.",
    contribution: [
      "Direction artistique",
      "Développement du site",
      "Gabarits d'actualités et pages d'implantation",
    ],
    features: [
      "Vision et piliers",
      "Frise du parti",
      "Page du président",
      "Actualités",
      "Adhésion et bénévolat",
      "Implantation internationale",
    ],
    featured: 6,
  },
  {
    slug: "agdtn",
    name: "Ambassade La Grâce Divine",
    year: "2026",
    category: "Communauté · Plateforme",
    role: "Conception · Développement · Direction artistique",
    url: "https://agdtn.com/",
    tagline: "Une église bruxelloise, ses rendez-vous et sa communauté, en ligne.",
    summary:
      "Le site et l'espace de communication d'une église d'Anderlecht : héros vidéo, programme hebdomadaire, prédications synchronisées avec YouTube, pôles de service et demandes de prière.",
    stack: ["Next.js", "React", "Cloudflare D1", "Cloudflare R2", "Drizzle"],
    context:
      "La communauté vit autant en ligne qu'en salle : cultes diffusés en direct, prédications, rendez-vous de la semaine. L'information était dispersée entre l'affiche, Facebook et YouTube.",
    challenge:
      "Rassembler la vie de l'église dans un site chaleureux, tenu par l'équipe communication sans développeur, tout en protégeant les demandes privées — prière, accompagnement — qui ne doivent être vues que par les bonnes personnes.",
    solution:
      "Une charte bleu, or et vert portée par Playfair Display, une vision qui s'allume mot à mot au défilement, une barre de service fixe ; et un espace d'administration avec brouillon et publication, rôles distincts et conservation limitée des demandes.",
    contribution: [
      "Direction artistique à partir de la charte",
      "Développement du site et de l'administration",
      "Synchronisation des prédications YouTube",
      "Rôles, confidentialité et protection des formulaires",
    ],
    features: [
      "Prochain rendez-vous et programme",
      "Médiathèque des prédications",
      "Neuf pôles de service",
      "Demandes de prière et d'accompagnement",
      "Brouillon et publication du contenu",
    ],
    featured: 1,
  },
  {
    slug: "natacha-ruddy",
    name: "Natacha & Ruddy",
    year: "2026",
    category: "Expérience privée",
    role: "Conception · Développement",
    url: "https://tasha-ruddy.up.railway.app/",
    tagline: "Un mariage coutumier, raconté sur une seule page.",
    summary:
      "Un site d'invitation éditorial — histoire du couple, compte à rebours, galerie — et un back-office pour gérer les invités et le placement à table.",
    stack: ["Next.js", "PostgreSQL"],
    context:
      "Le couple voulait une invitation qui ait la tenue d'un beau livre, et un outil pour suivre les réponses et organiser la salle.",
    challenge:
      "Garder une page publique très épurée, typographique, tout en portant derrière une vraie gestion des invités, des confirmations et des tables.",
    solution:
      "Une alternance de fonds sombres et crème, une écriture script pour les prénoms, un compte à rebours sobre ; côté organisation, un back-office avec confirmations et un tableau d'attribution des tables en masse.",
    contribution: [
      "Direction artistique",
      "Développement du site et du back-office",
      "Migration du stockage vers PostgreSQL",
      "Mise en production",
    ],
    features: [
      "Compte à rebours",
      "Histoire et galerie du couple",
      "Confirmation de présence",
      "Gestion des invités",
      "Placement à table",
    ],
    featured: 3,
  },
  {
    slug: "dgm",
    name: "DGM",
    year: "2025",
    category: "Institutionnel",
    role: "Conception · Développement",
    url: "https://dgm.mubuanga.com/",
    tagline: "Le site officiel de la Direction Générale de Migration.",
    summary:
      "Le point d'entrée numérique d'une administration de contrôle migratoire : missions, services, procédures et passerelle vers la demande de visa en ligne.",
    stack: ["React", "TypeScript", "Contenu institutionnel"],
    context:
      "Une direction générale de migration s'adresse simultanément à des voyageurs étrangers, à des ressortissants et à des professionnels du tourisme. Chacun cherche une information différente, souvent dans l'urgence d'un départ.",
    challenge:
      "Rendre une information administrative dispersée immédiatement navigable, tout en tenant le registre institutionnel attendu d'un site officiel. La confiance se joue ici avant l'esthétique.",
    solution:
      "Une hiérarchie de contenu construite autour des questions réelles — de quoi ai-je besoin, où est-ce que je fais ma demande, qui contacter — avec une passerelle explicite vers la plateforme e-Visa, et une identité visuelle sobre alignée sur les codes de l'État.",
    contribution: [
      "Architecture de l'information et arborescence",
      "Développement de l'interface et des gabarits de contenu",
      "Articulation avec la plateforme e-Visa",
      "Responsive et accessibilité",
    ],
    features: [
      "Présentation des missions et services",
      "Procédures et démarches",
      "Actualités institutionnelles",
      "Passerelle e-Visa",
      "Contacts et points de présence",
    ],
  },
  {
    slug: "salon-congo-paris",
    name: "Congo à Paris",
    year: "2026",
    category: "Événementiel",
    role: "Conception · Développement · Direction artistique",
    url: "https://salon.congonaparis.fr/",
    tagline: "Le rendez-vous de la diaspora congolaise à Paris.",
    summary:
      "La plateforme d'un salon annuel : programme, partenaires, exposants et réservation de places, sur une identité sombre et chaude qui porte l'événement.",
    stack: ["Next.js", "Direction artistique", "Réservation"],
    context:
      "Un salon vit sur un calendrier court : quelques semaines pour convaincre, réserver et remplir. Le site est le seul point de vérité entre l'annonce et la porte d'entrée.",
    challenge:
      "Faire tenir sur une seule page la promesse de l'événement, la crédibilité des partenaires et l'appel à réserver, sans que la réservation soit noyée dans le contenu éditorial.",
    solution:
      "Une composition pleine page avec une réservation toujours atteignable, une palette bordeaux et or qui donne au salon un registre premium, et des sections courtes conçues pour une lecture mobile en diagonale.",
    contribution: [
      "Direction artistique et composition",
      "Développement du site et du parcours de réservation",
      "Intégration des partenaires et des exposants",
      "Optimisation mobile",
    ],
    features: [
      "Présentation et programme du salon",
      "Partenaires et exposants",
      "Réservation de places",
      "Informations pratiques",
    ],
  },
  {
    slug: "tselem-studio",
    name: "TSELEM Studio",
    year: "2025",
    category: "Expérience digitale",
    role: "Direction artistique · Développement",
    url: "https://tselem.studio/",
    tagline: "Créer des images qui traversent le temps.",
    summary:
      "Le site d'une maison de l'image à Kinshasa, construit comme un objet éditorial : typographie massive, fond noir, et les photographies comme unique matière.",
    stack: ["Next.js", "Direction artistique", "Motion", "Galerie"],
    context:
      "Pour un studio photo et vidéo, le site n'est pas une vitrine parmi d'autres : c'est la première image que le client voit. Il doit prouver le niveau du studio avant même la première photo.",
    challenge:
      "Faire un site qui ne concurrence pas les images qu'il présente. Toute décoration superflue aurait abîmé le travail exposé.",
    solution:
      "Un noir profond, une grotesque massive, et une grille qui laisse les images occuper la pleine largeur. La navigation reste minimale, la mise en page change de rythme d'une section à l'autre pour éviter l'effet catalogue.",
    contribution: [
      "Direction artistique complète",
      "Développement du site et des galeries",
      "Système de mise en page éditoriale",
      "Motion et transitions",
    ],
    features: [
      "Galeries pleine largeur",
      "Présentation des univers du studio",
      "Réservation et prise de contact",
      "Direction artistique typographique",
    ],
  },
  {
    slug: "awa-network",
    name: "AWA Network",
    year: "2026",
    category: "Fintech",
    role: "Conception · Développement",
    url: "http://awanetwork.com/",
    tagline: "Une intégration, tous les Mobile Money de la RDC.",
    summary:
      "La vitrine produit d'une plateforme de paiement qui connecte les entreprises à Orange Money, Airtel Money, Africell et M-Pesa via une seule intégration.",
    stack: ["Next.js", "API", "Documentation produit"],
    context:
      "En RDC, encaisser en ligne veut dire s'intégrer séparément à chaque opérateur mobile. Pour une entreprise, c'est autant de contrats, de formats et de dettes techniques.",
    challenge:
      "Expliquer une valeur d'agrégation technique à des décideurs non techniques, tout en restant crédible auprès des équipes qui vont réellement intégrer l'API.",
    solution:
      "Une page qui pose la promesse en une phrase, montre les opérateurs couverts comme preuve immédiate, puis descend progressivement vers le détail technique et la demande d'accès.",
    contribution: [
      "Conception de la page produit et du discours",
      "Développement de l'interface",
      "Parcours de demande d'accès",
    ],
    features: [
      "Présentation de la couverture opérateurs",
      "Parcours de demande d'intégration",
      "FAQ et documentation",
      "Espace partenaires",
    ],
  },
  {
    slug: "u-moja",
    name: "U-Moja",
    year: "2025",
    category: "Plateforme solidaire",
    role: "Conception · Développement",
    url: "https://u-moja.org/",
    tagline: "Le financement participatif des projets solidaires en RDC.",
    summary:
      "Une plateforme de collecte où une association ou un particulier lance une cagnotte, la partage sur WhatsApp et suit ses paiements.",
    stack: ["React", "Paiement", "Partage social"],
    context:
      "Les collectes solidaires en RDC se font largement par messagerie et de main à main. Le manque de traçabilité freine la confiance et limite la portée des campagnes.",
    challenge:
      "Rendre le lancement d'une collecte assez simple pour être fait depuis un téléphone en quelques minutes, tout en donnant aux donateurs les repères de confiance qui manquent au circuit informel.",
    solution:
      "Un parcours de création en trois temps, un partage pensé d'abord pour WhatsApp, et un suivi de progression visible publiquement sur chaque campagne.",
    contribution: [
      "Conception du parcours de collecte",
      "Développement de la plateforme",
      "Intégration des paiements et du partage",
    ],
    features: [
      "Création de collecte guidée",
      "Partage WhatsApp et réseaux",
      "Suivi de progression public",
      "Paiement par carte",
    ],
  },
  {
    slug: "momento-wedding",
    name: "Momento Wedding",
    year: "2025",
    category: "Expérience digitale",
    role: "Direction artistique · Développement",
    url: "https://momento.wedding/",
    tagline: "Photographie et films de mariage, entre Kinshasa et Paris.",
    summary:
      "Une vitrine cinématographique pour un studio de mariage haut de gamme : portfolio, films et prise de contact.",
    stack: ["Next.js", "Direction artistique", "Vidéo", "Galerie"],
    context:
      "Le mariage haut de gamme se vend par l'émotion. Un portfolio froid, aussi bien réalisé soit-il, ne déclenche pas de réservation.",
    challenge:
      "Donner au site la texture d'un film plutôt que celle d'un catalogue, sans sacrifier le temps de chargement sur des connexions moyennes.",
    solution:
      "Une entrée en plein écran sur une image de film, une typographie sérif éditoriale, et un portfolio qui alterne les échelles pour maintenir le rythme d'un montage.",
    contribution: [
      "Direction artistique",
      "Développement du site et des galeries",
      "Optimisation des médias",
    ],
    features: [
      "Portfolio photo et film",
      "Présentation des prestations",
      "Demande de réservation",
    ],
  },
  {
    slug: "malkya",
    name: "Malkya",
    year: "2025",
    category: "E-commerce",
    role: "Conception · Développement",
    url: "https://malkya.co/",
    tagline: "Une marque de soins naturels, vendue en ligne.",
    summary:
      "La boutique en ligne d'une marque de cosmétique africaine contemporaine : catalogue, fiches produit et parcours d'achat.",
    stack: ["Next.js", "E-commerce", "Paiement", "Catalogue"],
    context:
      "Une marque de soins se juge sur la confiance : composition, promesse, preuve. Le site doit vendre un produit qu'on ne peut ni sentir ni toucher.",
    challenge:
      "Construire un parcours d'achat qui laisse la place au discours de marque, sans allonger le chemin entre la découverte et le panier.",
    solution:
      "Des fiches produit qui portent la composition et l'usage au même niveau que le prix, et une navigation par besoin — corps, visage, gamme — plutôt que par référence.",
    contribution: [
      "Conception de la boutique et du parcours d'achat",
      "Développement du catalogue et des fiches produit",
      "Intégration du paiement et de la livraison",
    ],
    features: [
      "Catalogue par besoin",
      "Fiches produit détaillées",
      "Panier et paiement",
      "Livraison et suivi",
    ],
  },
  {
    slug: "cozy-interieur",
    name: "Cozy Intérieur",
    year: "2025",
    category: "Site & boutique",
    role: "Fondateur · Direction artistique · Développement",
    url: "https://cozyinterieur.com/",
    tagline: "Studio de design d'intérieur et boutique en ligne.",
    summary:
      "Le site d'un studio de décoration : réalisations, offres, prise de rendez-vous et boutique.",
    stack: ["Next.js", "Boutique", "Direction artistique", "PDF"],
    context:
      "Un studio de décoration vend un service invisible avant la première visite. Ses réalisations sont sa seule preuve.",
    challenge:
      "Faire coexister un portfolio de réalisations, une offre de service structurée et une boutique, sans que le site devienne trois sites différents.",
    solution:
      "Un fil unique qui va de l'ambiance à l'offre puis à la boutique, une palette chaude et neutre, et des offres présentées comme des parcours plutôt que comme des grilles tarifaires.",
    contribution: [
      "Direction artistique et conception",
      "Développement du site et de la boutique",
      "Génération des documents commerciaux en PDF",
    ],
    features: [
      "Galerie de réalisations",
      "Offres et prise de rendez-vous",
      "Boutique en ligne",
      "Devis et documents PDF",
    ],
    featured: 8,
  },
  {
    slug: "tselem-rdc",
    name: "TSELEM RDC",
    year: "2025",
    category: "Site vitrine",
    role: "Conception · Développement",
    url: "https://tselemrdc.com/",
    tagline: "L'art de capturer l'émotion.",
    summary:
      "La vitrine photo et vidéo de TSELEM en RDC : réalisations, services et réservation.",
    stack: ["Next.js", "Galerie", "Réservation"],
    context:
      "Avant l'ouverture du studio, la marque avait besoin d'une présence en ligne capable de présenter ses réalisations et de capter les demandes.",
    challenge:
      "Servir des galeries lourdes sur des connexions inégales sans dégrader l'impression de qualité.",
    solution:
      "Un carrousel d'entrée maîtrisé, des médias optimisés et une réservation accessible depuis chaque section.",
    contribution: [
      "Conception et développement du site",
      "Optimisation des galeries",
      "Parcours de réservation",
    ],
    features: ["Réalisations par univers", "Services", "Réservation", "Contact"],
  },
  {
    slug: "fondation-noah-sadiki",
    name: "Fondation Noah Sadiki",
    year: "2025",
    category: "Institutionnel",
    role: "Conception · Développement",
    url: "https://fondationnoahsadiki.org/",
    tagline: "Éducation, sport et bien-être des communautés.",
    summary:
      "Le site d'une fondation caritative : projets, actions de terrain et collecte de dons.",
    stack: ["Next.js", "Dons", "Contenu"],
    context:
      "Une fondation portée par une personnalité publique doit rendre lisible l'usage des dons et la réalité du terrain.",
    challenge:
      "Donner à voir les actions concrètes avant l'appel au don, pour que la demande arrive après la preuve.",
    solution:
      "Une structure qui ouvre sur la mission, déroule les projets menés, puis conduit au don — et non l'inverse.",
    contribution: [
      "Conception de l'arborescence et du discours",
      "Développement du site",
      "Intégration du parcours de don",
    ],
    features: ["Projets et actions", "Mission de la fondation", "Collecte de dons", "Actualités"],
  },
  {
    slug: "kecha-2026",
    name: "Ketsia & Chad",
    year: "2026",
    category: "Expérience privée",
    role: "Conception · Développement",
    url: "https://kecha2026.com",
    tagline: "Une invitation de mariage devenue site privé.",
    summary:
      "Un site d'invitation sur mesure : compte à rebours, informations de cérémonie, RSVP et accès réservé aux invités.",
    stack: ["React", "Express", "PostgreSQL", "Accès privé"],
    context:
      "Une invitation papier ne peut ni se mettre à jour ni collecter de réponses. Le site prend le relais entre l'annonce et le jour J.",
    challenge:
      "Garder l'élégance d'un faire-part tout en portant une mécanique de RSVP réelle, y compris la distinction entre cérémonie civile et religieuse.",
    solution:
      "Une composition éditoriale calme, un accès par code réservé aux invités, et un RSVP qui enregistre la présence par cérémonie.",
    contribution: [
      "Conception et direction artistique",
      "Développement de l'interface et des services",
      "Modèle de données invités et RSVP",
    ],
    features: [
      "Compte à rebours",
      "Confirmation de présence par cérémonie",
      "Accès privé par code",
      "Informations pratiques",
    ],
  },
  {
    slug: "mami-samarylin-2026",
    name: "Mamisa & Marylin",
    year: "2026",
    category: "Expérience privée",
    role: "Conception · Développement",
    url: "https://mamisamarylin2026.com",
    tagline: "Un faire-part numérique, en noir et blanc.",
    summary:
      "Un site d'invitation minimaliste construit autour d'une seule photographie et d'un compte à rebours.",
    stack: ["Next.js", "Direction artistique", "RSVP"],
    context:
      "Le couple voulait une invitation sobre, sans surcharge décorative, centrée sur une image.",
    challenge:
      "Tenir un parti pris minimaliste sur toute la page sans que le site paraisse vide ou inachevé.",
    solution:
      "Une mise en page en deux colonnes, une typographie script pour les prénoms, et le noir et blanc comme seule direction chromatique.",
    contribution: [
      "Direction artistique",
      "Développement du site",
      "Parcours de confirmation",
    ],
    features: ["Compte à rebours", "Confirmation de présence", "Informations pratiques"],
  },
];

export const featuredProjects = projects
  .filter((p) => typeof p.featured === "number")
  .sort((a, b) => (a.featured as number) - (b.featured as number));

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export function getProjectNeighbours(slug: string) {
  const i = projects.findIndex((p) => p.slug === slug);
  if (i === -1) return { previous: undefined, next: undefined };
  return {
    previous: projects[(i - 1 + projects.length) % projects.length],
    next: projects[(i + 1) % projects.length],
  };
}

export const projectImage = (slug: string, variant: "desktop" | "mobile" = "desktop") =>
  `/assets/projects/${slug}-${variant}.webp`;

/** Section captures further down the page, generated by scripts/build-assets.py. */
export function projectSections(slug: string) {
  const [desktop, mobile] = galleryCounts[slug] ?? [0, 0];
  return {
    desktop: Array.from({ length: desktop }, (_, i) => `/assets/projects/${slug}-s${i + 1}.webp`),
    mobile: Array.from({ length: mobile }, (_, i) => `/assets/projects/${slug}-mobile-s${i + 1}.webp`),
  };
}

/** 1200×630 social card generated by scripts/build-assets.py. */
export const projectOgImage = (slug: string) => `/assets/og/${slug}.jpg`;

export const projectGroups = ["Plateformes", "Sites premium", "Institutions", "Événements"] as const;
export type ProjectGroup = (typeof projectGroups)[number];

/** Coarse family used by the filters of /projets, derived from the category. */
export function projectGroup(project: Project): ProjectGroup {
  const c = project.category.toLowerCase();
  if (/institution|politique|citoyenne|publique/.test(c)) return "Institutions";
  if (/événement|privée/.test(c)) return "Événements";
  if (/plateforme|saas|fintech/.test(c)) return "Plateformes";
  return "Sites premium";
}

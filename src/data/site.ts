/**
 * Everything the new site says outside the case studies: navigation, the
 * mega menu, services, process and figures. Case studies stay in
 * `projects.ts`; biography stays in `profile.ts`.
 */

export const nav = [
  { href: "/", label: "Accueil" },
  { href: "/projets", label: "Projets", mega: true },
  { href: "/services", label: "Services" },
  { href: "/about", label: "À propos" },
  { href: "/contact", label: "Contact" },
] as const;

/** `href: null` = the project exists but has no public page yet. */
export type MegaLink = { label: string; note: string; href: string | null; image?: string };

export const megaMenu: readonly { title: string; links: readonly MegaLink[] }[] = [
  {
    title: "Plateformes",
    links: [
      { label: "Daylora", note: "SaaS mariage", href: "/projets/daylora", image: "daylora" },
      { label: "Livo", note: "Logistique B2B", href: null },
      { label: "Bloc Léopards", note: "Communauté et billetterie", href: "/projets/bloc-leopards", image: "bloc-leopards" },
      { label: "Or Vert Congo", note: "Événement, 3D, mobile", href: null },
    ],
  },
  {
    title: "Sites premium",
    links: [
      { label: "Lombayo Consulting", note: "Conseil, Dubaï et Belgique", href: "/projets/lombayo-consulting", image: "lombayo-consulting" },
      { label: "Maison Croustille", note: "Pâtisserie premium", href: null },
      { label: "AMCROS Events", note: "Agence événementielle", href: "/projets/amcros-events", image: "amcros-events" },
      { label: "Stade des Martyrs", note: "Expérience 3D", href: null },
    ],
  },
  {
    title: "Expériences",
    links: [
      { label: "Three.js", note: "Scènes temps réel", href: "/services#experiences" },
      { label: "IA", note: "Assistants et automatisation", href: "/services#experiences" },
      { label: "Mobile app", note: "Applications terrain", href: "/services#applications" },
      { label: "Back-office", note: "Outils métier", href: "/services#back-office" },
    ],
  },
];

export const expertise = [
  "Symfony",
  "API Platform",
  "React",
  "Angular",
  "Three.js",
  "IA",
  "Railway",
  "PostgreSQL",
  "UX",
  "Back-office",
] as const;

export const services = [
  {
    id: "sites-premium",
    title: "Sites premium",
    lead: "Des sites qui posent une marque, une institution ou un événement au bon niveau.",
    body: "Direction artistique, écriture de l'arborescence, motion et performance. Le site se charge vite, se lit bien sur un téléphone moyen et se met à jour sans développeur.",
    deliverables: ["Direction artistique", "Site vitrine ou éditorial", "Animations au défilement", "Référencement et mesure"],
    stack: ["Astro", "Next.js"],
    examples: ["lombayo-consulting", "amcros-events", "avc"],
  },
  {
    id: "applications",
    title: "Applications web",
    lead: "Des produits que des gens utilisent tous les jours : inscription, paiement, suivi.",
    body: "Du parcours à la base de données : cadrage, maquettes, développement full-stack, mise en production et itérations. Version mobile ou application installable quand l'usage le demande.",
    deliverables: ["Cadrage produit", "Parcours et maquettes", "Développement full-stack", "Application mobile"],
    stack: ["React", "Next.js", "Node.js", "PostgreSQL"],
    examples: ["daylora", "e-visa", "bloc-leopards"],
  },
  {
    id: "back-office",
    title: "Back-offices métier",
    lead: "Les outils internes qui font tourner une organisation : droits, validations, exports.",
    body: "Modèle de données, rôles et permissions, tableaux de bord, imports et exports, journal des actions. Le genre d'outil que je construis aussi pour les services de la Ville de Lille.",
    deliverables: ["Modèle de données", "Rôles et permissions", "Tableaux de bord", "API et intégrations"],
    stack: ["Symfony", "API Platform", "Angular", "PostgreSQL"],
    examples: ["agdtn", "amcros-institut", "natacha-ruddy"],
  },
  {
    id: "experiences",
    title: "Expériences IA",
    lead: "Un assistant ou une automatisation quand ils servent vraiment le propos.",
    body: "Assistants conversationnels branchés sur le contenu réel, tri et synthèse de demandes, visualisations de données, automatisations avec validation humaine.",
    deliverables: ["Visualisation de données", "Assistant conversationnel", "Automatisation"],
    stack: ["Three.js", "React Three Fiber", "API IA"],
    examples: ["luxos", "lombayo-consulting"],
  },
] as const;

export const process = [
  {
    title: "Comprendre",
    body: "Le métier avant l'outil. Qui utilise le produit, dans quelles conditions, et ce qui doit exister en premier.",
    output: "Note de cadrage",
  },
  {
    title: "Structurer",
    body: "Arborescence, parcours, modèle de données. Les décisions qui coûtent cher plus tard se prennent ici.",
    output: "Arborescence et parcours",
  },
  {
    title: "Designer",
    body: "Une direction artistique propre au projet, puis les écrans réels, sur téléphone d'abord.",
    output: "Maquettes validées",
  },
  {
    title: "Développer",
    body: "Code lisible, déployé en continu sur un environnement que vous pouvez consulter chaque semaine.",
    output: "Version de recette",
  },
  {
    title: "Lancer",
    body: "Mise en production, domaine, mesure d'audience, prise en main. Puis les corrections et les itérations.",
    output: "Site ou produit en ligne",
  },
] as const;

export const figures = [
  { value: "10+", label: "années d'expérience en développement et en pilotage de projets" },
  { value: "6 500+", label: "demandes traitées sur une plateforme événementielle" },
  { value: "3 pays", label: "projets livrés en France, en Belgique et en RDC" },
  { value: "4 métiers", label: "web, mobile, back-office et IA, tenus par la même personne" },
] as const;

export const cities = [
  { name: "Kinshasa", lat: -4.32, lon: 15.31, hub: true, side: "right" },
  { name: "Lille", lat: 50.63, lon: 3.06, side: "left" },
  { name: "Bruxelles", lat: 50.85, lon: 4.35, side: "right" },
  { name: "Paris", lat: 48.86, lon: 2.35, side: "below" },
  { name: "Dubaï", lat: 25.2, lon: 55.27, side: "right" },
  { name: "Montréal", lat: 45.5, lon: -73.57, side: "left" },
] as const;

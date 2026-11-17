/* ─────────────────────────────────────────────────────────────
   ORIGIN — central content configuration
   Update studio details, projects, services and links here.
──────────────────────────────────────────────────────────────── */

export const SITE = {
  name: "ORIGIN",
  tagline: "We design the digital. We build what's next.",
  altStatement: "Your idea. Our craft. A new beginning.",
  description:
    "We design websites and build custom software that moves businesses forward.",
  // Configurable studio contact details
  email: "hello@origin.studio",
  location: "Remote-first",
  /**
   * FORM INTEGRATION POINT
   * Point this at a real form endpoint (e.g. Formspree, Basin, or your own
   * API route) to deliver inquiries directly. While empty, the contact form
   * composes a pre-filled email via the visitor's mail client instead, and
   * the UI clearly explains that behaviour.
   */
  formEndpoint: "",
};

/**
 * Add verified social/profile URLs here. Items with an empty href are not
 * rendered, so the site never ships dead links.
 */
export const SOCIALS: { label: string; href: string }[] = [
  { label: "GitHub", href: "" },
  { label: "LinkedIn", href: "" },
  { label: "X / Twitter", href: "" },
];

export const NAV_LINKS = [
  { id: "work", label: "Work", index: "01" },
  { id: "services", label: "Services", index: "02" },
  { id: "about", label: "About", index: "03" },
  { id: "contact", label: "Contact", index: "04" },
];

export const MARQUEE_ITEMS = [
  "Websites",
  "Software",
  "Web Apps",
  "SaaS",
  "E-commerce",
  "UI/UX",
  "Dashboards",
];

/* ── Selected work ─────────────────────────────────────────── */

export interface Project {
  id: string;
  index: string;
  name: string;
  category: string;
  kind: string; // integrity label — shown on every card
  year: string;
  description: string;
  scope: string[];
  stack: string[];
  image: string;
  alt: string;
  link?: string;
}

export const PROJECTS: Project[] = [
  {
    id: "nike",
    index: "01",
    name: "Nike",
    category: "Brand & E-commerce",
    kind: "Concept",
    year: "2025",
    description: "Modern product showcase and interactive brand experience.",
    scope: ["Art direction", "Design system", "Front-end build", "Interaction"],
    stack: ["React", "TypeScript", "Tailwind CSS", "Vercel"],
    image: "/images/NIKE.webp",
    alt: "Nike concept — modern product showcase and interactive brand experience",
    link: "https://nike-my-version.vercel.app/",
  },
  {
    id: "altiora",
    index: "02",
    name: "Altiora",
    category: "Editorial Storefront",
    kind: "Concept",
    year: "2025",
    description: "Editorial digital storefront and refined essence experience.",
    scope: ["Art direction", "Storefront design", "Checkout flow", "CMS setup"],
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Vercel"],
    image: "/images/ALTIORA.webp",
    alt: "Altiora — editorial digital storefront and brand showcase",
    link: "https://altiora-essence.vercel.app/",
  },
  {
    id: "malushi",
    index: "03",
    name: "Malushi",
    category: "Luxury Jewelry",
    kind: "Concept",
    year: "2026",
    description: "Modern luxury jewellery storefront and digital brand showcase.",
    scope: ["Art direction", "Storefront design", "E-commerce architecture", "Product experience"],
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Vercel"],
    image: "/images/MALUSHI.webp",
    alt: "Malushi Jewels — luxury jewelry storefront and digital showcase",
    link: "https://malushijewels.vercel.app/",
  },
  {
    id: "kova",
    index: "04",
    name: "KOVA",
    category: "Brand Website",
    kind: "Concept",
    year: "2025",
    description: "A digital home for an architecture practice.",
    scope: ["Creative direction", "Web design", "CMS development", "Motion"],
    stack: ["Next.js", "GSAP", "Sanity", "Vercel"],
    image: "/images/work-terraform.jpg",
    alt: "KOVA concept — dark architecture studio website over brutalist photography",
    link: "https://kova-architecture.demo",
  },
  {
    id: "torus",
    index: "05",
    name: "Torus.exe",
    category: "WebGL",
    kind: "Concept",
    year: "2026",
    description: "A real-time 3D brand experience in the browser.",
    scope: ["Creative technology", "WebGL development", "Interaction", "Performance"],
    stack: ["Three.js", "GLSL", "GSAP", "WebGPU"],
    image: "/images/work-axiom.jpg",
    alt: "Torus.exe concept — black WebGL page with an orange wireframe torus",
    link: "https://torus-webgl.demo",
  },
];

/* ── Services ──────────────────────────────────────────────── */

export interface Service {
  index: string;
  title: string;
  summary: string;
  includes: string[];
}

export const SERVICES: Service[] = [
  {
    index: "01",
    title: "Websites",
    summary: "Responsive sites built around your brand and business goals.",
    includes: ["Business websites", "Landing pages", "Brand experiences", "Performance & SEO"],
  },
  {
    index: "02",
    title: "Custom Software",
    summary: "Purpose-built for problems standard tools can't solve.",
    includes: ["Business applications", "Workflow systems", "Internal tools", "API integrations"],
  },
  {
    index: "03",
    title: "Web Apps & SaaS",
    summary: "Products that make complex work feel simple.",
    includes: ["SaaS platforms", "User accounts", "Dashboards", "Payments & subscriptions"],
  },
  {
    index: "04",
    title: "E-commerce",
    summary: "Considered design, effortless checkout.",
    includes: ["Product catalogues", "Cart & checkout", "Payments", "Order management"],
  },
  {
    index: "05",
    title: "UI/UX Design",
    summary: "Interfaces designed around clarity and use.",
    includes: ["User flows", "Wireframes", "Interface design", "Design systems"],
  },
];

/* ── About ─────────────────────────────────────────────────── */

export const PRINCIPLES = [
  {
    index: "01",
    title: "Design with purpose",
    copy: "Every element serves the objective — or it doesn't ship.",
  },
  {
    index: "02",
    title: "Engineer with intention",
    copy: "Reliable and maintainable. Exactly as complex as needed.",
  },
  {
    index: "03",
    title: "Build around the business",
    copy: "The problem decides the solution. Never the reverse.",
  },
];

export const PROCESS_MIN = [
  { index: "01", title: "Discover", hint: "The problem first." },
  { index: "02", title: "Design", hint: "The experience next." },
  { index: "03", title: "Build", hint: "The product, for real." },
  { index: "04", title: "Launch", hint: "Ship, then improve." },
];

/* ── Contact ───────────────────────────────────────────────── */

export const BUDGET_OPTIONS = [
  "Under $5k",
  "$5k – $15k",
  "$15k – $50k",
  "$50k+",
  "Not sure yet",
];

export const SERVICE_OPTIONS = [
  "Website",
  "Software",
  "Web app",
  "E-commerce",
  "UI/UX",
  "Other",
];

import { Layout, Server, Database, Activity } from "lucide-react";

export const IMPACT_METRICS = [
  { label: "Experience", value: "4+ YRS" },
  { label: "Page Load Time", value: "-40%" },
  { label: "Production Bugs", value: "-25%" },
  { label: "Delivery Capacity", value: "+20%" }
];

export const FEATURED_CASE_STUDIES = [
  {
    title: "Nissan i-CAN & Dealership Operations",
    link: "https://dam.nissan-ican.com/",
    domain: "Automotive",
    tags: ["Vue 3", "Laravel", "NestJS", "AWS S3"],
    problem: "Enterprise dealership teams faced multi-second dashboard latencies and fragmented file pipelines.",
    built: "Modular backend microservices decoupling asset storage to AWS S3, coupled with reactive Vue 3/Pinia state.",
    outcome: "Cut vehicle approval turnaround time by 30%; reduced platform page load times by 40%."
  },
  {
    title: "Jugendhilfe Welfare Platform",
    link: "https://develop.wannemueller.com/",
    domain: "Social Care",
    tags: ["Inertia.js", "Vue 3", "Laravel", "WebSockets"],
    problem: "Youth welfare case workers required legally compliant, zero-latency documentation tracking.",
    built: "Secure portal with live WebSocket sync, digital signature capture, and client-side routing via Inertia.js.",
    outcome: "Eliminated asynchronous case tracking bottlenecks with end-to-end real-time state synchronization."
  },
  {
    title: "Dachboxit Cargo Rental Engine",
    link: "http://dachboxit.de/",
    domain: "E-Commerce",
    tags: ["Laravel 10", "Stripe", "MySQL", "Tailwind"],
    problem: "Legacy booking systems suffered from high latency and manual reservation conflicts during peak traffic.",
    built: "Developed a robust rental platform with live calendar reservations, Stripe checkout, and automated email workflows.",
    outcome: "Improved core booking pipeline performance by nearly 40% and eliminated manual reservation conflicts."
  }
];

export const OTHER_WORK = [
  { name: "Nissan Approval System", link: "https://aps.nissan-ican.com", domain: "Automotive", tags: "Vue 3, Laravel, SSO", desc: "Enterprise asset platform with SSO, RBAC, and file versioning." },
  { name: "AquaNova", link: "https://pms.aquanovamarine.com", domain: "Marintime", tags: "NestJS, Next.js, Docker", desc: "Marine management system, containerized with Swagger API docs." },
  { name: "AquaShift", link: "#", domain: "Marintime", tags: "Next.js 15, PostgreSQL", desc: "Real-time marine shift scheduler with typed Postgres schema." },
  { name: "Nissan Book a Service", link: "#", domain: "Automotive", tags: "Vue 3, Google Maps API", desc: "Multi-region service booking engine across 6 Middle East markets." },
  { name: "Lead-Flow CRM", link: "#", domain: "SaaS", tags: "Vue 3, Laravel, Pinia", desc: "Enterprise CRM and dynamic form builder supporting complex validation pipelines." },
  { name: "IoT Dashboard", link: "#", domain: "IoT", tags: "Next.js, Python, PocketBase", desc: "Live IoT telemetry monitor with network analytics." },
  { name: "InFiction", link: "https://infiction.vercel.app/", domain: "Media", tags: "React, Stripe, Twilio", desc: "Production platform for film producers with automated payment and SMS hooks." }
];

export const EXPERIENCE_TIMELINE = [
  {
    company: "Alternative Digital Solutions",
    role: "Full Stack Developer",
    date: "Apr 2025 - Present",
    points: [
      "Engineered high-performance digital workflows for Nissan dealership operations, boosting approval speed by 30%.",
      "Slashed platform page load times by 40% via decoupled Vue.js, Laravel, and NestJS microservices."
    ]
  },
  {
    company: "BuildnBoost",
    role: "Full Stack Developer",
    date: "Jul 2024 - Apr 2025",
    points: [
      "Architected scalable relational schemas and REST APIs in React and Node.js for high-concurrency loads.",
      "Expanded client product delivery capacity by 20% by delivering critical features ahead of schedule."
    ]
  },
  {
    company: "TMedia Business Solutions",
    role: "Full Stack Developer",
    date: "Nov 2022 - May 2024",
    points: [
      "Led a cross-functional Agile squad shipping scalable SaaS systems with React, Python, Node.js, and PostgreSQL.",
      "Reduced production bugs by 25% via automated integration testing suites."
    ]
  }
];

export const TECHNICAL_ARSENAL = [
  { cat: "Frontend", tools: "React.js, Next.js, Vue.js, TypeScript, Tailwind CSS", icon: <Layout className="w-4 h-4 text-muted-foreground" /> },
  { cat: "Backend", tools: "Node.js, Python, Laravel, NestJS, FastAPI", icon: <Server className="w-4 h-4 text-muted-foreground" /> },
  { cat: "Data/Infra", tools: "PostgreSQL, MongoDB, AWS, Docker", icon: <Database className="w-4 h-4 text-muted-foreground" /> },
  { cat: "Integrations", tools: "Stripe API, Twilio, OAuth, WebSockets, Firebase", icon: <Activity className="w-4 h-4 text-muted-foreground" /> }
];

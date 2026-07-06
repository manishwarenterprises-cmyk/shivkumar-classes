export const SITE = {
  name: "Shiv Sir's Education Hub",
  short: "Shiv Sir's",
  tagline: "Building Future Commerce Leaders Since 2012",
  city: "Nagpur, Maharashtra",
  phone: "+91 95116 79065",
  whatsapp: "919511679065",
  email: "info@shivsirseducationhub.in",
  address:
    "Balaji Complex, Near Blue Bells Convent School, Above Shree Jewellers, Duttawadi, Wadi, Nagpur, Maharashtra 440023",
  mapsEmbed:
    "https://www.google.com/maps?q=Balaji+Complex+Blue+Bells+Convent+School+Duttawadi+Wadi+Nagpur+440023&output=embed",
  rating: 5.0,
  reviews: 62,
  years: 13,
  agency: "ManishwarAI Agency",
  agencyTagline: "Creative | Innovative | Solutions",
};

export const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/courses", label: "Courses" },
  { to: "/results", label: "Results" },
  { to: "/testimonials", label: "Testimonials" },
  { to: "/gallery", label: "Gallery" },
  { to: "/blog", label: "Blog" },
  { to: "/admission", label: "Admission" },
  { to: "/fees", label: "Fees" },
  { to: "/locations", label: "Locations" },
  { to: "/contact", label: "Contact" },
] as const;


export const COURSES = [
  {
    slug: "11th-commerce",
    title: "11th Commerce",
    tag: "Foundation",
    summary:
      "Master Accountancy, Economics and Business Studies from day one with a structured foundation curriculum.",
    subjects: ["Accountancy", "Economics", "Business Studies", "Mathematics", "English"],
    duration: "1 Year",
  },
  {
    slug: "12th-commerce",
    title: "12th Commerce",
    tag: "Board Excellence",
    summary:
      "Board-focused mastery with relentless revision, mock boards and personalised doubt solving for 90+ scores.",
    subjects: ["Accountancy", "Economics", "Business Studies", "OCM", "Mathematics"],
    duration: "1 Year",
  },
  {
    slug: "cbse-commerce",
    title: "CBSE Commerce",
    tag: "CBSE Board",
    summary:
      "NCERT-aligned coaching with previous year analysis, sample paper drills and concept-first teaching.",
    subjects: ["Accountancy", "Economics", "Business Studies", "Applied Maths"],
    duration: "11th & 12th",
  },
  {
    slug: "maharashtra-board-commerce",
    title: "Maharashtra Board Commerce",
    tag: "HSC Board",
    summary:
      "State board specialists — chapter weightage, board pattern questions and complete Marathi/English medium support.",
    subjects: ["Book Keeping", "Economics", "OCM", "SP", "Mathematics"],
    duration: "11th & 12th",
  },
  {
    slug: "bcom",
    title: "B.Com",
    tag: "Graduation",
    summary:
      "University-level coaching covering corporate accounting, business law, taxation and financial management.",
    subjects: ["Financial Accounting", "Business Law", "Cost Accounting", "Taxation", "Auditing"],
    duration: "3 Years",
  },
  {
    slug: "bba",
    title: "BBA",
    tag: "Management",
    summary:
      "Management-focused coaching with case studies, presentations and industry-relevant business curriculum.",
    subjects: ["Management Principles", "Marketing", "Finance", "HR", "Business Analytics"],
    duration: "3 Years",
  },
];

// Only real Google reviews — placeholders for verified names; replace with actual review export.
export const TESTIMONIALS = [
  {
    name: "Aarav Sharma",
    rating: 5,
    date: "2024-11-12",
    content:
      "Shiv Sir explains accountancy with such clarity that even the toughest journal entries feel intuitive. Scored 94 in boards thanks to the test series.",
    helpful: 42,
  },
  {
    name: "Sanya Deshmukh",
    rating: 5,
    date: "2024-09-04",
    content:
      "The personal attention here is unmatched. Sir knows every student's weak chapter and works on it patiently. Best commerce coaching in Nagpur.",
    helpful: 38,
  },
  {
    name: "Rohan Kale",
    rating: 5,
    date: "2024-07-22",
    content:
      "Joined for 12th Commerce after switching from another class. The difference in teaching depth was night and day. Highly recommended.",
    helpful: 31,
  },
  {
    name: "Ishita Verma",
    rating: 5,
    date: "2024-05-18",
    content:
      "Economics finally made sense. Sir uses real Indian business examples that you actually remember in the exam hall.",
    helpful: 27,
  },
  {
    name: "Karan Joshi",
    rating: 5,
    date: "2024-03-09",
    content:
      "B.Com classes here are gold. Concepts of taxation and corporate accounting were demystified in just a few sessions.",
    helpful: 24,
  },
  {
    name: "Meera Patil",
    rating: 5,
    date: "2024-01-27",
    content:
      "Calm environment, no chaos, no shouting — just disciplined commerce learning. Parents, you can trust this place fully.",
    helpful: 33,
  },
];

export const BLOG_POSTS = [
  {
    slug: "how-to-score-90-plus-in-accountancy",
    title: "How To Score 90+ In Accountancy",
    category: "Accountancy",
    excerpt:
      "A chapter-wise blueprint, presentation tips and revision rhythm that consistently produces 90+ board scores.",
    read: 8,
    date: "2025-04-12",
    author: "Shiv Sir",
  },
  {
    slug: "commerce-after-10th-complete-guide",
    title: "Commerce After 10th — The Complete Guide",
    category: "Career Guidance",
    excerpt:
      "Stream selection, subject combinations, career paths and how to decide if commerce is truly right for you.",
    read: 11,
    date: "2025-03-30",
    author: "Shiv Sir",
  },
  {
    slug: "bcom-vs-bba",
    title: "B.Com vs BBA — Which One Should You Choose?",
    category: "Career Guidance",
    excerpt:
      "An honest comparison of curriculum, career outcomes, salary trajectories and the kind of student each course suits.",
    read: 9,
    date: "2025-03-14",
    author: "Shiv Sir",
  },
  {
    slug: "best-career-options-after-12th-commerce",
    title: "Best Career Options After 12th Commerce",
    category: "Career Guidance",
    excerpt:
      "From CA and CS to Data Analytics and Finance — a roadmap of every credible commerce career in 2025.",
    read: 12,
    date: "2025-02-22",
    author: "Shiv Sir",
  },
  {
    slug: "common-mistakes-commerce-students-make",
    title: "Common Mistakes Commerce Students Make",
    category: "Exam Preparation",
    excerpt:
      "Avoid these eight silent mistakes that quietly cost students 10 to 15 marks in every board exam.",
    read: 7,
    date: "2025-02-05",
    author: "Shiv Sir",
  },
  {
    slug: "how-to-prepare-for-board-exams",
    title: "How To Prepare For Board Exams",
    category: "Exam Preparation",
    excerpt:
      "A 90-day countdown plan covering revision, mock tests, mental health and exam-hall strategy.",
    read: 10,
    date: "2025-01-18",
    author: "Shiv Sir",
  },
  {
    slug: "future-scope-of-commerce-in-india",
    title: "Future Scope Of Commerce In India",
    category: "Commerce Tips",
    excerpt:
      "Why commerce is quietly becoming the most future-proof stream — and the new-age careers fuelling its rise.",
    read: 9,
    date: "2024-12-22",
    author: "Shiv Sir",
  },
];

export const FAQS = [
  {
    q: "What courses do you offer?",
    a: "We offer specialised commerce coaching for 11th, 12th (CBSE and Maharashtra Board), B.Com and BBA. Each course is taught by Shiv Sir with structured notes, regular test series and personal doubt sessions.",
  },
  {
    q: "What is the fee structure?",
    a: "Fees vary by course and class size. We keep our pricing transparent and competitive. Please book a free demo class or message us on WhatsApp for a personalised fee quote.",
  },
  {
    q: "What is the admission process?",
    a: "Three simple steps: 1) Book a free demo class, 2) Meet Shiv Sir for a quick orientation, 3) Complete the registration form and fee payment. The entire process takes one visit.",
  },
  {
    q: "What are the class timings?",
    a: "We run morning, afternoon and evening batches. Most school students prefer the evening slot (5:00 PM – 8:00 PM). Exact timings are confirmed during admission based on your school schedule.",
  },
  {
    q: "Where is the institute located?",
    a: "Shiv Sir's Education Hub is centrally located in Nagpur, Maharashtra, easily reachable from all major commerce schools and colleges. Detailed directions are on our Contact page.",
  },
  {
    q: "Do you provide study material and notes?",
    a: "Yes. Every student receives chapter-wise printed notes, formula sheets, previous year question banks and weekly test papers — all included in the fees.",
  },
  {
    q: "How do you handle doubts and weak students?",
    a: "We run dedicated doubt-clearing slots every week and offer 1-on-1 sessions for students struggling with specific chapters. No student is left behind.",
  },
  {
    q: "Are there demo classes available?",
    a: "Absolutely. We strongly encourage every prospective student to attend a free demo class before enrolling — so you can experience the teaching style firsthand.",
  },
];

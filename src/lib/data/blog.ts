export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  readingTime: string;
  category: string;
  author: string;
  image?: string;
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "uluwatu-property-investment-guide-2026",
    title:
      "Uluwatu Property Investment Guide 2026: Yields, Risks & What to Know",
    description:
      "A practical look at Uluwatu’s luxury villa market, expected gross yields, and the main risks to consider before investing in 2026.",
    publishedAt: "2025-11-15T00:00:00.000Z",
    readingTime: "6 min",
    category: "Market",
    author: "Casa Bombora Investment Team",
    image: "/images/backgrounds/Hero_bg.desktop.webp",
  },
  {
    slug: "foreigner-invest-bali-villa-legal-structures",
    title:
      "How Foreigners Can Legally Invest in a Bali Villa: Leasehold, PT PMA & Hak Pakai",
    description:
      "Compare the three main ownership pathways used by foreign buyers in Bali and what each one means for control, duration, and resale.",
    publishedAt: "2025-10-22T00:00:00.000Z",
    readingTime: "6 min",
    category: "Legal",
    author: "Casa Bombora Investment Team",
    image: "/images/backgrounds/Hero_bg.desktop.webp",
  },
  {
    slug: "uluwatu-villa-roi-realistic-numbers",
    title: "Realistic ROI for a Luxury Villa in Uluwatu, Bali",
    description:
      "Break down gross and net ROI for a professionally managed Uluwatu villa, including occupancy, ADR, and operating costs.",
    publishedAt: "2025-09-18T00:00:00.000Z",
    readingTime: "6 min",
    category: "ROI",
    author: "Casa Bombora Investment Team",
    image: "/images/backgrounds/Hero_bg.desktop.webp",
  },
  {
    slug: "bali-villa-construction-timeline",
    title:
      "Bali Villa Construction Timeline: From Land to Keys in 12 Months",
    description:
      "A month-by-month overview of a typical 12-month Bali villa build, from due diligence to handover and first guests.",
    publishedAt: "2025-08-05T00:00:00.000Z",
    readingTime: "6 min",
    category: "Process",
    author: "Casa Bombora Investment Team",
    image: "/images/backgrounds/Hero_bg.desktop.webp",
  },
  {
    slug: "bali-pondok-wisata-license",
    title:
      "Pondok Wisata & Short-Term Rental Licensing in Bali: What Investors Need to Know",
    description:
      "Understand Pondok Wisata and the permits that matter for short-term rental villas, plus the steps to keep your operation compliant.",
    publishedAt: "2025-07-12T00:00:00.000Z",
    readingTime: "6 min",
    category: "Legal",
    author: "Casa Bombora Investment Team",
    image: "/images/backgrounds/Hero_bg.desktop.webp",
  },
  {
    slug: "pt-pma-vs-leasehold-bali",
    title:
      "PT PMA vs Leasehold: Which Ownership Structure Is Right for Your Bali Villa?",
    description:
      "A side-by-side comparison of PT PMA company ownership and leasehold for Bali villas, with practical guidance on which to consider.",
    publishedAt: "2025-06-30T00:00:00.000Z",
    readingTime: "6 min",
    category: "Legal",
    author: "Casa Bombora Investment Team",
    image: "/images/backgrounds/Hero_bg.desktop.webp",
  },
];

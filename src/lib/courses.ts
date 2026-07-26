/**
 * Courses Catalog - Artispreneur Academy
 * Extracted from v217 course HTML files
 */

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  moduleCount: number;
  chapters: number;
}

export const courses: Course[] = [
  {
    id: "pro-registration",
    title: "How to Register with a P.R.O.",
    slug: "register-with-pro",
    description: "Learn how to register with a Performing Rights Organization (BMI, ASCAP, SESAC) and start collecting royalties. Covers types of royalties, registration steps, and maximizing your earnings.",
    category: "Royalties",
    moduleCount: 17,
    chapters: 7
  },
  {
    id: "distribute-music",
    title: "How to Distribute Your Music",
    slug: "distribute-your-music",
    description: "Complete guide to music distribution through DSPs (TuneCore, CD Baby, DistroKid, Amuse, UnitedMasters). Learn about metadata, ISRC codes, royalty splits, and playlist placement.",
    category: "Distribution",
    moduleCount: 21,
    chapters: 7
  },
  {
    id: "setup-llc",
    title: "How to Set Up an LLC",
    slug: "setup-llc",
    description: "Step-by-step guide to forming an LLC for your music business. Covers business incorporation, liability protection, tax benefits, Articles of Organization, Operating Agreement, and EIN registration.",
    category: "Legal",
    moduleCount: 20,
    chapters: 7
  },
  {
    id: "license-music",
    title: "How to License Your Music",
    slug: "license-your-music",
    description: "Learn sync licensing, music libraries, and how to get your music into TV, film, and commercials. Covers supervisor pitching and royalty collection.",
    category: "Licensing",
    moduleCount: 15,
    chapters: 5
  },
  {
    id: "register-ein",
    title: "How to Register an EIN",
    slug: "register-ein",
    description: "Guide to obtaining an Employer Identification Number (EIN) from the IRS. Essential for opening business bank accounts, filing taxes, and operating as a legal entity.",
    category: "Finance",
    moduleCount: 12,
    chapters: 5
  },
  {
    id: "business-bank-account",
    title: "How to Set Up a Business Bank Account",
    slug: "setup-business-bank-account",
    description: "Learn how to open and manage a business bank account for your music career. Covers required documents, choosing banks, and separating personal from business finances.",
    category: "Finance",
    moduleCount: 18,
    chapters: 6
  },
  {
    id: "file-business-taxes",
    title: "How to File Business Taxes",
    slug: "file-business-taxes",
    description: "Complete tax filing guide for music businesses. Covers Schedule C, quarterly estimated taxes, deductions for musicians, and working with accountants.",
    category: "Finance",
    moduleCount: 22,
    chapters: 8
  },
  {
    id: "copyright-music",
    title: "How to Copyright Your Music",
    slug: "copyright-your-music",
    description: "Learn how to register copyrights for your original music with the U.S. Copyright Office. Covers registration process, fees, and protection rights.",
    category: "Legal",
    moduleCount: 16,
    chapters: 6
  },
  {
    id: "trademark-music",
    title: "How to Trademark Your Music Brand",
    slug: "trademark-your-music",
    description: "Guide to trademarking your artist name, band name, or music brand. Covers USPTO registration, protecting your intellectual property, and avoiding infringement.",
    category: "Legal",
    moduleCount: 14,
    chapters: 5
  },
  {
    id: "create-catalog",
    title: "How to Create a Music Catalogue",
    slug: "create-music-catalogue",
    description: "Build and manage your professional music catalog. Covers metadata, ISRC codes, discography organization, and catalog documentation.",
    category: "Catalog",
    moduleCount: 13,
    chapters: 5
  },
  {
    id: "brand-yourself",
    title: "How to Brand Yourself as an Artist",
    slug: "brand-yourself-as-artist",
    description: "Develop a cohesive artist brand identity. Covers visual identity, messaging, storytelling, social media presence, and EPK creation.",
    category: "Marketing",
    moduleCount: 16,
    chapters: 6
  },
  {
    id: "submit-playlists-blogs",
    title: "How to Submit Music to Blogs & Playlists",
    slug: "submit-music-blogs-playlists",
    description: "Learn effective outreach strategies for playlist curators and music blogs. Covers pitching, press kits, follow-up, and building relationships.",
    category: "Marketing",
    moduleCount: 19,
    chapters: 7
  },
  {
    id: "promote-shows",
    title: "How to Promote Your Shows",
    slug: "promote-your-shows",
    description: "Complete live show promotion guide. Covers social media marketing, event pages, flyers, venue partnerships, and building a local fanbase.",
    category: "Marketing",
    moduleCount: 15,
    chapters: 6
  },
  {
    id: "setup-crm",
    title: "How to Set Up a Music CRM",
    slug: "setup-crm",
    description: "Build a customer relationship management system for your music career. Track contacts, manage outreach campaigns, and organize industry relationships.",
    category: "Business",
    moduleCount: 17,
    chapters: 6
  },
  {
    id: "add-pro-songs",
    title: "How to Add Songs to Your P.R.O.",
    slug: "add-songs-to-pro",
    description: "Step-by-step guide to registering individual songs with your PRO after initial signup. Covers work registration, metadata, and co-writer splits.",
    category: "Royalties",
    moduleCount: 16,
    chapters: 6
  },
  {
    id: "collaborative-playlists",
    title: "How to Add Music to Collaborative Playlists",
    slug: "add-music-collaborative-playlist",
    description: "Learn how to leverage collaborative playlists on Spotify and Apple Music for organic growth. Covers finding playlists, submission tactics, and playlist networking.",
    category: "Distribution",
    moduleCount: 14,
    chapters: 5
  }
];

export const courseCategories = Array.from(new Set(courses.map(c => c.category)));

export function getCourseBySlug(slug: string): Course | undefined {
  return courses.find(c => c.slug === slug);
}

export function getCoursesByCategory(category: string): Course[] {
  return courses.filter(c => c.category === category);
}

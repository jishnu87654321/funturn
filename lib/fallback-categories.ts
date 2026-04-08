export type FallbackCategory = {
  _id: string;
  name: string;
  slug: string;
  shortDescription: string;
  icon: string;
};

export const fallbackCategories: FallbackCategory[] = [
  {
    _id: 'bootcamps',
    name: 'Bootcamps',
    slug: 'bootcamps',
    shortDescription: 'Intensive skill-building programs that take you from zero to job-ready in weeks.',
    icon: 'BC',
  },
  {
    _id: 'campus-programs',
    name: 'Campus Programs',
    slug: 'campus-programs',
    shortDescription: 'Exclusive on-campus opportunities to represent Funtern and grow your campus community.',
    icon: 'CP',
  },
  {
    _id: 'summer-camps',
    name: 'Summer Camps',
    slug: 'summer-camps',
    shortDescription: 'Fun-packed summer learning experiences that blend education with real-world skills.',
    icon: 'SC',
  },
  {
    _id: 'competitions',
    name: 'Competitions',
    slug: 'competitions',
    shortDescription: 'Put your skills to the test, win recognition, and stand out on your profile.',
    icon: 'CM',
  },
  {
    _id: 'workshops',
    name: 'Workshops',
    slug: 'workshops',
    shortDescription: 'Hands-on, interactive sessions led by industry mentors. Learn by doing.',
    icon: 'WS',
  },
  {
    _id: 'talks',
    name: 'Talks',
    slug: 'talks',
    shortDescription: 'Inspiring speaker sessions from founders, professionals, and industry experts.',
    icon: 'TK',
  },
  {
    _id: 'induction',
    name: 'Induction',
    slug: 'induction',
    shortDescription: 'Get onboarded into tech, business, or creative fields with structured introduction programs.',
    icon: 'IN',
  },
  {
    _id: 'campus-co-ordinator',
    name: 'Campus Co-ordinator',
    slug: 'campus-co-ordinator',
    shortDescription: 'Lead Funtern initiatives at your campus and build real leadership experience.',
    icon: 'CC',
  },
  {
    _id: 'tutors',
    name: 'Tutors',
    slug: 'tutors',
    shortDescription: 'Become a Funtern tutor and earn while you help peers learn new skills.',
    icon: 'TT',
  },
  {
    _id: 'club-building',
    name: 'Club Building',
    slug: 'club-building',
    shortDescription: 'Co-found or join a student club backed by Funtern and grow your community.',
    icon: 'CB',
  },
  {
    _id: 'contract-opportunities',
    name: 'Contract Opportunities',
    slug: 'contract-opportunities',
    shortDescription: 'Short-term, paid, project-based contracts for students ready to do real work.',
    icon: 'CO',
  },
];

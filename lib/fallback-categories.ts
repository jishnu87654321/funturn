export type FallbackCategory = {
  _id: string;
  name: string;
  slug: string;
  shortDescription: string;
  icon: string;
};

export const fallbackCategories: FallbackCategory[] = [
  {
    _id: 'boot-campus',
    name: 'Boot Campus',
    slug: 'boot-campus',
    shortDescription: 'Immersive campus-style training to build real skills fast.',
    icon: 'BC',
  },
  {
    _id: 'summer-campus',
    name: 'Summer Campus',
    slug: 'summer-campus',
    shortDescription: 'A fun seasonal learning experience with creativity and engagement.',
    icon: 'SC',
  },
  {
    _id: 'competitions',
    name: 'Competitions',
    slug: 'competitions',
    shortDescription: 'Exciting events that help students challenge themselves and grow.',
    icon: 'CP',
  },
  {
    _id: 'workshops',
    name: 'Workshops',
    slug: 'workshops',
    shortDescription: 'Hands-on sessions focused on practical learning.',
    icon: 'WS',
  },
  {
    _id: 'talks',
    name: 'Talks',
    slug: 'talks',
    shortDescription: 'Insightful sessions from mentors, speakers, and professionals.',
    icon: 'TK',
  },
  {
    _id: 'induction',
    name: 'Induction',
    slug: 'induction',
    shortDescription: 'A guided introduction to Funtern opportunities and culture.',
    icon: 'IN',
  },
  {
    _id: 'campus-coordinator',
    name: 'Campus Coordinator',
    slug: 'campus-coordinator',
    shortDescription: 'Leadership opportunities to organize and manage campus activities.',
    icon: 'CC',
  },
  {
    _id: 'tutors',
    name: 'Tutors',
    slug: 'tutors',
    shortDescription: 'Teaching and mentoring roles that help others grow.',
    icon: 'TT',
  },
  {
    _id: 'club-building',
    name: 'Club Building',
    slug: 'club-building',
    shortDescription: 'Community-building initiatives for collaborative student groups.',
    icon: 'CB',
  },
  {
    _id: 'content-creation',
    name: 'Content Creation',
    slug: 'content-creation',
    shortDescription: 'Creative roles for videos, posts, stories, and student content.',
    icon: 'CR',
  },
  {
    _id: 'blossom',
    name: 'Blossom',
    slug: 'blossom',
    shortDescription: 'Playful learning experiences for small kids.',
    icon: 'BL',
  },
];

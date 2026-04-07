const mongoose = require('mongoose');

const seedData = [
  {
    name: 'Bootcamps',
    slug: 'bootcamps',
    shortDescription: 'Intensive skill-building programs that take you from zero to job-ready in weeks.',
    icon: '🏕️',
    sortOrder: 1,
  },
  {
    name: 'Campus Programs',
    slug: 'campus-programs',
    shortDescription: 'Exclusive on-campus opportunities to represent Funtern and grow your campus community.',
    icon: '🏫',
    sortOrder: 2,
  },
  {
    name: 'Summer Camps',
    slug: 'summer-camps',
    shortDescription: 'Fun-packed summer learning experiences that blend education with real-world skills.',
    icon: '☀️',
    sortOrder: 3,
  },
  {
    name: 'Competitions',
    slug: 'competitions',
    shortDescription: 'Put your skills to the test, win recognition, and stand out on your profile.',
    icon: '🏆',
    sortOrder: 4,
  },
  {
    name: 'Workshops',
    slug: 'workshops',
    shortDescription: 'Hands-on, interactive sessions led by industry mentors. Learn by doing.',
    icon: '🛠️',
    sortOrder: 5,
  },
  {
    name: 'Talks',
    slug: 'talks',
    shortDescription: 'Inspiring speaker sessions from founders, professionals, and industry experts.',
    icon: '🎤',
    sortOrder: 6,
  },
  {
    name: 'Induction',
    slug: 'induction',
    shortDescription: 'Get onboarded into tech, business, or creative fields with structured introduction programs.',
    icon: '🚀',
    sortOrder: 7,
  },
  {
    name: 'Campus Co-ordinator',
    slug: 'campus-co-ordinator',
    shortDescription: 'Lead Funtern initiatives at your campus and build real leadership experience.',
    icon: '📣',
    sortOrder: 8,
  },
  {
    name: 'Tutors',
    slug: 'tutors',
    shortDescription: 'Become a Funtern tutor and earn while you help peers learn new skills.',
    icon: '📚',
    sortOrder: 9,
  },
  {
    name: 'Club Building',
    slug: 'club-building',
    shortDescription: 'Co-found or join a student club backed by Funtern and grow your community.',
    icon: '🏛️',
    sortOrder: 10,
  },
  {
    name: 'Contract Opportunities',
    slug: 'contract-opportunities',
    shortDescription: 'Short-term, paid, project-based contracts for students ready to do real work.',
    icon: '💼',
    sortOrder: 11,
  },
];

module.exports = { seedData };

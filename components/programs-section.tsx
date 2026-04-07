'use client';

const programs = [
  {
    title: 'Software Engineering',
    description: 'Build the future of technology',
    icon: '💻',
    companies: ['Google', 'Apple', 'Microsoft'],
  },
  {
    title: 'Product Management',
    description: 'Shape product strategy and vision',
    icon: '🎯',
    companies: ['Meta', 'Amazon', 'Netflix'],
  },
  {
    title: 'UX/UI Design',
    description: 'Create beautiful user experiences',
    icon: '🎨',
    companies: ['Figma', 'Adobe', 'Airbnb'],
  },
  {
    title: 'Data Science',
    description: 'Unlock insights from data',
    icon: '📊',
    companies: ['Stripe', 'Uber', 'Tesla'],
  },
  {
    title: 'Business Development',
    description: 'Drive growth and partnerships',
    icon: '📈',
    companies: ['HubSpot', 'Salesforce', 'Slack'],
  },
  {
    title: 'Marketing',
    description: 'Reach and engage audiences',
    icon: '📣',
    companies: ['Nike', 'Coca-Cola', 'Spotify'],
  },
];

export function ProgramsSection() {
  return (
    <section id="programs" className="relative z-10 py-16 sm:py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 sm:mb-16 fade-up">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4">
            Internship Programs
          </h2>
          <p className="text-base sm:text-lg text-gray-400">
            Explore opportunities across various disciplines
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {programs.map((program, idx) => (
            <div
              key={idx}
              className="group p-5 sm:p-6 rounded-xl border border-purple-700/50 bg-purple-900/20 hover:bg-purple-900/40 transition backdrop-blur-sm cursor-pointer fade-up"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div className="text-3xl sm:text-4xl mb-3">{program.icon}</div>
              <h3 className="text-white font-semibold text-base sm:text-lg mb-2">{program.title}</h3>
              <p className="text-gray-400 text-xs sm:text-sm mb-4">{program.description}</p>
              <div className="flex flex-wrap gap-2">
                {program.companies.map((company, cidx) => (
                  <span
                    key={cidx}
                    className="px-2 py-1 text-xs rounded bg-purple-700/30 text-purple-300"
                  >
                    {company}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

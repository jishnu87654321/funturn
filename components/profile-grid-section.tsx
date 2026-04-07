'use client';

const profiles = [
  {
    name: 'Build Your Profile',
    description: 'Showcase your skills and experience',
    stat: '95%',
    statLabel: 'Complete Profiles Get Offers',
  },
  {
    name: 'Get Matched',
    description: 'AI-powered recommendations just for you',
    stat: '2,000+',
    statLabel: 'Opportunities',
  },
  {
    name: 'Apply & Interview',
    description: 'Direct access to top companies',
    stat: '50k+',
    statLabel: 'Active Students',
  },
  {
    name: 'Secure Your Offer',
    description: 'Negotiate and accept your ideal role',
    stat: '94%',
    statLabel: 'Success Rate',
  },
];

export function ProfileGridSection() {
  return (
    <section className="relative z-10 py-16 sm:py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 sm:mb-16 fade-up">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4">
            How It Works
          </h2>
          <p className="text-base sm:text-lg text-gray-400">
            Your journey from student to intern in four simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {profiles.map((profile, idx) => (
            <div
              key={idx}
              className="relative p-6 sm:p-8 rounded-xl border border-purple-700/50 bg-gradient-to-br from-purple-900/30 to-indigo-900/20 hover:from-purple-900/50 hover:to-indigo-900/30 transition backdrop-blur-sm fade-up group overflow-hidden"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-transparent opacity-0 group-hover:opacity-100 transition" />
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4 gap-4">
                  <div className="text-left">
                    <h3 className="text-base sm:text-lg font-semibold text-white mb-1">
                      {profile.name}
                    </h3>
                    <p className="text-gray-400 text-xs sm:text-sm">{profile.description}</p>
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text flex-shrink-0">
                    {idx + 1}
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-purple-700/30">
                  <p className="text-xs sm:text-sm text-gray-400">{profile.statLabel}</p>
                  <p className="text-xl sm:text-2xl font-bold text-purple-300 mt-1">{profile.stat}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

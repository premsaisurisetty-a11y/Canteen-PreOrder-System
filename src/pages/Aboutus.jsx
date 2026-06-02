import React from 'react';

const Aboutus = () => {
  const developers = [
    {
      name: "Prem Sai Surisetty",
      role: "Lead Developer & Designer",
      initials: "PS",
      gradient: "from-orange-500 to-amber-500",
      github: "https://github.com/premsaisurisetty-a11y",
      linkedin: "https://www.linkedin.com/in/prem-sai-surisetty-833a69280/"
    },
    {
      name: "Sohan",
      role: "Co-Developer & Integrator",
      initials: "S",
      gradient: "from-amber-500 to-yellow-500",
      github: "https://github.com/sohan-demo", // easily editable placeholder
      linkedin: "https://linkedin.com/in/sohan-demo" // easily editable placeholder
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 mt-10 space-y-12 animate-fade-in">
      {/* Brand Intro Card */}
      <section className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center text-white font-extrabold text-3xl shadow-lg shadow-orange-500/20 mx-auto">
          CB
        </div>
        <h1 className="text-4xl font-black text-slate-800 dark:text-slate-100 tracking-tight leading-none">
          About CanteenBites
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base leading-relaxed">
          CanteenBites is a state-of-the-art college canteen pre-ordering application built to reduce long lunch hour queues, optimize meal pickup workflows, and simplify student transactions.
        </p>
      </section>

      {/* Meet the Developers */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 tracking-tight">
            Meet the Developers
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            The creative minds behind the design, flow, and backend integrations.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {developers.map((dev, index) => (
            <div
              key={index}
              className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-lg shadow-slate-150/50 dark:shadow-none hover:shadow-xl dark:hover:border-slate-700 transition-all duration-300 flex flex-col items-center text-center space-y-4 group"
            >
              {/* Avatar Initial Badge */}
              <div className={`w-16 h-16 rounded-full bg-gradient-to-tr ${dev.gradient} flex items-center justify-center text-white font-black text-xl shadow-lg shadow-orange-500/10 group-hover:scale-105 transition-transform duration-300`}>
                {dev.initials}
              </div>

              {/* Dev Info */}
              <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
                  {dev.name}
                </h3>
                <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-0.5">
                  {dev.role}
                </p>
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-3 pt-2">
                {/* GitHub */}
                <a
                  href={dev.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center text-slate-500 hover:text-orange-500 hover:border-orange-500/20 hover:bg-orange-50/30 dark:hover:text-orange-400 dark:hover:bg-orange-950/20 transition-all duration-200"
                  aria-label={`${dev.name} GitHub`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>

                {/* LinkedIn */}
                <a
                  href={dev.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center text-slate-500 hover:text-blue-600 hover:border-blue-500/20 hover:bg-blue-50/30 dark:hover:text-blue-400 dark:hover:bg-blue-950/20 transition-all duration-200"
                  aria-label={`${dev.name} LinkedIn`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Aboutus;

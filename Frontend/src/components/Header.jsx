import React, { useEffect, useState } from 'react';
import { getAllLinks } from '../services/api';

const Header = ({ profile }) => {
  if (!profile) return null;

  const navItems = [
    { href: '#skills', label: 'Skills' },
    { href: '#projects', label: 'Projects' },
  ];

  const [social, setSocial] = useState({ leetcode: '', github: '', linkedin: '', resume: '' });

  useEffect(() => {
    
    const fetchLinks = async () => {
      try {
        const res = await getAllLinks();
        let raw = [];
        if (res?.data?.success) {
          raw = res.data.data;
        } else {
          raw = res?.data?.links ?? res?.data ?? [];
        }

        let flattened = [];
        if (Array.isArray(raw)) {
          if (raw.length > 0 && raw[0] && Array.isArray(raw[0].links)) {
            flattened = raw.flatMap((p) => (Array.isArray(p.links) ? p.links : []));
          } else {
            flattened = raw;
          }
        } else if (raw && Array.isArray(raw.links)) {
          flattened = raw.links;
        }

        const findByTitle = (title) => {
          const found = flattened.find((l) => typeof l?.title === 'string' && l.title.toLowerCase() === title);
          return found?.link || '';
        };

        setSocial({
          leetcode: findByTitle('leetcode'),
          github: profile.github || findByTitle('github'),
          linkedin: profile.linkedin || findByTitle('linkedin'),
          resume : profile.resume || findByTitle('resume')
        });
      } catch (_) {
        setSocial({
          leetcode: '',
          github: profile.github || '',
          linkedin: profile.linkedin || '',
          resume: profile.resume || '',
        });
      }
    };

    fetchLinks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <header className="z-40 backdrop-blur supports-[backdrop-filter]:bg-gray-950/60 bg-gray-950/80 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <nav className="h-16 flex items-center justify-between">
          <a href="#" className="flex items-center gap-3 group">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 shadow-md ring-1 ring-white/20 group-hover:scale-105 transition-transform" />
            <div className="leading-tight">
              <p className="text-sm text-gray-400">Portfolio</p>
              <p className="text-sm font-semibold text-white">{profile.fullName}</p>
            </div>
          </a>

          <ul className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="text-sm text-gray-300 hover:text-white transition-colors"
                >
                  {item.label}
                </a>
              </li>
            ))}
            {social.leetcode && (
              <li>
                <a href={social.leetcode} target="_blank" rel="noreferrer" className="text-sm text-gray-300 hover:text-white transition-colors">LeetCode</a>
              </li>
            )}
            {social.github && (
              <li>
                <a href={social.github} target="_blank" rel="noreferrer" className="text-sm text-gray-300 hover:text-white transition-colors">GitHub</a>
              </li>
            )}
            {social.linkedin && (
              <li>
                <a href={social.linkedin} target="_blank" rel="noreferrer" className="text-sm text-gray-300 hover:text-white transition-colors">LinkedIn</a>
              </li>
            )}
            {profile.resumeLink && (
              <li>
                <a
                  href={profile.resumeLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-white px-3 py-2 rounded-lg bg-gradient-to-br from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow ring-1 ring-white/20"
                >
                  <span>Resume</span>
                </a>
              </li>
            )}
          </ul>
        </nav>
      </div>

      <div className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(50%_50%_at_50%_0%,rgba(56,189,248,0.15),rgba(56,189,248,0)_60%)]" />
        <section className="max-w-7xl mx-auto px-6 py-14 md:py-20">
          <div className="grid md:grid-cols-12 gap-10 items-center">
            <div className="md:col-span-7">
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white">
                {profile.fullName}
              </h1>
              <p className="mt-3 text-cyan-400 text-lg font-medium">
                {profile.email}
              </p>
              <p className="mt-6 text-base md:text-lg text-gray-300 max-w-2xl">
                Innovative Backend Engineer with excellent problem-solving skills and a passion for continuous learning in a fast-paced setting. Seeking to tackle diverse design challenges and deliver high-impact, scalable solutions by leveraging strong CS fundamentals.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#projects" className="inline-flex items-center gap-2 text-sm font-semibold text-white px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 transition-colors">
                  View Projects
                </a>
                <a href="#skills" className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-300 px-4 py-2 rounded-lg ring-1 ring-cyan-500/40 hover:bg-cyan-500/10">
                  Explore Skills
                </a>
              </div>
            </div>
            <div className="md:col-span-5">
              <div className="relative w-36 h-36 md:w-44 md:h-44 mx-auto">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 blur-md opacity-60" />
                <img
                  src={profile.avatarUrl || 'https://api.dicebear.com/9.x/shapes/svg?seed=me'}
                  alt={profile.fullName}
                  className="relative rounded-2xl ring-1 ring-white/20 shadow-xl w-full h-full object-cover"
                />
              </div>

              <div className="mt-6 flex justify-center gap-4">
                {profile.linkedin && (
                  <a href={profile.linkedin} target="_blank" rel="noreferrer" className="text-gray-300 hover:text-white text-sm">
                    LinkedIn
                  </a>
                )}
                {profile.github && (
                  <a href={profile.github} target="_blank" rel="noreferrer" className="text-gray-300 hover:text-white text-sm">
                    GitHub
                  </a>
                )}
                {profile.email && (
                  <a href={`mailto:${profile.email}`} className="text-gray-300 hover:text-white text-sm">
                    Email
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </header>
  );
};

export default Header;
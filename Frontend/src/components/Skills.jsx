import React, { useState, useEffect } from 'react';
import { getTopSkills } from '../services/api';
import Spinner from './Spinner';

const Skills = ({ userId }) => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const fetchSkills = async () => {
      try {
        setLoading(true);
        // We'll fetch the "top skills" for the main display
        const response = await getTopSkills(userId);
        if (response.data && response.data.success) {
          setSkills(response.data.data || response.data.skills || []);
        } else {
          throw new Error('Failed to fetch skills');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, [userId]);

  if (loading) return <Spinner />;
  if (error) return <p className="text-center text-red-400">Error: {error}</p>;

  return (
    <section id="skills" className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center text-white mb-3">My Tech Stack</h2>
        <p className="text-center text-gray-400 mb-10">Tools and technologies I use regularly.</p>
        <div className="flex flex-wrap justify-center gap-3">
          {skills && skills.length > 0 ? (
            skills.map((skill, index) => (
              <span
                key={skill._id || index}
                className="inline-flex items-center rounded-full bg-cyan-500/10 text-cyan-300 ring-1 ring-inset ring-cyan-500/30 px-3 py-1.5 text-sm font-medium"
              >
                {typeof skill === 'string' ? skill : skill.name || skill}
              </span>
            ))
          ) : (
            <p className="text-gray-400">No skills available</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Skills;
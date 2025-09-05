import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Footer from './components/Footer';
import Spinner from './components/Spinner';

import { getProfile, getSkills } from './services/api';

function App() {
  const [profile, setProfile] = useState(null);
  const [allSkills, setAllSkills] = useState([]); // For filtering projects
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch initial data (profile and all skills for the filter)
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const profileResponse = await getProfile();

        if (profileResponse.data && profileResponse.data.success) {
          const fetchedProfile = profileResponse.data.data;
          setProfile(fetchedProfile);

          // Once we have the profile, we can get the userId to fetch skills
          try {
            const skillsResponse = await getSkills(fetchedProfile._id);
            
            if(skillsResponse.data && skillsResponse.data.success) {
              const skillsData = skillsResponse.data.data || skillsResponse.data.skills || {};
              
              // Extract and flatten skills from the categorized structure for project filtering
              let flattenedSkills = [];
              if (typeof skillsData === 'object' && skillsData !== null) {
                // Flatten all skill categories into a single array
                Object.values(skillsData).forEach(category => {
                  if (Array.isArray(category)) {
                    flattenedSkills.push(...category);
                  }
                });
              }
              
              setAllSkills(flattenedSkills);
            } else {
               console.warn('Could not fetch skills for project filtering:', skillsResponse);
               setAllSkills([]);
            }
          } catch (skillsError) {
            console.error('Error fetching skills:', skillsError);
            setAllSkills([]);
          }

        } else {
          throw new Error('Failed to fetch profile data.');
        }
      } catch (err) {
        console.error('Error loading data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <Spinner />
          <p className="text-white mt-4">Loading portfolio...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center text-white">
          <p className="text-red-500 text-xl mb-4">{error}</p>
          <p className="text-gray-400 mb-4">Please ensure your backend server is running and the API URL is correct.</p>
          <p className="text-sm text-gray-500">Backend URL: {import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api/v1'}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900">
      <Header profile={profile} />
      <main>
        <Skills userId={profile?._id} />
        <Projects allSkills={allSkills} />
      </main>
      <Footer />
    </div>
  );
}

export default App;
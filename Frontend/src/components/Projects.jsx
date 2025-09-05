import React, { useState, useEffect } from 'react';
import { getAllProjects, getProjectsBySkill } from '../services/api';
import Spinner from './Spinner';

// A single project card component
const ProjectCard = ({ project }) => (
    <div className="group relative rounded-2xl border border-white/10 bg-gray-900/60 hover:bg-gray-900/80 transition-colors overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(50%_50%_at_80%_0%,rgba(56,189,248,0.15),rgba(56,189,248,0)_60%)] opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="aspect-video w-full overflow-hidden">
            <img src={project.imageUrl || 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1200&auto=format&fit=crop'} alt={project.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        </div>
        <div className="p-6">
            <div className="flex items-start justify-between gap-4">
                <h3 className="text-lg font-semibold text-white">{project.title}</h3>
                <div className="flex gap-3">
                    {project.liveUrl && (
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 text-sm font-medium">Live</a>
                    )}
                    {project.github_repository && (
                        <a href={project.github_repository} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 text-sm font-medium">Code</a>
                    )}
                </div>
            </div>
            <p className="text-gray-400 mt-2">{project.description}</p>
            <div className="flex flex-wrap gap-2 mt-4">
                {project.skillsUsed && project.skillsUsed.map((skill, index) => (
                    <span key={index} className="inline-flex items-center rounded-full bg-cyan-500/10 text-cyan-300 ring-1 ring-inset ring-cyan-500/30 px-2.5 py-1 text-xs font-medium">
                        {skill}
                    </span>
                ))}
            </div>
        </div>
    </div>
);


const Projects = ({ allSkills }) => {
    const [projects, setProjects] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [selectedSkill, setSelectedSkill] = useState('All');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await getAllProjects();
                console.log('API Response:', response); // Debug log
                
                // Handle the corrected response structure
                let projectsData = [];
                if (response.data && response.data.success) {
                    // Backend now returns { success: true, data: { projects: [...] } }
                    projectsData = response.data.data?.projects || [];
                } else if (response.data && response.data.projects) {
                    // Fallback to direct projects array
                    projectsData = response.data.projects;
                } else if (Array.isArray(response.data)) {
                    // Direct array response
                    projectsData = response.data;
                }
                
                console.log('Extracted projects:', projectsData); // Debug log
                
                if (Array.isArray(projectsData)) {
                    setProjects(projectsData);
                    setFilteredProjects(projectsData);
                } else {
                    throw new Error('Invalid projects data format');
                }
            } catch (err) {
                console.error('Error fetching projects:', err);
                setError(err.message || 'Failed to fetch projects');
                setProjects([]);
                setFilteredProjects([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    useEffect(() => {
        if (selectedSkill === 'All') {
            setFilteredProjects(projects);
        } else {
            const filtered = projects.filter(p =>
                p.skillsUsed &&
                Array.isArray(p.skillsUsed) &&
                p.skillsUsed.some(skill =>
                    typeof skill === 'string' &&
                    skill.toLowerCase().includes(selectedSkill.toLowerCase())
                )
            );
            setFilteredProjects(filtered);
        }
    }, [selectedSkill, projects]);

    if (error) {
        return (
            <section id="projects" className="py-24">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-3xl font-bold text-center text-white mb-6">Projects</h2>
                    <div className="text-center text-red-400 bg-red-900/20 p-6 rounded-lg">
                        <p className="text-lg font-semibold mb-2">Error Loading Projects</p>
                        <p>{error}</p>
                        <button 
                            onClick={() => window.location.reload()} 
                            className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    // Ensure projects is initialized as an empty array
    const safeProjects = projects || [];
    const safeFilteredProjects = filteredProjects || [];

    return (
        <section id="projects" className="py-24">
            <div className="max-w-7xl mx-auto px-6">
                <h2 className="text-3xl md:text-4xl font-extrabold text-center text-white mb-3">
                    Projects
                </h2>
                <p className="text-center text-gray-400 mb-10">Things I’ve built and shipped recently.</p>
                <div className="flex justify-center flex-wrap gap-3 mb-12">
                    <button
                        onClick={() => setSelectedSkill('All')}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition ${selectedSkill === 'All' ? 'bg-cyan-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                    >
                        All
                    </button>
                    {Array.isArray(allSkills) && allSkills.length > 0 ? (
                        allSkills.map(skill => (
                            <button
                                key={skill._id || skill}
                                onClick={() => setSelectedSkill(typeof skill === 'string' ? skill : skill.name || skill)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition ${selectedSkill === (typeof skill === 'string' ? skill : skill.name || skill) ? 'bg-cyan-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                            >
                                {typeof skill === 'string' ? skill : skill.name || skill}
                            </button>
                        ))
                    ) : (
                        <p className="text-gray-400 text-sm">Loading skills...</p>
                    )}
                </div>

                {loading ? (
                    <Spinner />
                ) : safeFilteredProjects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {safeFilteredProjects.map((project) => (
                            <ProjectCard key={project._id || project.title} project={project} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-gray-400 bg-gray-900/60 ring-1 ring-inset ring-white/10 p-12 rounded-2xl">
                        <p className="text-lg font-semibold mb-2">No Projects Found</p>
                        <p>There are currently no projects to display. Check back later!</p>
                    </div>
                )}
            </div>
        </section>
    );
};


export default Projects;
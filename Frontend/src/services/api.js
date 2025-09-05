import axios from 'axios';

// Create an Axios instance with a base URL from environment variables
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL/api/v1
});

// Fetches the main profile data
export const getProfile = () => api.get('/profile/get-profile');

// Fetches all skills for a given user ID
export const getSkills = (userId) => api.get(`/skills/getSkills/${userId}`);

// Fetches top skills for a given user ID
export const getTopSkills = (userId) => api.get(`/skills/getTopSkills/${userId}`);

// Fetches all projects
export const getAllProjects = () => api.get('/projects/getAllProjects');

// Fetches projects filtered by a specific skill
export const getProjectsBySkill = (skill) => api.get(`/projects/getProjectBySkill`, { params: { skill } });

// Fetches all social/external links
export const getAllLinks = () => api.get('/links/getAllLinks');

// Health check for the API
export const getHealth = () => api.get('/health');

export default api;
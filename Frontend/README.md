# Portfolio Frontend

A React-based portfolio website that integrates with a Node.js/Express backend.

## Features

- **Profile Display**: Shows personal information, education, and bio
- **Skills Showcase**: Displays technical skills organized by category
- **Projects Gallery**: Portfolio of projects with filtering by skills
- **Responsive Design**: Built with Tailwind CSS for mobile-first design
- **API Integration**: Connects to backend REST API endpoints

## Backend Integration

The frontend connects to the following backend endpoints:

- **Profile**: `GET /api/v1/profile/get-profile`
- **Skills**: `GET /api/v1/skills/getSkills/:userId`
- **Top Skills**: `GET /api/v1/skills/getTopSkills/:userId`
- **Projects**: `GET /api/v1/projects/getAllProjects`
- **Links**: `GET /api/v1/links/getAllLinks`
- **Health**: `GET /api/v1/links/health`

## Environment Setup

Create a `.env` file in the frontend directory:

```env
VITE_API_BASE_URL=http://localhost:4000/api/v1
```

## Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Ensure the backend server is running on port 4000

## API Response Structure

The frontend expects the following response structure from the backend:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Success message",
  "data": { ... }
}
```

## Data Models

### Profile
- `fullName`: String
- `email`: String
- `education`: Array of education objects
- `skills`: Object with categorized skills
- `projects`: Array of project objects
- `links`: Array of social/external links

### Project
- `title`: String
- `description`: String
- `skillsUsed`: Array of skill strings
- `github_repository`: String (optional)

### Skills
- Organized by categories: languages, frontend, backend, databases, tools, coursework, soft_skills

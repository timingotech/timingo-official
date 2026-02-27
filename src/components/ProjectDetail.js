import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ExternalLink } from 'lucide-react';

// Minimal project data — keep in sync with Project.js
const projects = [
  { id: 'serenimind', title: 'SereniMind', website: 'https://serenimind.onrender.com', description: 'AI-powered mental health platform' },
  { id: 'vitaskr', title: 'Vitaskr', website: 'https://vitaskr-website.com', description: 'Corporate mental wellbeing & task management' },
  { id: 'agritos', title: 'Agritos', website: 'https://agritos-platform.com', description: 'Sustainable agriculture tech' }
];

const ProjectDetail = () => {
  const { id } = useParams();
  const project = projects.find(p => p.id === id);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Project not found</h2>
          <p className="mb-6">We couldn't find the project you're looking for.</p>
          <Link to="/projects" className="px-6 py-3 bg-blue-600 text-white rounded-lg">Back to Projects</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 p-8">
      <Helmet>
        <title>{project.title} - Timingotech | Project Details</title>
        <meta name="description" content={`Explore ${project.title}: ${project.description}. A successful project by Timingotech showcasing innovative technology solutions.`} />
        <meta name="keywords" content={`${project.title}, Timingotech project, ${project.description}`} />
        <link rel="canonical" href={`https://www.timingotech.com/projects/${project.id}`} />
      </Helmet>
      <div className="max-w-4xl mx-auto bg-white rounded-xl p-8 shadow-lg">
        <h1 className="text-3xl font-bold mb-4">{project.title}</h1>
        <p className="text-gray-700 mb-6">{project.description}</p>
        <a href={project.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-blue-600 font-semibold">
          Visit Project <ExternalLink className="w-4 h-4" />
        </a>
        <div className="mt-6">
          <Link to="/projects" className="text-sm text-gray-500">← Back to all projects</Link>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;

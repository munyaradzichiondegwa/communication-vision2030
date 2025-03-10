import React, { useState, useEffect } from 'react';
import { 
    Check, 
    X, 
    Edit, 
    Plus, 
    Filter 
} from 'lucide-react';

function ProjectManagement() {
    const [projects, setProjects] = useState([]);
    const [filters, setFilters] = useState({
        sector: '',
        status: ''
    });
    const [newProject, setNewProject] = useState({
        title: '',
        sector: '',
        description: '',
        budget: 0
    });

    useEffect(() => {
        async function fetchProjects() {
            try {
                const queryString = new URLSearchParams(filters).toString();
                const response = await fetch(`/api/projects?${queryString}`);
                const data = await response.json();
                setProjects(data);
            } catch (error) {
                console.error('Failed to fetch projects', error);
            }
        }

        fetchProjects();
    }, [filters]);

    const handleCreateProject = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/projects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newProject)
            });
            const createdProject = await response.json();
            setProjects([...projects, createdProject]);
            // Reset form
            setNewProject({
                title: '',
                sector: '',
                description: '',
                budget: 0
            });
        } catch (error) {
            console.error('Failed to create project', error);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Project Management</h2>
                <div className="flex items-center space-x-2">
                    <select 
                        value={filters.sector}
                        onChange={(e) => setFilters({
                            ...filters, 
                            sector: e.target.value
                        })}
                        className="p-2 border rounded"
                    >
                        <option value="">All Sectors</option>
                        <option value="infrastructure">Infrastructure</option>
                        <option value="agriculture">Agriculture</option>
                        <option value="technology">Technology</option>
                    </select>
                    <select 
                        value={filters.status}
                        onChange={(e) => setFilters({
                            ...filters, 
                            status: e.target.value
                        })}
                        className="p-2 border rounded"
                    >
                        <option value="">All Statuses</option>
                        <option value="planning">Planning</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                {/* Project List */}
                <div>
                    <h3 className="text-xl font-semibold mb-4">
                        Current Projects
                    </h3>
                    <div className="space-y-4">
                        {projects.map(project => (
                            <div 
                                key={project._id} 
                                className="border p-4 rounded-lg"
                            >
                                <div className="flex justify-between items-center">
                                    <h4 className="font-bold">{project.title}</h4>
                                    <span 
                                        className={`
                                            px-2 py-1 rounded text-xs 
                                            ${project.status === 'completed' 
                                                ? 'bg-green-200 text-green-800' 
                                                : 'bg-yellow-200 text-yellow-800'
                                            }
                                        `}
                                    >
                                        {project.status}
                                    </span>
                                </div>
                                <p className="text-gray-600 mt-2">
                                    {project.description}
                                </p>
                                <div className="mt-4 flex justify-between items-center">
                                    <span className="font-semibold">
                                        Budget: ${project.budget.toLocaleString()}
                                    </span>
                                    <div className="space-x-2">
                                        <button 
                                            className="text-blue-500 hover:bg-blue-100 p-1 rounded"
                                            title="Edit Project"
                                        >
                                            <Edit size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Create Project Form */}
                <div>
                    <h3 className="text-xl font-semibold mb-4">
                        Create New Project
                    </h3>
                    <form 
                        onSubmit={handleCreateProject}
                        className="space-y-4"
                    >
                        <input
                            type="text"
                            placeholder="Project Title"
                            value={newProject.title}
                            onChange={(e) => setNewProject({
                                ...newProject, 
                                title: e.target.value
                            })}
                            className="w-full p-2 border rounded"
                            required
                        />
                        <select
                            value={newProject.sector}
                            onChange={(e) => setNewProject({
                                ...newProject, 
                                sector: e.target.value
                            })}
                            className="w-full p-2 border rounded"
                            required
                        >
                            <option value="">Select Sector</option>
                            <option value="infrastructure">Infrastructure</option>
                            <option value="agriculture">Agriculture</option>
                            <option value="technology">Technology</option>
                        </select>
                        <textarea
                            placeholder="Project Description"
                            value={newProject.description}
                            onChange={(e) => setNewProject({
                                ...newProject, 
                                description: e.target.value
                            })}
                            className="w-full p-2 border rounded"
                            rows="4"
                            required
                        />
                        <input
                            type="number"
                            placeholder="Budget"
                            value={newProject.budget}
                            onChange={(e) => setNewProject({
                                ...newProject, 
                                budget: parseFloat(e.target.value)
                            })}
                            className="w-full p-2 border rounded"
                            required
                        />
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                        >
                            Create Project
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ProjectManagement;
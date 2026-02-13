import { useState, useEffect } from 'react';
import * as web3 from './web3Service';

function ClientDashboard({ onRewardUpdate }) {
  const [myProjects, setMyProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form state
  const [projectTitle, setProjectTitle] = useState('');
  const [projectPrice, setProjectPrice] = useState('');

  // Load my projects on mount
  useEffect(() => {
    loadMyProjects();
  }, []);

  const loadMyProjects = async () => {
    try {
      setIsLoading(true);
      const projects = await web3.getMyClientProjects();
      setMyProjects(projects);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Create Project Handler
  const handleCreateProject = async (e) => {
    e.preventDefault();
    
    if (!projectTitle || !projectPrice) {
      alert('Please fill in all fields');
      return;
    }

    if (parseFloat(projectPrice) <= 0) {
      alert('Price must be greater than 0');
      return;
    }

    try {
      setIsLoading(true);
      await web3.createProject(projectTitle, projectPrice);
      
      alert('Project created successfully!');
      
      // Clear form
      setProjectTitle('');
      setProjectPrice('');
      
      // Reload projects
      await loadMyProjects();
      
    } catch (error) {
      alert('Error creating project: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Complete Project Handler
  const handleCompleteProject = async (projectId, price) => {
    const confirmed = window.confirm(
      `Complete this project and pay ${price} ETH to the freelancer?\n\nYou will also earn reward tokens!`
    );
    
    if (!confirmed) return;

    try {
      setIsLoading(true);
      await web3.completeProject(projectId, price);
      
      alert('Project completed! Payment sent and rewards earned! 🎉');
      
      // Reload projects and rewards
      await loadMyProjects();
      if (onRewardUpdate) onRewardUpdate();
      
    } catch (error) {
      alert('Error completing project: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <h2>📋 Client Dashboard</h2>

      {/* Section 1: Create Project */}
      <section className="dashboard-section">
        <h3>Create New Project</h3>
        <form onSubmit={handleCreateProject} className="project-form">
          <div className="form-group">
            <label>Project Title:</label>
            <input
              type="text"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              placeholder="e.g., Build a React Website"
              disabled={isLoading}
            />
          </div>
          
          <div className="form-group">
            <label>Price (ETH):</label>
            <input
              type="number"
              step="0.01"
              value={projectPrice}
              onChange={(e) => setProjectPrice(e.target.value)}
              placeholder="e.g., 0.5"
              disabled={isLoading}
            />
          </div>
          
          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create Project'}
          </button>
        </form>
      </section>

      {/* Section 2: My Projects History */}
      <section className="dashboard-section">
        <h3>My Project History</h3>
        
        <button onClick={loadMyProjects} className="btn-refresh" disabled={isLoading}>
          {isLoading ? 'Loading...' : '🔄 Refresh'}
        </button>

        {myProjects.length === 0 ? (
          <p className="empty-message">No projects yet. Create one above!</p>
        ) : (
          <div className="projects-list">
            {myProjects.map((project) => (
              <div key={project.id} className="project-card">
                <div className="project-header">
                  <h4>{project.title}</h4>
                  <span className={`status-badge ${getStatusClass(project)}`}>
                    {getStatusText(project)}
                  </span>
                </div>
                
                <div className="project-details">
                  <p><strong>Price:</strong> {project.price} ETH</p>
                  <p><strong>Project ID:</strong> #{project.id}</p>
                  
                  {project.isAssigned && (
                    <p>
                      <strong>Freelancer:</strong>{' '}
                      {project.freelancer.slice(0, 6)}...{project.freelancer.slice(-4)}
                    </p>
                  )}
                </div>

                {project.isAssigned && !project.isCompleted && (
                  <button
                    onClick={() => handleCompleteProject(project.id, project.price)}
                    className="btn-complete"
                    disabled={isLoading}
                  >
                    ✅ Mark as Completed & Pay
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

// Helper functions
function getStatusText(project) {
  if (project.isCompleted) return 'Completed';
  if (project.isAssigned) return 'Assigned';
  return 'Pending';
}

function getStatusClass(project) {
  if (project.isCompleted) return 'completed';
  if (project.isAssigned) return 'assigned';
  return 'pending';
}

export default ClientDashboard;

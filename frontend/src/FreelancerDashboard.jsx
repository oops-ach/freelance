import { useState, useEffect } from 'react';
import * as web3 from './web3Service';

function FreelancerDashboard({ onRewardUpdate }) {
  const [availableJobs, setAvailableJobs] = useState([]);
  const [myActiveJobs, setMyActiveJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load jobs on mount
  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setIsLoading(true);
      
      // Load available jobs (not assigned, not created by me)
      const available = await web3.getAvailableProjects();
      setAvailableJobs(available);
      
      // Load my active jobs (accepted by me)
      const active = await web3.getMyFreelancerProjects();
      setMyActiveJobs(active);
      
    } catch (error) {
      console.error('Error loading jobs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Accept Project Handler
  const handleAcceptProject = async (projectId) => {
    const confirmed = window.confirm(
      'Accept this project? You will be assigned as the freelancer.'
    );
    
    if (!confirmed) return;

    try {
      setIsLoading(true);
      await web3.acceptProject(projectId);
      
      alert('Project accepted! Start working! 💼');
      
      // Reload jobs
      await loadJobs();
      
    } catch (error) {
      alert('Error accepting project: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <h2>💼 Freelancer Dashboard</h2>

      {/* Section 1: Available Jobs */}
      <section className="dashboard-section">
        <h3>Available Jobs</h3>
        
        <button onClick={loadJobs} className="btn-refresh" disabled={isLoading}>
          {isLoading ? 'Loading...' : '🔄 Refresh'}
        </button>

        {availableJobs.length === 0 ? (
          <p className="empty-message">
            No available jobs at the moment. Check back later!
          </p>
        ) : (
          <div className="projects-list">
            {availableJobs.map((job) => (
              <div key={job.id} className="project-card">
                <div className="project-header">
                  <h4>{job.title}</h4>
                  <span className="status-badge available">Available</span>
                </div>
                
                <div className="project-details">
                  <p><strong>Payment:</strong> {job.price} ETH</p>
                  <p><strong>Project ID:</strong> #{job.id}</p>
                  <p>
                    <strong>Client:</strong>{' '}
                    {job.client.slice(0, 6)}...{job.client.slice(-4)}
                  </p>
                </div>

                <button
                  onClick={() => handleAcceptProject(job.id)}
                  className="btn-apply"
                  disabled={isLoading}
                >
                  Apply for This Job
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Section 2: My Active Jobs */}
      <section className="dashboard-section">
        <h3>My Active Jobs</h3>

        {myActiveJobs.length === 0 ? (
          <p className="empty-message">
            You haven't accepted any jobs yet. Browse available jobs above!
          </p>
        ) : (
          <div className="projects-list">
            {myActiveJobs.map((job) => (
              <div key={job.id} className="project-card active-job">
                <div className="project-header">
                  <h4>{job.title}</h4>
                  <span className={`status-badge ${job.isCompleted ? 'completed' : 'in-progress'}`}>
                    {job.isCompleted ? 'Completed ✅' : 'In Progress 🔨'}
                  </span>
                </div>
                
                <div className="project-details">
                  <p><strong>Payment:</strong> {job.price} ETH</p>
                  <p><strong>Project ID:</strong> #{job.id}</p>
                  <p>
                    <strong>Client:</strong>{' '}
                    {job.client.slice(0, 6)}...{job.client.slice(-4)}
                  </p>
                </div>

                {!job.isCompleted && (
                  <div className="job-status-info">
                    <p className="info-text">
                      ⏳ Waiting for client to mark as completed and release payment
                    </p>
                  </div>
                )}
                
                {job.isCompleted && (
                  <div className="job-status-info success">
                    <p className="info-text">
                      🎉 Completed! You earned {job.price} ETH + reward tokens!
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default FreelancerDashboard;

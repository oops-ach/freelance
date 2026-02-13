import { useState } from 'react';
import * as web3 from './web3Service';
import ClientDashboard from './ClientDashboard';
import FreelancerDashboard from './FreelancerDashboard';
import './App.css';

function App() {
  const [account, setAccount] = useState(null);
  const [rewardBalance, setRewardBalance] = useState('0');
  const [viewMode, setViewMode] = useState('home'); // 'home', 'client', 'freelancer'
  const [isLoading, setIsLoading] = useState(false);

  // Connect Wallet Handler
  const handleConnectWallet = async () => {
    try {
      setIsLoading(true);
      const connectedAccount = await web3.connectWallet();
      setAccount(connectedAccount);
      
      // Fetch initial reward balance
      await handleRefreshReward();
      
      alert(`Connected: ${connectedAccount}`);
    } catch (error) {
      alert('Error connecting wallet: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh Reward Balance
  const handleRefreshReward = async () => {
    try {
      const balance = await web3.getRewardBalance();
      setRewardBalance(balance);
    } catch (error) {
      console.error('Error refreshing reward:', error);
    }
  };

  // Switch View Mode
  const switchToClient = () => setViewMode('client');
  const switchToFreelancer = () => setViewMode('freelancer');
  const switchToHome = () => setViewMode('home');

  return (
    <div className="App">
      {/* Navigation Bar */}
      <nav className="navbar">
        <h1 onClick={switchToHome} style={{ cursor: 'pointer' }}>
          🚀 FreelanceX
        </h1>
        
        <div className="nav-controls">
          {account && (
            <>
              <div className="reward-display">
                <span>💰 Rewards: {parseFloat(rewardBalance).toFixed(2)} FLX</span>
                <button onClick={handleRefreshReward} className="btn-small">
                  🔄
                </button>
              </div>
              
              <div className="mode-toggle">
                <button 
                  onClick={switchToClient}
                  className={viewMode === 'client' ? 'active' : ''}
                >
                  Client Mode
                </button>
                <button 
                  onClick={switchToFreelancer}
                  className={viewMode === 'freelancer' ? 'active' : ''}
                >
                  Freelancer Mode
                </button>
              </div>
            </>
          )}
          
          <button 
            onClick={handleConnectWallet} 
            className="btn-connect"
            disabled={isLoading}
          >
            {account 
              ? `${account.slice(0, 6)}...${account.slice(-4)}`
              : 'Connect Wallet'
            }
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        {viewMode === 'home' && (
          <div className="home-page">
            <h2>Welcome to FreelanceX</h2>
            <p className="subtitle">The Decentralized Job Market</p>
            <div className="home-info">
              <div className="info-card">
                <h3>🎯 For Clients</h3>
                <p>Post your projects and find talented freelancers</p>
              </div>
              <div className="info-card">
                <h3>💼 For Freelancers</h3>
                <p>Browse available jobs and earn crypto rewards</p>
              </div>
              <div className="info-card">
                <h3>🎁 Earn Rewards</h3>
                <p>Both parties earn FLX tokens when projects complete</p>
              </div>
            </div>
            
            {!account && (
              <div className="connect-prompt">
                <p>👆 Connect your wallet to get started</p>
              </div>
            )}
            
            {account && (
              <div className="mode-select">
                <button onClick={switchToClient} className="btn-mode">
                  I'm a Client 📋
                </button>
                <button onClick={switchToFreelancer} className="btn-mode">
                  I'm a Freelancer 💻
                </button>
              </div>
            )}
          </div>
        )}

        {viewMode === 'client' && account && (
          <ClientDashboard onRewardUpdate={handleRefreshReward} />
        )}

        {viewMode === 'freelancer' && account && (
          <FreelancerDashboard onRewardUpdate={handleRefreshReward} />
        )}

        {!account && viewMode !== 'home' && (
          <div className="connect-required">
            <p>Please connect your wallet first</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>FreelanceX © 2024 | Powered by Ethereum</p>
      </footer>
    </div>
  );
}

export default App;

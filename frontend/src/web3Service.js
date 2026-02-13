import { ethers } from 'ethers';

// Contract ABIs (simplified - you'll need to get these from compiled contracts)
const TOKEN_ABI = [
  "function balanceOf(address account) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)"
];

const MARKETPLACE_ABI = [
  "function createProject(string memory _title, uint256 _price) external",
  "function acceptProject(uint256 _projectId) external",
  "function completeProject(uint256 _projectId) external payable",
  "function getAllProjectIds() external view returns (uint256[] memory)",
  "function getProject(uint256 _projectId) external view returns (uint256 id, address client, address freelancer, string memory title, uint256 price, bool isAssigned, bool isCompleted)",
  "event ProjectCreated(uint256 indexed projectId, address indexed client, string title, uint256 price)",
  "event ProjectAccepted(uint256 indexed projectId, address indexed freelancer)",
  "event ProjectCompleted(uint256 indexed projectId, address indexed client, address indexed freelancer)"
];

// ===== CONFIGURATION =====
// Replace these with your deployed contract addresses
let TOKEN_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
let MARKETPLACE_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

// Global variables
let provider = null;
let signer = null;
let tokenContract = null;
let marketplaceContract = null;
let currentAccount = null;

/**
 * Initialize contract addresses (call this after deployment)
 */
export function setContractAddresses(tokenAddr, marketplaceAddr) {
  TOKEN_ADDRESS = tokenAddr;
  MARKETPLACE_ADDRESS = marketplaceAddr;
}

/**
 * Connect to MetaMask wallet
 */
export async function connectWallet() {
  try {
    if (!window.ethereum) {
      throw new Error("MetaMask is not installed!");
    }

    // Request account access
    const accounts = await window.ethereum.request({ 
      method: 'eth_requestAccounts' 
    });
    
    currentAccount = accounts[0];

    // Initialize provider and signer
    provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();

    // Initialize contracts
    tokenContract = new ethers.Contract(TOKEN_ADDRESS, TOKEN_ABI, signer);
    marketplaceContract = new ethers.Contract(MARKETPLACE_ADDRESS, MARKETPLACE_ABI, signer);

    console.log("Connected account:", currentAccount);
    return currentAccount;
    
  } catch (error) {
    console.error("Error connecting wallet:", error);
    throw error;
  }
}

/**
 * Get current connected account
 */
export function getCurrentAccount() {
  return currentAccount;
}

/**
 * Get reward token balance for current user
 */
export async function getRewardBalance() {
  try {
    if (!tokenContract || !currentAccount) {
      throw new Error("Wallet not connected");
    }

    const balance = await tokenContract.balanceOf(currentAccount);
    const decimals = await tokenContract.decimals();
    
    // Convert from wei to FLX tokens
    const formattedBalance = ethers.formatUnits(balance, decimals);
    return formattedBalance;
    
  } catch (error) {
    console.error("Error getting reward balance:", error);
    throw error;
  }
}

/**
 * Create a new project
 */
export async function createProject(title, priceInEth) {
  try {
    if (!marketplaceContract) {
      throw new Error("Wallet not connected");
    }

    // Convert ETH to wei
    const priceInWei = ethers.parseEther(priceInEth.toString());

    // Call smart contract
    const tx = await marketplaceContract.createProject(title, priceInWei);
    console.log("Transaction sent:", tx.hash);

    // Wait for confirmation
    const receipt = await tx.wait();
    console.log("Project created! Transaction confirmed:", receipt.hash);

    return receipt;
    
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
}

/**
 * Accept a project as freelancer
 */
export async function acceptProject(projectId) {
  try {
    if (!marketplaceContract) {
      throw new Error("Wallet not connected");
    }

    const tx = await marketplaceContract.acceptProject(projectId);
    console.log("Transaction sent:", tx.hash);

    const receipt = await tx.wait();
    console.log("Project accepted! Transaction confirmed:", receipt.hash);

    return receipt;
    
  } catch (error) {
    console.error("Error accepting project:", error);
    throw error;
  }
}

/**
 * Complete a project and pay freelancer
 */
export async function completeProject(projectId, priceInEth) {
  try {
    if (!marketplaceContract) {
      throw new Error("Wallet not connected");
    }

    // Convert ETH to wei
    const priceInWei = ethers.parseEther(priceInEth.toString());

    // Send payment with transaction
    const tx = await marketplaceContract.completeProject(projectId, {
      value: priceInWei
    });
    console.log("Transaction sent:", tx.hash);

    const receipt = await tx.wait();
    console.log("Project completed! Transaction confirmed:", receipt.hash);

    return receipt;
    
  } catch (error) {
    console.error("Error completing project:", error);
    throw error;
  }
}

/**
 * Get all projects from the marketplace
 */
export async function getAllProjects() {
  try {
    if (!marketplaceContract) {
      throw new Error("Wallet not connected");
    }

    // Get all project IDs
    const projectIds = await marketplaceContract.getAllProjectIds();

    // Fetch details for each project
    const projects = [];
    for (let id of projectIds) {
      const project = await marketplaceContract.getProject(id);
      
      projects.push({
        id: Number(project.id),
        client: project.client,
        freelancer: project.freelancer,
        title: project.title,
        price: ethers.formatEther(project.price),
        isAssigned: project.isAssigned,
        isCompleted: project.isCompleted
      });
    }

    return projects;
    
  } catch (error) {
    console.error("Error getting projects:", error);
    throw error;
  }
}

/**
 * Get projects created by current user (as client)
 */
export async function getMyClientProjects() {
  try {
    const allProjects = await getAllProjects();
    return allProjects.filter(p => 
      p.client.toLowerCase() === currentAccount.toLowerCase()
    );
  } catch (error) {
    console.error("Error getting client projects:", error);
    throw error;
  }
}

/**
 * Get available projects (not assigned, not created by me)
 */
export async function getAvailableProjects() {
  try {
    const allProjects = await getAllProjects();
    return allProjects.filter(p => 
      !p.isAssigned && 
      p.client.toLowerCase() !== currentAccount.toLowerCase()
    );
  } catch (error) {
    console.error("Error getting available projects:", error);
    throw error;
  }
}

/**
 * Get projects accepted by current user (as freelancer)
 */
export async function getMyFreelancerProjects() {
  try {
    const allProjects = await getAllProjects();
    return allProjects.filter(p => 
      p.freelancer.toLowerCase() === currentAccount.toLowerCase()
    );
  } catch (error) {
    console.error("Error getting freelancer projects:", error);
    throw error;
  }
}

/**
 * Listen for account changes
 */
export function onAccountsChanged(callback) {
  if (window.ethereum) {
    window.ethereum.on('accountsChanged', (accounts) => {
      currentAccount = accounts[0];
      callback(accounts[0]);
    });
  }
}

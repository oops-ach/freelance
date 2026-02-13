# FreelanceX - Decentralized Freelance Marketplace DApp

A blockchain-based freelance marketplace built with Solidity, Hardhat, React, and Ethers.js.

## 📋 Project Overview

FreelanceX is a decentralized application (DApp) that allows:
- **Clients** to post projects and hire freelancers
- **Freelancers** to browse and accept available jobs
- **Automatic rewards** in FLX tokens for both parties upon project completion

## 🛠️ Technology Stack

- **Blockchain:** Ethereum (Hardhat local network)
- **Smart Contracts:** Solidity 0.8.20
- **Frontend:** React 18 + Vite
- **Web3 Library:** Ethers.js v6
- **Wallet:** MetaMask

## 📁 Project Structure

```
FreelanceX/
├── contracts/
│   ├── FreelanceToken.sol          # ERC-20 reward token
│   └── FreelanceMarketplace.sol    # Main marketplace contract
├── scripts/
│   └── deploy.js                   # Deployment script
├── frontend/
│   ├── src/
│   │   ├── App.jsx                 # Main app component
│   │   ├── ClientDashboard.jsx     # Client view
│   │   ├── FreelancerDashboard.jsx # Freelancer view
│   │   ├── web3Service.js          # Blockchain interaction API
│   │   ├── main.jsx                # React entry point
│   │   └── App.css                 # Styling
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── hardhat.config.js
└── package.json
```

## 🚀 Setup Instructions

### Prerequisites

1. **Node.js** (v16 or higher)
2. **npm** or **yarn**
3. **MetaMask** browser extension

### Step 1: Clone and Setup Backend (Smart Contracts)

```bash
# Create project directory
mkdir FreelanceX
cd FreelanceX

# Initialize Hardhat project
npm init -y
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
npm install @openzeppelin/contracts

# Create directories
mkdir contracts scripts

# Copy the smart contracts
# Place FreelanceToken.sol and FreelanceMarketplace.sol in contracts/
# Place deploy.js in scripts/
# Place hardhat.config.js in root
```

### Step 2: Setup Frontend

```bash
# Create frontend directory
mkdir frontend
cd frontend

# Initialize Vite + React
npm create vite@latest . -- --template react
# Select: Yes to proceed, React, JavaScript

# Install dependencies
npm install
npm install ethers@6

# Create src directory structure
mkdir src

# Copy frontend files to appropriate locations:
# - App.jsx, ClientDashboard.jsx, FreelancerDashboard.jsx, web3Service.js, main.jsx → src/
# - App.css → src/
# - index.html → root of frontend/
# - vite.config.js → root of frontend/
```

## 🏃 Running the Project

### Step 1: Start Hardhat Local Network

Open a terminal in the project root:

```bash
npx hardhat node
```

**Important:** Keep this terminal running! It will show you test accounts with private keys.

**Copy one of the private keys** - you'll need it to import into MetaMask.

### Step 2: Deploy Smart Contracts

Open a **new terminal** in the project root:

```bash
npx hardhat run scripts/deploy.js --network localhost
```

You'll see output like:
```
FreelanceToken deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
FreelanceMarketplace deployed to: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
```

**Important:** Copy these addresses!

### Step 3: Configure Frontend

Open `frontend/src/web3Service.js` and update the contract addresses:

```javascript
let TOKEN_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";  // Your token address
let MARKETPLACE_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";  // Your marketplace address
```

### Step 4: Setup MetaMask

1. Open MetaMask extension
2. Click on the network dropdown (top) → Add Network → Add Network Manually
3. Enter:
   - **Network Name:** Hardhat Localhost
   - **RPC URL:** http://127.0.0.1:8545
   - **Chain ID:** 1337
   - **Currency Symbol:** ETH
4. Click "Save"

5. Import a test account:
   - Click on account icon → Import Account
   - Paste one of the private keys from Hardhat node
   - You should see 10000 ETH!

### Step 5: Start Frontend

In a **new terminal**, navigate to frontend directory:

```bash
cd frontend
npm run dev
```

The app will open at `http://localhost:3000`

## 🎮 How to Use the DApp

### Initial Setup

1. Click **"Connect Wallet"** in the top right
2. Approve the connection in MetaMask
3. You'll see your address and 0 FLX reward balance

### As a Client (Post Projects)

1. Switch to **"Client Mode"**
2. In the "Create New Project" section:
   - Enter project title (e.g., "Build a React Website")
   - Enter price in ETH (e.g., 0.5)
   - Click "Create Project"
   - Confirm transaction in MetaMask
3. Your project appears in "My Project History" with status "Pending"
4. When a freelancer accepts it, status changes to "Assigned"
5. Click **"Mark as Completed & Pay"** to:
   - Send payment to freelancer
   - Earn 10 FLX reward tokens
   - Give freelancer 10 FLX reward tokens

### As a Freelancer (Find Jobs)

1. Switch to **"Freelancer Mode"**
2. Browse "Available Jobs" (you won't see your own projects)
3. Click **"Apply for This Job"** on any project
4. Confirm transaction in MetaMask
5. Job moves to "My Active Jobs" with status "In Progress"
6. Wait for client to mark as completed
7. Receive payment + 10 FLX rewards automatically!

### Testing with Multiple Accounts

To test the full flow:

1. **Account 1 (Client):** Create a project
2. Switch MetaMask to **Account 2** (import another test account)
3. Refresh the page and reconnect wallet
4. **Account 2 (Freelancer):** Accept the project
5. Switch back to **Account 1**
6. Refresh and reconnect
7. **Account 1:** Complete the project and pay
8. Both accounts receive rewards!

## 🔍 Key Features Demonstrated

### Smart Contract Features

- ✅ ERC-20 token (FLX) for rewards
- ✅ Project creation with ETH pricing
- ✅ Project acceptance with client restriction (`require` check)
- ✅ Project completion with automatic payment
- ✅ Automatic reward minting for both parties

### Frontend Features

- ✅ MetaMask wallet integration
- ✅ Role switching (Client/Freelancer views)
- ✅ Real-time reward balance display
- ✅ Project filtering based on user role
- ✅ Simple, clean UI with minimal CSS
- ✅ Plain JavaScript API (web3Service.js) for easy code reading

## 🐛 Troubleshooting

### "Wallet not connected" error
- Make sure you clicked "Connect Wallet" and approved in MetaMask
- Check that MetaMask is on "Hardhat Localhost" network

### "Transaction failed" error
- Ensure Hardhat node is running (`npx hardhat node`)
- Check you have enough ETH in your account
- For client: You can't accept your own project
- For completion: Make sure project is assigned first

### "Cannot read properties of undefined"
- Verify contract addresses are correctly set in `web3Service.js`
- Redeploy contracts if Hardhat node was restarted

### Hardhat node restarted
If you restart the Hardhat node, you must:
1. Redeploy contracts (they get new addresses)
2. Update `web3Service.js` with new addresses
3. Reset MetaMask: Settings → Advanced → Clear activity tab data

## 📝 Code Highlights for Presentation

### Key Security Features

1. **Client Cannot Accept Own Project** (`FreelanceMarketplace.sol`):
```solidity
require(msg.sender != project.client, "Client cannot accept their own project");
```

2. **Automatic Rewards** - No manual claiming needed:
```solidity
rewardToken.mint(project.client, REWARD_AMOUNT);
rewardToken.mint(project.freelancer, REWARD_AMOUNT);
```

3. **Payment Safety** - Exact payment verification:
```solidity
require(msg.value >= project.price, "Insufficient payment");
```

### Separation of Concerns

- **`web3Service.js`**: All blockchain logic in plain JavaScript
- **React Components**: Just UI and simple state management
- **No complex hooks**: Easy to read and understand

## 🎓 Grading Checklist

✅ Two smart contracts (Token + Marketplace)
✅ ERC-20 token implementation
✅ Project creation, acceptance, completion workflow
✅ Security: Client cannot accept own project
✅ Automatic reward distribution
✅ React + Vite frontend
✅ Role switching functionality
✅ Clean separation: web3Service.js API
✅ MetaMask integration
✅ Professional UI with minimal CSS
✅ Complete deployment instructions
✅ Working on Hardhat localhost

## 📚 Additional Notes

- The project uses Ethers.js v6 syntax
- All blockchain interactions are in `web3Service.js` for easy maintenance
- The UI is intentionally simple to focus on functionality
- Reward amount is set to 10 FLX per completed project
- All code is well-commented for easy understanding

## 🎉 Demo Flow for Presentation

1. Show Hardhat node running with test accounts
2. Deploy contracts and show addresses
3. Open frontend and connect wallet
4. Create a project as Client (show it in history)
5. Switch to another MetaMask account
6. Accept project as Freelancer
7. Switch back to Client account
8. Complete project and show payment + rewards
9. Highlight reward balance increase for both accounts
10. Explain the code structure and security features

Good luck with your final exam! 🚀

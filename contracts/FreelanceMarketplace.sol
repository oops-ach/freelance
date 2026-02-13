// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./FreelanceToken.sol";

/**
 * @title FreelanceMarketplace
 * @dev Decentralized marketplace for freelance projects
 */
contract FreelanceMarketplace {
    
    FreelanceToken public rewardToken;
    uint256 public projectCounter;
    uint256 public constant REWARD_AMOUNT = 10 * 10**18; // 10 FLX tokens as reward
    
    struct Project {
        uint256 id;
        address client;
        address freelancer;
        string title;
        uint256 price; // Price in wei
        bool isAssigned;
        bool isCompleted;
    }
    
    // Mapping from project ID to Project
    mapping(uint256 => Project) public projects;
    
    // Events
    event ProjectCreated(uint256 indexed projectId, address indexed client, string title, uint256 price);
    event ProjectAccepted(uint256 indexed projectId, address indexed freelancer);
    event ProjectCompleted(uint256 indexed projectId, address indexed client, address indexed freelancer);
    
    constructor(address _rewardTokenAddress) {
        rewardToken = FreelanceToken(_rewardTokenAddress);
    }
    
    /**
     * @dev Create a new project
     * @param _title Project title/description
     * @param _price Project price in wei
     */
    function createProject(string memory _title, uint256 _price) external {
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(_price > 0, "Price must be greater than 0");
        
        projectCounter++;
        
        projects[projectCounter] = Project({
            id: projectCounter,
            client: msg.sender,
            freelancer: address(0),
            title: _title,
            price: _price,
            isAssigned: false,
            isCompleted: false
        });
        
        emit ProjectCreated(projectCounter, msg.sender, _title, _price);
    }
    
    /**
     * @dev Accept a project as a freelancer
     * @param _projectId ID of the project to accept
     */
    function acceptProject(uint256 _projectId) external {
        Project storage project = projects[_projectId];
        
        require(project.id != 0, "Project does not exist");
        require(!project.isAssigned, "Project already assigned");
        require(!project.isCompleted, "Project already completed");
        require(msg.sender != project.client, "Client cannot accept their own project");
        
        project.freelancer = msg.sender;
        project.isAssigned = true;
        
        emit ProjectAccepted(_projectId, msg.sender);
    }
    
    /**
     * @dev Complete a project and distribute rewards
     * @param _projectId ID of the project to complete
     */
    function completeProject(uint256 _projectId) external payable {
        Project storage project = projects[_projectId];
        
        require(project.id != 0, "Project does not exist");
        require(project.isAssigned, "Project not assigned yet");
        require(!project.isCompleted, "Project already completed");
        require(msg.sender == project.client, "Only client can mark as completed");
        require(msg.value >= project.price, "Insufficient payment");
        
        project.isCompleted = true;
        
        // Transfer payment to freelancer
        payable(project.freelancer).transfer(project.price);
        
        // Mint reward tokens to both client and freelancer
        rewardToken.mint(project.client, REWARD_AMOUNT);
        rewardToken.mint(project.freelancer, REWARD_AMOUNT);
        
        // Refund excess payment if any
        if (msg.value > project.price) {
            payable(msg.sender).transfer(msg.value - project.price);
        }
        
        emit ProjectCompleted(_projectId, project.client, project.freelancer);
    }
    
    /**
     * @dev Get all projects (for listing)
     * @return Array of all project IDs
     */
    function getAllProjectIds() external view returns (uint256[] memory) {
        uint256[] memory projectIds = new uint256[](projectCounter);
        for (uint256 i = 1; i <= projectCounter; i++) {
            projectIds[i - 1] = i;
        }
        return projectIds;
    }
    
    /**
     * @dev Get project details
     * @param _projectId 
     */
    function getProject(uint256 _projectId) external view returns (
        uint256 id,
        address client,
        address freelancer,
        string memory title,
        uint256 price,
        bool isAssigned,
        bool isCompleted
    ) {
        Project memory project = projects[_projectId];
        return (
            project.id,
            project.client,
            project.freelancer,
            project.title,
            project.price,
            project.isAssigned,
            project.isCompleted
        );
    }
}

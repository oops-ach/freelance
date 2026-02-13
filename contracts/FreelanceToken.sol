// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FreelanceToken
 * @dev Simple ERC-20 reward token for the FreelanceX marketplace
 * Symbol: FLX
 */
contract FreelanceToken is ERC20, Ownable {
    
    constructor() ERC20("FreelanceToken", "FLX") Ownable(msg.sender) {
        // Initial supply can be minted here if needed
        // _mint(msg.sender, 1000000 * 10 ** decimals());
    }
    
    /**
     * @dev Mint new tokens - only callable by owner (marketplace contract)
     * @param to Address to receive tokens
     * @param amount Amount of tokens to mint
     */
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}

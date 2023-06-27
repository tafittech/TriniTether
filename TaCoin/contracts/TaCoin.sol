//Trin Tether Token
// SPDX-License-Identifier: MIT
pragma solidity >=0.8.9 <0.8.21;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Capped.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Burnable.sol";

contract TriniTether is ERC20Capped, ERC20Burnable {
    address payable public owner;
    uint256 public blockReward;
    constructor(uint256 cap, uint256 reward) ERC20("TriniTether", "TTSC") ERC20Capped(cap* (10 ** decimal())) {
        owner = msg.sender;
        _mint(owner, 73524000000*(10 ** decimal()));
        blockReward = reward * (10 ** decimal());
    }


    function _mintMinerReward() internal {
        _mint(block.coinbase,blockReward);
    }

    function _beforeTokenTransfer(address from, address to, uint256 value) internal virtual override{
        if( from != address(0) && to != block.coinbase && block.coinbase != address(0)){
            _mintMinerReward();

        }
        super._beforeTokenTransfer(from,to,value);
    }

    function setBlockReward(uint256 reward) public onlyOwner {
        blockReward = reward * (10 ** decimal());

    }

    function destroy() public onlyOwner {
        selfdestruct(owner);
    }

    modifier onlyOwner{
        require(msg.sender == owner, "Only the Owner can call this function");
        _;
    }
}
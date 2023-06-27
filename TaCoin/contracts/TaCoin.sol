//Trin Tether Token
// SPDX-License-Identifier: MIT
pragma solidity >=0.8.9 <0.8.21;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TriniTether is ERC20 {
    constructor(uint initialSupply) ERC20("TriniTether", "TTSC") {
        _mint(msg.sender, initialSupply);
    }
}
// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DegaERC20 is ERC20, Ownable {
    uint8 _decimal;
    uint256 public maxSupply;

    constructor(
        string memory name_,
        string memory symbol_,
        uint8 decimal_,
        uint256 maxSupply_,
        address owner_
    ) ERC20(name_, symbol_) {
        _decimal = decimal_;
        maxSupply = maxSupply_;
        transferOwnership(owner_);
    }

    function decimals() public view virtual override returns (uint8) {
        return _decimal;
    }

    function mint(address account, uint256 amount) external onlyOwner {
        _mint(account, amount);
        require(totalSupply() <= maxSupply, "exceed max supply");
    }

    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }
}
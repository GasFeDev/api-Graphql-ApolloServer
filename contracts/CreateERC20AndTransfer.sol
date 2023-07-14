// SPDX-License-Identifier: GPL-3.0
import "./interfaces/IERC20.sol";

pragma solidity ^0.8.17;

contract CreateERC20AndTransfer is IERC20 {

    string public  name;
    string public  symbol;
    address public  recipent;
    uint8 public  decimals;
    mapping(address => uint256) balances;
    mapping(address => mapping (address => uint256)) allowed;

    uint256 totalSupply_;

    constructor(string memory name_, string memory symbol_,uint8 decimals_,uint256 total,address recipent_) {
      name = name_;
      symbol = symbol_;
      decimals= decimals_;
      recipent = recipent_;
      totalSupply_ = total;
      balances[msg.sender] = totalSupply_;
       emit Transfer(msg.sender, recipent, totalSupply_);
    }

    function totalSupply() public view returns (uint256) {
      return totalSupply_;
    }

    function balanceOf(address tokenOwner) public view returns (uint) {
        return balances[tokenOwner];
    }

    function transfer(address receiver, uint numTokens) public returns (bool) {
        require(numTokens <= balances[msg.sender]);
        balances[msg.sender] -= numTokens;
        balances[receiver] += numTokens;
        emit Transfer(msg.sender, receiver, numTokens);
        return true;
    }

    function approve(address delegate, uint numTokens) public returns (bool) {
        allowed[msg.sender][delegate] = numTokens;
        emit Approval(msg.sender, delegate, numTokens);
        return true;
    }

    function allowance(address owner, address delegate) public view returns (uint) {
        return allowed[owner][delegate];
    }

    function transferFrom(address owner, address buyer, uint numTokens) public returns (bool) {
        require(numTokens <= balances[owner]);
        require(numTokens <= allowed[owner][msg.sender]);

        balances[owner] -= numTokens;
        allowed[owner][msg.sender] -= numTokens;
        balances[buyer] += numTokens;
        emit Transfer(owner, buyer, numTokens);
        return true;
    }

    function mint(uint amount) external {
        balances[msg.sender] += amount;
        totalSupply_ += amount;
        emit Transfer(address(0), msg.sender, amount);
    }

    function burn(uint amount) external {
        balances[msg.sender] -= amount;
        totalSupply_ -= amount;
        emit Transfer(msg.sender, address(0), amount);
    }
}

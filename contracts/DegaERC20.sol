// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;


// See: https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol
// This is a HEAVILY feature-reduced/non-compliant ERC20 token. It should NOT be used in production, as it is missing major functionality and security checks.
contract FakeERC20 {
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);

    string public name;
    string public symbol;
    
    address public minter;
    uint256 public totalSupply = 0;

    mapping(uint256 => address) private _owners;
    mapping(address => uint256) private _balances;

    constructor(string memory name_, string memory symbol_,uint256 total) {
        minter = msg.sender;
        name = name_;
        symbol = symbol_;
        totalSupply = total;
    }

    function balanceOf(address owner) public view returns (uint256) {
        require(owner != address(0), "ERC20: balance query for the zero address");
        return _balances[owner];
    }

    function ownerOf(uint256 tokenId) public view returns (address) {
        address owner = _owners[tokenId];
        require(owner != address(0), "ERC20: owner query for nonexistent token");
        return owner;
    }

    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public {
        require(_isApprovedOrOwner(msg.sender, tokenId), "ERC20: transfer caller is not owner nor approved");
        _transfer(from, to, tokenId);
    }
    
    function mint(address to) public returns (uint256) {
        require(msg.sender == minter);
        uint256 tokenIdToMint = ++totalSupply;
        _mint(to, tokenIdToMint);
        return tokenIdToMint;
    }

    function _exists(uint256 tokenId) internal view returns (bool) {
        return _owners[tokenId] != address(0);
    }

    function _mint(address to, uint256 tokenId) internal {
        require(to != address(0), "ERC20: mint to the zero address");
        require(!_exists(tokenId), "ERC20: token already minted");

        _balances[to] += 1;
        _owners[tokenId] = to;

        emit Transfer(address(0), to, tokenId);
    }

    function _transfer(
        address from,
        address to,
        uint256 tokenId
    ) internal {
        require(ownerOf(tokenId) == from, "ERC20: transfer of token that is not own");
        require(to != address(0), "ERC20: transfer to the zero address");

        _balances[from] -= 1;
        _balances[to] += 1;
        _owners[tokenId] = to;

        emit Transfer(from, to, tokenId);
    }

    function _isApprovedOrOwner(address spender, uint256 tokenId) internal view returns (bool) {
        require(_exists(tokenId), "ERC20: operator query for nonexistent token");
        address owner = ownerOf(tokenId);
        return (spender == owner);
    }
}


contract DegaMinter {
    event DegaMinted(address sender, uint256 tokenId);
    uint256 constant COST_OF_ART = 0.005 ether;

    address payable public owner;
    FakeERC20 public fakeERC20;
    constructor() {
        owner = payable(msg.sender);
        fakeERC20 = new FakeERC20("Dega Test", "DTest",80000000000000000);
    }
    
    function mint() external payable {
        require(msg.value == COST_OF_ART);
        uint256 tokenId = fakeERC20.mint(msg.sender);
        emit DegaMinted(msg.sender, tokenId);
        owner.transfer(msg.value);
    }
}
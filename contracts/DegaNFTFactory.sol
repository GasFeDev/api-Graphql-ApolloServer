// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@opengsn/contracts/src/ERC2771Recipient.sol";

import "./DEGADynamicNFT.sol";
import "./DEGAImmutableNFT.sol";
import "./interfaces/IDEGABaseNFTFactory.sol";

import "./Utils/DEGAStructs.sol";

contract DegaNFTFactory is Ownable, ERC2771Recipient, DEGAStructs {
    enum NFTType {
        DegaBaseNFT,
        DegaDynamicNFT,
        DegaImmutableNFT
    }

    address public forwarder;
    address public api;
    uint256 public count = 0;
        
    /// @dev NFT Address => Bool
    mapping(address => bool) public exists;
    mapping(address => address[]) public collectionsByOwner;

    event ContractCreated(address creator, address nft);
    event FactoryUpdated(NFTType indexed nftType, address factory);

    modifier onlyAPI() {
        require(api == _msgSender(), "API: caller is not the api");

        _;
    }

    function setAPIAddress(address newAPI) external onlyOwner {
        require(newAPI != address(0), "invalid api");
        api = newAPI;
    }

    function setForwarder(address forwarder_) external onlyOwner {
        require(forwarder_ != address(0), "invalid forwarder");
        _setTrustedForwarder(forwarder_);
        forwarder = forwarder_;
    }

    function getForwarder() public view returns (address) {
        return forwarder;
    }

    function incrementCounter() public {
        count += 1;
    }

    function getCount() public view returns (uint256) {
        return count;
    }    

    function createNFTContract(
        string memory _name,
        string memory _symbol,
        string memory _contractURI,
        string memory _baseURI,
        bool _isOnchainMD,
        uint256 _maxSupply,
        address _owner,
        NFTType _nftType,
        string memory _dynamicSVG,
        Property[] memory _evolutionaryProperties,
        address _forwarder
    ) external returns (address nftAddr) {
        contractData memory data = contractData({
            _name: _name,
            _symbol: _symbol,
            _contractURI: _contractURI,
            _baseURI: _baseURI,
            _maxSupply: _maxSupply,
            _isImmutable: _nftType == NFTType.DegaImmutableNFT,
            _isMultisign: false,
            _isComposable: false,
            _isEvolutionary: false,
            _isDynamic: _nftType == NFTType.DegaDynamicNFT,
            _isMetadataOnChain: _isOnchainMD,
            _owner: _owner,
            _forwarder: _forwarder,
            _evolutionaryProperties: _evolutionaryProperties
        });

        if (_nftType == NFTType.DegaDynamicNFT) {
            DEGADynamicNFT dynamicNFT = new DEGADynamicNFT(data, _dynamicSVG);
            nftAddr = address(dynamicNFT);
        } else if (_nftType == NFTType.DegaImmutableNFT) {
            DEGAImmutableNFT immutableNFT = new DEGAImmutableNFT(data);
            nftAddr = address(immutableNFT);
        } else {
            DEGABaseNFT baseNFT = new DEGABaseNFT(data);
            nftAddr = address(baseNFT);
        }

        emit ContractCreated(msg.sender, nftAddr);
    }
    

    function _msgSender()
        internal
        view
        override(Context, ERC2771Recipient)
        returns (address)
    {
        return ERC2771Recipient._msgSender();
    }

    function _msgData()
        internal
        view
        override(Context, ERC2771Recipient)
        returns (bytes calldata)
    {
        return ERC2771Recipient._msgData();
    }
}
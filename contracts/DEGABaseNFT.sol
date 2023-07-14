// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@opengsn/contracts/src/ERC2771Recipient.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import {DEGAEvents} from "./Utils/DEGAEvents.sol";
import {DEGAErrors} from "./Utils/DEGAErrors.sol";
import {DEGAModifiers} from "./Utils/DEGAModifiers.sol";
import {DEGAStructs} from "./Utils/DEGAStructs.sol";

//Multisig - Composable - Evolutionary
contract DEGABaseNFT is ERC721, Ownable, ERC2771Recipient, DEGAEvents, DEGAModifiers, DEGAStructs {
    using Counters for Counters.Counter;
    using Strings for uint256;

    Counters.Counter private _tokenIdCounter;
    string public contractURI;
    string public description;
    string public baseURI;
    uint256 public maxSupply;

    bool isMetadataOnChain;

    // NFT Main Types (can be mixed)
    bool public isDynamic;
    bool public isImmutable;
    bool public isMultisign;
    bool public isComposable;
    bool public isEvolutionary;

    // Optional mapping for token URIs
    mapping(uint256 => string) public _tokenURIs;

    // Evolutionary Immutable data
    Property[] private evolutionaryProperties;

    // Composable NFT data

    // One address can equip multiple ERC20 & ERC721 at the same time
    // tokenID => composableData
    mapping(uint256 => Composable) public composableData;

    modifier existingTokenId(uint256 tokenId) {
        require(_exists(tokenId), "ERC721: non-existent token");
        _;
    }

    constructor(contractData memory data) ERC721(data._name, data._symbol) {
        maxSupply = data._maxSupply == 0 ? type(uint256).max : data._maxSupply;
        contractURI = data._contractURI;
        baseURI = data._baseURI;
        isImmutable = data._isImmutable;
        isMultisign = data._isMultisign;
        isComposable = data._isComposable;
        isEvolutionary = data._isEvolutionary;
        isDynamic = data._isDynamic;
        isMetadataOnChain = data._isMetadataOnChain;
        for (uint256 index = 0; index < data._evolutionaryProperties.length; index++) {
            evolutionaryProperties.push(
                Property(data._evolutionaryProperties[index].name, data._evolutionaryProperties[index].value)
            );
        }

        transferOwnership(data._owner);
        _setTrustedForwarder(data._forwarder);
    }

    /**
     * @notice  Function to mint a new NFT Item
     * @dev     Uses OZ Counters
     * @param   _to  Owner of the NFT Item
     * @return  uint256 minted Token ID
     */
    function createToken(address _to) public virtual returns (uint256) {
        _tokenIdCounter.increment();

        if (_tokenIdCounter.current() >= maxSupply) {
            revert ExceedCollectionMaxSupply(address(this), maxSupply, _tokenIdCounter.current());
        }

        _safeMint(_to, _tokenIdCounter.current());

        emit NFTItemMinted(_tokenIdCounter.current(), _to);
        return _tokenIdCounter.current();
    }

    function burn(uint256 tokenId) external {
        if (!_isApprovedOrOwner(_msgSender(), tokenId)) {
            revert CallerNotTheOwner();
        }
        super._burn(tokenId);
    }

    // Medatada

    /**
     * @notice  Function to set the Contract metadata URI
     * @dev     _uri parameter is almost always a json file URL
     * @param   _uri Contract metadata URL
     */
    function setContractURI(string memory _uri) external onlyOwner {
        contractURI = _uri;
    }

    /**
     * @notice  Function used to set a TokenURI
     * @dev     This implements checkMultisign modifier that checks is multisign is required, checks if token exists
     * @param   _tokenId  Token Id to set the metadata URI
     * @param   _tokenURI  Token Metadata URI
     * @param   _tokenOwnerSign  Sign of the token owner (needed for multisign collections)
     */
    function setTokenURI(uint256 _tokenId, string memory _tokenURI, bytes memory _tokenOwnerSign)
        external
        virtual
        onlyOwner
        checkMultisign(_tokenOwnerSign, isMultisign, _tokenId, ownerOf(_tokenId))
    {
        _setTokenURI(_tokenId, _tokenURI);
    }

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        return string(abi.encodePacked(_baseURI(), tokenId.toString()));
    }

    function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal virtual {
        _tokenURIs[tokenId] = _tokenURI;
    }
    // End Metadata

    // Composable NFT Functions
    function equipToken(address _tokenAddress, uint256 _destinationNFT, uint256 _tokenId, uint256 _amount) external {
        if (_amount > 0 && _tokenId > 0) {
            revert InvalidCallParameters();
        }

        if (ownerOf(_destinationNFT) != msg.sender) {
            revert CallerNotTheOwner();
        }

        if (_amount > 0) {
            if (IERC20(_tokenAddress).balanceOf(msg.sender) < _amount) {
                revert CallerDoNotHaveAmountToEquip();
            }

            composableData[_destinationNFT].erc20added++;
            composableData[_destinationNFT].isAddressERC20[_tokenAddress] = true;
            composableData[_destinationNFT].addressAmount[_tokenAddress] += _amount;
        }

        if (_tokenId > 0) {
            if (IERC721(_tokenAddress).ownerOf(_tokenId) != msg.sender) {
                revert CallerDoNotOwnTokenToEquip();
            }

            composableData[_destinationNFT].nftsAdded++;
            composableData[_destinationNFT].isAddressERC20[_tokenAddress] = false;
            composableData[_destinationNFT].addressItems[_tokenAddress].push(_tokenId);
        }
    }

    function unequipToken(address _tokenAddress, uint256 _destinationNFT, uint256 _tokenId, uint256 _amount) external {
        if (_amount > 0 && _tokenId > 0) {
            revert InvalidCallParameters();
        }

        if (_tokenId > 0) {
            composableData[_destinationNFT].nftsAdded--;
            delete composableData[_destinationNFT].addressItems[_tokenAddress][_tokenId];
        }

        if (_amount > 0) {
            uint256 amountAfterOperation = composableData[_destinationNFT].addressAmount[_tokenAddress] - _amount;

            if (amountAfterOperation < 0) revert CannotUnequipAmount();
            if (amountAfterOperation == 0) {
                composableData[_destinationNFT].erc20added--;
                delete composableData[_destinationNFT].addressAmount[_tokenAddress];
            } else {
                composableData[_destinationNFT].addressAmount[_tokenAddress] -= _amount;
            }
        }
    }

    function equippedAmountForToken(address _contractAddress, uint256 _tokenId) public view returns (uint256 amount) {
        return composableData[_tokenId].addressAmount[_contractAddress];
    }

    function equippedItemsForToken(address _contractAddress, uint256 _tokenId)
        public
        view
        returns (uint256[] memory items)
    {
        return composableData[_tokenId].addressItems[_contractAddress];
    }

    // End Composable NFT Functions

    // Evolutionary NFT Functions
    function getEvolutionaryProperties() public view returns (Property[] memory) {
        return evolutionaryProperties;
    }
    // End Evolutionary NFT Functions

    // Internal Functions

    function _msgSender() internal view override (Context, ERC2771Recipient) returns (address) {
        return ERC2771Recipient._msgSender();
    }

    function _msgData() internal view override (Context, ERC2771Recipient) returns (bytes calldata) {
        return ERC2771Recipient._msgData();
    }

    function setTrustedForwarder(address _forwarder) external onlyOwner {
        _setTrustedForwarder(_forwarder);
    }
    // End Internal Functions
}

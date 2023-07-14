// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import {LibString} from "./Utils/LibString.sol";
import {DEGABaseNFT} from "./DEGABaseNFT.sol";

//Multisig - Composable - Evolutionary
contract DEGAImmutableNFT is DEGABaseNFT {
    using Strings for uint256;
    using LibString for string;

    mapping(uint256 => Property[]) private properties;

    constructor(contractData memory data) DEGABaseNFT(data) {
        isDynamic = false;
        isImmutable = true;
        isEvolutionary = data._isEvolutionary;
        transferOwnership(data._owner);
        _setTrustedForwarder(data._forwarder);
    }

    function createToken(address _to, Property[] memory _properties, string memory _tokenURI)
        external
        returns (uint256)
    {
        uint256 tokenId = createToken(_to);

        for (uint256 index = 0; index < _properties.length; index++) {
            properties[tokenId].push(Property(_properties[index].name, _properties[index].value));
        }

        if (bytes(_tokenURI).length != 0) {
            _setTokenURI(tokenId, _tokenURI);
        }

        return tokenId;
    }

    function setTokenURI(uint256 _tokenId, string memory _tokenURI, bytes memory _tokenOwnerSign)
        external
        pure
        override
    {
        revert IsImmutableNFT();
    }
}

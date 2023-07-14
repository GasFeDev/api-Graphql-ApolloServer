// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import {LibString} from "./Utils/LibString.sol";
import {DEGABaseNFT} from "./DEGABaseNFT.sol";

//Multisig - Composable - Evolutionary
contract DEGADynamicNFT is DEGABaseNFT {
    using Strings for uint256;
    using LibString for string;

    string public dynamicSvg;

    mapping(uint256 => string) private svgStore;

    mapping(uint256 => Property[]) private properties;

    constructor(contractData memory data, string memory _dynamicSVG) DEGABaseNFT(data) {
        isDynamic = true;
        isImmutable = false;
        if (bytes(_dynamicSVG).length != 0) {
            dynamicSvg = _dynamicSVG;
        }
        transferOwnership(data._owner);
        _setTrustedForwarder(data._forwarder);
    }

    function createToken(address _to, Property[] memory _properties) external returns (uint256) {
        uint256 tokenId = createToken(_to);

        for (uint256 index = 0; index < _properties.length; index++) {
            properties[tokenId].push(Property(_properties[index].name, _properties[index].value));
        }

        return tokenId;
    }

    function setDynamicSvg(string memory _newSvg) external onlyOwner {
        dynamicSvg = _newSvg;
    }

    function generateSvg(uint256 tokenId) internal view returns (string memory) {
        bytes memory svgbytecount = bytes(dynamicSvg);
        if (svgbytecount.length == 0) {
            return getSVG(tokenId);
        }
        string memory svg = dynamicSvg.replace("{NAME}", name());
        svg = svg.replace("{TOKENID}", tokenId.toString());

        string memory property;
        if (properties[tokenId].length > 0) {
            property = '<text x="10" y="80" class="base">Properties</text>';
            for (uint256 i = 0; i < properties[tokenId].length; i++) {
                property = string(
                    abi.encodePacked(
                        property,
                        '<text x="10" y="',
                        (100 + 20 * i).toString(),
                        '" class="base">',
                        properties[tokenId][i].name,
                        ": ",
                        properties[tokenId][i].value,
                        "</text>"
                    )
                );
            }
        }
        svg = svg.replace("{PROPERTIES}", property);

        return string(abi.encodePacked("data:image/svg+xml;base64,", Base64.encode(bytes(svg))));
    }

    function setUniqueSVG(uint256 tokenId, string memory _uniqueSVG) external {
        svgStore[tokenId] = _uniqueSVG;
    }

    function getSVG(uint256 tokenId) internal view returns (string memory) {
        return string(abi.encodePacked("data:image/svg+xml;base64,", Base64.encode(bytes(svgStore[tokenId]))));
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        if (isMetadataOnChain == false) {
            return tokenURI(tokenId);
        }

        string memory property = "[";
        for (uint256 i = 0; i < properties[tokenId].length; i++) {
            property = string(
                abi.encodePacked(
                    property,
                    '{"trait_type":"',
                    properties[tokenId][i].name,
                    '", "value":"',
                    properties[tokenId][i].value,
                    '"}'
                )
            );
            if (i != properties[tokenId].length - 1) {
                property = string(abi.encodePacked(property, ","));
            }
        }
        property = string(abi.encodePacked(property, "]"));

        bytes memory dataURI = abi.encodePacked(
            '{"name": "',
            name(),
            " #",
            tokenId.toString(),
            '", "description": "',
            description,
            '", "attributes": ',
            property,
            ', "image": "',
            generateSvg(tokenId),
            '"}'
        );

        return string(abi.encodePacked("data:application/json;base64,", Base64.encode(dataURI)));
        
    }
}
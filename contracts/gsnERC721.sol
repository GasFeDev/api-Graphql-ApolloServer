// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@opengsn/contracts/src/ERC2771Recipient.sol";

contract gsnERC721 is ERC721, ERC721URIStorage, ERC721Burnable, Ownable, ERC2771Recipient {
    constructor(address forwarder) ERC721("DegaNFT", "DNFT") {
         _setTrustedForwarder(forwarder);
    }

    function _baseURI() internal pure override returns (string memory) {
        return "https://fiwork.mypinata.cloud/ipfs/QmRRHkswPmxTjpGcZZX2VGS8FMmQR2ix8YeYULP6QJq2YT/";
    }

    function safeMint(address to, uint256 tokenId, string memory uri)
        public
    {
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    // The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

 function _msgSender() internal view override(Context, ERC2771Recipient)
      returns (address sender) {
      sender = ERC2771Recipient._msgSender();
  }

  function _msgData() internal view override(Context, ERC2771Recipient)
      returns (bytes calldata) {
      return ERC2771Recipient._msgData();
  }
}
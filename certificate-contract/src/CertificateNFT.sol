// SPDX-License-Identifier: MIT
pragma solidity ^0.8.33;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
contract CertificateNFT is ERC721URIStorage {

    uint256 public tokenCounter;

    event CertificateMinted(address indexed student, uint256 tokenId, string tokenURI);

    constructor() ERC721("BootcampCertificate", "BCC") {
        tokenCounter = 0;
    }

    function mintCertificate(address student, string memory tokenURI) public {
        uint256 tokenId = tokenCounter;

        // Emit event for debugging
        emit CertificateMinted(student, tokenId, tokenURI);

        _safeMint(student, tokenId);
        _setTokenURI(tokenId, tokenURI);

        tokenCounter++;
    }
}
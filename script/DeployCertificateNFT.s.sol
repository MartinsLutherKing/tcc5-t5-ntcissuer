// SPDX-License-Identifier: MIT
pragma solidity ^0.8.33;

import "forge-std/Script.sol";
import {CertificateNFT} from "../certificate-contract/src/CertificateNFT.sol";
contract DeployCertificateNFT is Script {

    function run() external {

        vm.startBroadcast();

        new CertificateNFT();

        vm.stopBroadcast();
    }
}
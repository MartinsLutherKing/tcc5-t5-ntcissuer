import { ethers } from "ethers";
import CertificateABI from "../certificate-contract/out/CertificateNFT.sol/CertificateNFT.json";

export const getCertificateContract = async () => {
    if (typeof window === "undefined") {
        throw new Error("Must be used in browser");
    }

    if (!window.ethereum) {
        throw new Error("MetaMask is not installed");
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const contractAddress = process.env.NEXT_PUBLIC_CERTIFICATE_ADDRESS;
    console.log("process.env:", process.env);
    console.log("Contract address from env:", contractAddress);

   if (!contractAddress || contractAddress === "0x0000000000000000000000000000000000000000") {
  throw new Error("Invalid contract address");
}
    if (!ethers.isAddress(contractAddress)) {
        throw new Error(`Invalid contract address: ${contractAddress}`);
    }

    const contract = new ethers.Contract(
        contractAddress,
        CertificateABI.abi,
        signer
    );

    console.log("Contract created:", contract);
    console.log("Contract target:", contract.target);

    return contract;
};
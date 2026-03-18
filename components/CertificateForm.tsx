"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { motion } from "framer-motion";
import { getCertificateContract } from "@/lib/contract";
import { ethers } from "ethers"; // ✅ added
import { useRouter } from "next/navigation";

type FormData = {
  studentName: string;
  walletAddress: string;
  courseName: string;
  completionDate: string;
  certificateId: string;
};

export default function CertificateForm() {
  const [formData, setFormData] = useState<FormData>({
    studentName: "",
    walletAddress: "",
    courseName: "",
    completionDate: "",
    certificateId: "",
  });

  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [imageURL, setImageURL] = useState<string | null>(null);

  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    console.log(imageURL);
    e.preventDefault();

    // ✅ Wallet validation
    if (!ethers.isAddress(formData.walletAddress)) {
      alert("❌ Invalid wallet address");
      return;
    }

    // ✅ Date validation (extra safety)
    if (!formData.completionDate) {
      alert("❌ Invalid date");
      return;
    }

    try {
      setLoading(true);

      // ✅ Create metadata
      // Use a local image from the public directory (e.g., file.svg)
      // Generate a beautified SVG certificate with color and style
      const svg = `
        <svg xmlns='http://www.w3.org/2000/svg' width='700' height='500'>
          <defs>
            <linearGradient id='bgGrad' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='0%' stop-color='#e0e7ff'/>
              <stop offset='100%' stop-color='#f0fdfa'/>
            </linearGradient>
          </defs>
          <rect x='10' y='10' width='680' height='480' rx='30' fill='url(#bgGrad)' stroke='#6366f1' stroke-width='8'/>
          <text x='50%' y='80' text-anchor='middle' font-size='36' font-family='serif' fill='#1e293b' font-weight='bold'>Certificate of Completion</text>
          <text x='50%' y='150' text-anchor='middle' font-size='28' font-family='serif' fill='#2563eb'>Awarded to</text>
          <text x='50%' y='200' text-anchor='middle' font-size='32' font-family='serif' fill='#0f172a' font-weight='bold'>${formData.studentName}</text>
          <text x='50%' y='250' text-anchor='middle' font-size='20' font-family='sans-serif' fill='#334155'>Wallet: ${formData.walletAddress}</text>
          <text x='50%' y='300' text-anchor='middle' font-size='22' font-family='serif' fill='#0ea5e9'>${formData.courseName || 'Course'}</text>
          <text x='50%' y='350' text-anchor='middle' font-size='18' font-family='sans-serif' fill='#64748b'>Date: ${formData.completionDate}</text>
          <text x='50%' y='400' text-anchor='middle' font-size='18' font-family='sans-serif' fill='#64748b'>Certificate ID: ${formData.certificateId}</text>
          <rect x='40' y='440' width='620' height='30' rx='10' fill='#6366f1' />
          <text x='50%' y='462' text-anchor='middle' font-size='16' font-family='sans-serif' fill='white'>NFT Certificate Issuer Bootcamp</text>
        </svg>
      `;
      const imageURL = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
      const metadata = {
        name: `${formData.studentName} Certificate`,
        description: `Certificate for ${formData.courseName}`,
        image: imageURL, // ✅ THIS ONE
        attributes: [
          { trait_type: "Student Name", value: formData.studentName },
          { trait_type: "Course", value: formData.courseName },
          { trait_type: "Completion Date", value: formData.completionDate },
          { trait_type: "Certificate ID", value: formData.certificateId },
        ],
      };
      // ✅ Token URI (temporary base64)
      const tokenURI =
        "data:application/json;base64," + btoa(JSON.stringify(metadata));

      // ✅ Connect contract
      const contract = await getCertificateContract();
      console.log("Contract address:", contract.target);
      console.log("Contract:", contract);

      // ✅ Mint NFT
      console.log("About to call mintCertificate with:", formData.walletAddress, tokenURI);
      const tx = await contract.mintCertificate(
        formData.walletAddress,
        tokenURI
      );
      console.log("Transaction object:", tx);
      console.log("Transaction to:", tx.to);

      await tx.wait();

      setTxHash(tx.hash);
      setSuccess(true);
      router.push(`/certificate?txHash=${tx.hash}&imageURL=${encodeURIComponent(imageURL || '')}&studentName=${encodeURIComponent(formData.studentName)}`);
      console.log("TX:", tx);
      console.log(formData);

    } catch (error: any) {
      console.error("FULL ERROR:", error);

      // ✅ Show real error message
      alert(
        error?.reason ||
        error?.message ||
        "❌ Transaction failed. Check console."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Issue NFT Certificate
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            name="studentName"
            placeholder="Student Name"
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />

          <input
            type="text"
            name="walletAddress"
            placeholder="Student Wallet Address"
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />

          <input
            type="text"
            name="courseName"
            placeholder="Course Name"
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />

          <input
            type="date"
            name="completionDate"
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />

          <input
            type="text"
            name="certificateId"
            placeholder="Certificate ID"
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold"
          >
            {loading ? "Minting..." : "Issue Certificate"}
          </motion.button>

        </form>
      </motion.div>
    </div>
  );
}
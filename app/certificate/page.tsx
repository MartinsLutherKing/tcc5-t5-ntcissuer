'use client';

import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';

export default function CertificatePage() {
    const searchParams = useSearchParams();
    const txHash = searchParams.get('txHash');
    const imageURL = searchParams.get('imageURL');
    const studentName = searchParams.get('studentName');

    if (!imageURL) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>No certificate found.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-4xl w-full bg-white rounded-lg shadow-lg p-8 text-center"
            >
                <h1 className="text-3xl font-bold text-gray-800 mb-6">
                    🎉 Certificate Minted Successfully!
                </h1>

                <div className="mb-6 relative">
                    <motion.img
                        src={imageURL}
                        alt="Certificate"
                        className="w-full h-auto rounded-lg shadow-md"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                    />
                </div>

                {txHash && (
                    <a
                        href={`https://sepolia.etherscan.io/tx/${txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        View Transaction on Etherscan →
                    </a>
                )}
            </motion.div>
        </div>
    );
}
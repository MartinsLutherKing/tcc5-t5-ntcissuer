import Navbar from "@/components/Navbar";
import WalletConnect from "@/components/WalletConnect";
import CertificateForm from "@/components/CertificateForm";

export default function Home() {
  console.log("Page loaded, env var:", process.env.NEXT_PUBLIC_CERTIFICATE_ADDRESS);
  return (
    <>
      <Navbar />

      <div className="p-10">
        <WalletConnect />
      </div>


      <div className="p-10">
        <CertificateForm />
      </div>
    </>
  );
}
export default function Navbar() {
  return (
    <nav className="flex items-center justify-between p-6 bg-black text-white">
      
      {/* Logo / Project Name */}
      <h1 className="text-xl font-bold">
        NFT Certificate Issuer
      </h1>

      {/* Navigation Links */}
      <ul className="flex gap-6 text-lg">
        <li className="hover:text-blue-400 cursor-pointer">Home</li>
        <li className="hover:text-blue-400 cursor-pointer">Issue Certificate</li>
        <li className="hover:text-blue-400 cursor-pointer">Verify</li>
      </ul>

    </nav>
  );
}
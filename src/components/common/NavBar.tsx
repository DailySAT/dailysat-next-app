"use client"; // Indicates this is a client-side component
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import CookieConsent from "react-cookie-consent";

// Define the menu items for navigation
const menuItems = [
  { label: "Reading SAT", href: "/reading"},
  { label: "About", href: "/about" },
];

const NavBar = () => {
  const router = useRouter(); // Hook to navigate programmatically
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to track if the mobile menu is open

  // Toggles the mobile menu open/close state
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleGoToNewPage = (link: string) => {
    router.push(link)
  }

  return (
    <nav className="bg-white w-full border-b border-gray-200">
      {/* Container for the main navigation bar */}
      <div className="max-w-screen-xl mx-auto flex justify-between items-center p-4">
        {/* Logo Section */}
        <div onClick={() => handleGoToNewPage('/')} className="flex items-center cursor-pointer">
          <Image src="/logo/dailysat.png" width={50} height={50} alt="Logo" />
          <span className="text-2xl font-semibold ml-2">DailySAT</span>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden p-2 text-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
          aria-expanded={isMenuOpen}
        >
          <span className="sr-only">Open main menu</span>
          {isMenuOpen ? (
            // Close Icon when menu is open
            <svg
              className="w-6 h-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            // Hamburger Icon when menu is closed
            <svg
              className="w-6 h-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>

        {/* Menu Items for Desktop View */}
        <div className="hidden md:flex md:space-x-8">
          {menuItems.map((item, index) => (
            <div
              key={index}
              onClick={() => handleGoToNewPage(item.href)}
              className="py-2 px-4 text-gray-900 hover:text-blue-600 transition cursor-pointer"
            >
              {item.label}
            </div>
          ))}
        </div>

        {/* Contact Button for Desktop View */}
        <div className="hidden md:block">
          <button
            onClick={() => handleGoToNewPage("https://evq73w1t59w.typeform.com/to/S0yXIWtD")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Contact
          </button>
        </div>
      </div>

      {/* Mobile Menu Items with transition effect */}
      <div
        className={`md:hidden overflow-hidden transition-max-height duration-500 ease-in-out ${
          isMenuOpen ? "max-h-96" : "max-h-0"
        }`}
      >
        <ul className="space-y-2 p-4 bg-gray-100">
          {menuItems.map((item, index) => (
            <li key={index}>
              <div
                onClick={() => handleGoToNewPage(item.href)}
                className="block py-2 px-3 text-gray-900 hover:bg-gray-200 rounded-lg cursor-pointer"
              >
                {item.label}
              </div>
            </li>
          ))}
          <li>
            <button
              onClick={() => handleGoToNewPage("https://evq73w1t59w.typeform.com/to/S0yXIWtD")}
              className="w-full px-4 py-2 mt-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Contact
            </button>
          </li>
        </ul>
      </div>

      {/* Smart thing to do would be to add this directly to layout.tsx */}
      <CookieConsent
        location="bottom"
        buttonText="I Accept"
        cookieName="userData"
        style={{
          background: "#b5d4f9",
          borderRadius: "25px",
          color: "black",
          marginBottom: "5px",
          fontSize:"15px",
          textAlign:"center",
        }}
        buttonStyle={{ color: "#4e503b", fontSize: "15px", borderRadius:"25px", paddingLeft:"20px", paddingRight:"20px" }}
        expires={150}
      >
        <b>This website uses cookies to enhance the user experience.{" "}</b>
        <span style={{ fontSize: "10px" }}>We use these to make the website more enjoyable!</span>
      </CookieConsent>
    </nav>
  );
};

export default NavBar;

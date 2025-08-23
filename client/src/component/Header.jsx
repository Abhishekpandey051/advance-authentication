import React, { useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "#" },
    { name: "About", href: "#" },
    { name: "Services", href: "#" },
    { name: "Contact", href: "#" },
  ];

  return (
    <header className="bg-gray-900 text-white w-full shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo / Brand */}
        <div className="text-2xl font-bold text-white">Logo</div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-gray-300 hover:text-white transition"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Right section: Login Button always on the right */}
        <div className="flex items-center gap-2">
          {/* Desktop: Login */}
          <Link
            to="/auth"
            className="hidden md:inline-block px-5 py-2 bg-blue-700 text-white rounded transition hover:bg-blue-800"
          >
            Login
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-300 focus:outline-none"
            aria-label="Open menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <svg width="30" height="30" fill="none" viewBox="0 0 24 24">
              <path
                d="M4 6h16M4 12h16M4 18h16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Nav, includes Login button at the bottom */}
      {menuOpen && (
        <nav className="md:hidden bg-gray-900 px-4 pb-4 border-b border-gray-700">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-gray-300 hover:text-white transition"
                onClick={() => setMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
            {/* Mobile: Login shown in menu */}
            <Link
              to='/auth'
              className="px-5 py-2 bg-blue-700 text-white rounded transition hover:bg-blue-800"
              onClick={() => setMenuOpen(false)}
            >
              Login
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;

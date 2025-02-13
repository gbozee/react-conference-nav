'use client'
import { useState } from "react";
import { Menu } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Logo from '@/public/pycon2024.svg'
import ThemeToggle from "./ThemeToggle";
import LoginModal from "./auth/LoginModal";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  const navItems = [
    { name: "Home", path: "/" },
    {
      name: "About",
      path: "/about",
      hasDropdown: true,
      dropdownItems: [
        { name: "Our Story", path: "/about/story" },
        { name: "Team", path: "/about/team" },
        { name: "Mission", path: "/about/mission" },
      ],
    },
    {
      name: "Schedule",
      path: "/schedule",
      hasDropdown: true,
      dropdownItems: [
        { name: "Conference Day 1", path: "/schedule/day-1" },
        { name: "Conference Day 2", path: "/schedule/day-2" },
        { name: "Workshops", path: "/schedule/workshops" },
      ],
    },
    { name: "Tickets", path: "/tickets" },
    { name: "Contact", path: "/contact" },
  ];

  const toggleDropdown = (itemName: string) => {
    if (activeDropdown === itemName) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(itemName);
    }
  };

  // Close dropdown when clicking outside
  const closeDropdowns = () => {
    setActiveDropdown(null);
  };

  return (
    <>
      <nav className="px-4 py-4 w-full z-50">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="relative">
            <Image
              src={Logo}
              alt="PyCon 2024 Logo"
              className="w-[163px] h-[56px]"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <div key={item.name} className="relative group">
                <button
                  onClick={() => item.hasDropdown && toggleDropdown(item.name)}
                  className="font-bold text-[#003333] dark:text-white hover:text-green-700 dark:hover:text-green-400 transition-colors flex items-center gap-1"
                >
                  {item.name}
                  {item.hasDropdown && (
                    <svg
                      className={`w-3 h-3 transition-transform duration-200 ${
                        activeDropdown === item.name ? 'rotate-180' : ''
                      }`}
                      viewBox="0 0 12 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2.5 4.5L6 8L9.5 4.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
                
                {/* Dropdown Menu */}
                {item.hasDropdown && activeDropdown === item.name && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50">
                    {item.dropdownItems?.map((dropdownItem) => (
                      <Link
                        key={dropdownItem.name}
                        href={dropdownItem.path}
                        className="block px-4 py-2 text-sm text-[#003333] dark:text-white hover:bg-green-50 dark:hover:bg-gray-700 font-medium"
                        onClick={() => {
                          closeDropdowns();
                        }}
                      >
                        {dropdownItem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Auth Buttons and Theme Toggle */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="font-bold text-[#003333] dark:text-white hover:text-green-700 dark:hover:text-green-400 transition-colors"
            >
              Login
            </button>
            <Link
              href="/signup"
              className="font-bold bg-[#003333] text-white px-6 py-2 rounded-full hover:bg-green-800 transition-colors"
            >
              Sign up
            </Link>
          </div>

          {/* Mobile Menu Button and Theme Toggle */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button
              className="text-[#003333] dark:text-white"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              <Menu size={24} />
            </button>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <div className="absolute top-full left-0 right-0 bg-white/95 dark:bg-gray-900/95 md:hidden">
              <div className="flex flex-col space-y-4 px-4 py-6">
                {navItems.map((item) => (
                  <div key={item.name}>
                    <button
                      onClick={() => item.hasDropdown && toggleDropdown(item.name)}
                      className="font-bold text-[#003333] dark:text-white hover:text-green-700 dark:hover:text-green-400 transition-colors flex items-center gap-1 w-full"
                    >
                      {item.name}
                      {item.hasDropdown && (
                        <svg
                          className={`w-3 h-3 transition-transform duration-200 ${
                            activeDropdown === item.name ? 'rotate-180' : ''
                          }`}
                          viewBox="0 0 12 12"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M2.5 4.5L6 8L9.5 4.5"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </button>
                    
                    {/* Mobile Dropdown */}
                    {item.hasDropdown && activeDropdown === item.name && (
                      <div className="pl-4 mt-2 space-y-2">
                        {item.dropdownItems?.map((dropdownItem) => (
                          <Link
                            key={dropdownItem.name}
                            href={dropdownItem.path}
                            className="block text-[#003333] dark:text-white hover:text-green-700 dark:hover:text-green-400 text-sm font-medium"
                            onClick={() => {
                              closeDropdowns();
                              setIsOpen(false);
                            }}
                          >
                            {dropdownItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <Link
                  href="/login"
                  className="font-bold text-[#003333] dark:text-white hover:text-green-700 dark:hover:text-green-400 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="font-bold bg-[#003333] text-white px-6 py-2 rounded-full hover:bg-green-800 transition-colors inline-block text-center"
                  onClick={() => setIsOpen(false)}
                >
                  Sign up
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      <LoginModal 
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  );
};

export default Navbar;
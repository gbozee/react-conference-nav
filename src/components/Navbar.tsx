"use client";

import Logo from "@/public/pycon2024.svg";
import { Menu, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";
import LoginModal from "./auth/LoginModal";
import { logout } from "@/lib/actions/auth";
import { useRouter } from "next/navigation";

const SESSION_ID = process.env.APP_SESSION_ID_NAME || "my-custom-session";

interface NavbarProps {
  initialAuthState: boolean;
}

export default function Navbar({ initialAuthState }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(initialAuthState);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const result = await logout();
      if (result.success) {
        setIsAuthenticated(false);
        router.refresh();
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

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
                        activeDropdown === item.name ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  )}
                </button>

                {/* Dropdown menu */}
                {item.hasDropdown && activeDropdown === item.name && (
                  <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5">
                    <div
                      className="py-1"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="options-menu"
                    >
                      {item.dropdownItems?.map((dropdownItem) => (
                        <Link
                          key={dropdownItem.name}
                          href={dropdownItem.path}
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                          role="menuitem"
                          onClick={() => setActiveDropdown(null)}
                        >
                          {dropdownItem.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            <div className="flex items-center space-x-4">
              <ThemeToggle />
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="flex items-center gap-2 font-bold text-[#003333] dark:text-white hover:text-green-700 dark:hover:text-green-400 transition-colors"
                >
                  <LogOut size={20} />
                  {isLoggingOut ? 'Logging out...' : 'Logout'}
                </button>
              ) : (
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="font-bold text-[#003333] dark:text-white hover:text-green-700 dark:hover:text-green-400 transition-colors"
                >
                  Login
                </button>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-500 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-green-500"
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <div key={item.name}>
                  <button
                    onClick={() => item.hasDropdown && toggleDropdown(item.name)}
                    className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    {item.name}
                  </button>
                  {item.hasDropdown && activeDropdown === item.name && (
                    <div className="pl-4">
                      {item.dropdownItems?.map((dropdownItem) => (
                        <Link
                          key={dropdownItem.name}
                          href={dropdownItem.path}
                          className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 hover:bg-gray-50 dark:hover:bg-gray-700"
                          onClick={() => {
                            setActiveDropdown(null);
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
              <div className="flex items-center justify-between px-3 py-2">
                <ThemeToggle />
                {isAuthenticated ? (
                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="flex items-center gap-2 font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-gray-400"
                  >
                    <LogOut size={20} />
                    {isLoggingOut ? 'Logging out...' : 'Logout'}
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setIsLoginModalOpen(true);
                      setIsOpen(false);
                    }}
                    className="font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-gray-400"
                  >
                    Login
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  );
}

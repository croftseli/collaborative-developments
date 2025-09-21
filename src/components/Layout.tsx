'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../contexts/AuthContext';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about' },
    { name: 'Collaborators', href: '/collaborators' },
    { name: 'Resources', href: '/resources' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <div className="min-h-screen bg-neutral-cream flex flex-col">
      <nav className="bg-primary-600 text-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center h-16 w-full">
            {/* Navigation items spread evenly */}
            <div className="flex flex-1 justify-evenly">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="hover:text-accent-gold transition-colors text-white font-medium text-center"
                >
                  {item.name}
                </Link>
              ))}
            </div>
            
            {/* Desktop Auth Section */}
            <div className="flex items-center space-x-4 ml-8">
              {user && (
                <>
                  <Link
                    href="/admin"
                    className="bg-white text-primary-600 px-4 py-2 rounded hover:bg-gray-100 transition-colors font-medium"
                  >
                    Admin
                  </Link>
                  <button
                    onClick={logout}
                    className="hover:text-accent-gold font-medium"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <div className="flex justify-between items-center h-16">
              <div className="text-xl font-bold">
                Collaborative Developments
              </div>
              
              {/* Mobile menu button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md hover:text-accent-gold hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {!isMenuOpen ? (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                ) : (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </button>
            </div>

            {/* Mobile menu */}
            {isMenuOpen && (
              <div className="px-2 pt-2 pb-3 space-y-1 bg-primary-700">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-white hover:text-accent-gold block px-3 py-2 rounded-md text-base font-medium transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                
                {/* Mobile Auth Section */}
                {user && (
                  <div className="border-t border-primary-500 pt-4 mt-4">
                    <Link
                      href="/admin"
                      className="text-white hover:text-accent-gold block px-3 py-2 rounded-md text-base font-medium transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                      className="text-white hover:text-accent-gold block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="flex-1">{children}</main>

      {/* People Image sitting on footer */}
      <div className="relative">
        <div className="hidden md:block absolute bottom-0 right-0 z-20">
          <Image 
            src="/people.png" 
            alt="Community of people holding hands" 
            width={224}
            height={224}
            className="opacity-80 h-48 lg:h-56 xl:h-64 w-auto"
            style={{ filter: 'brightness(0) saturate(100%) invert(37%) sepia(18%) saturate(1352%) hue-rotate(95deg) brightness(91%) contrast(89%)' }}
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-primary-600 text-white py-8 sm:py-12 mt-auto relative">
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {/* Company Logo */}
            <div className="sm:col-span-2 lg:col-span-1 flex justify-center sm:justify-start">
              <div className="w-36 h-36 rounded-full overflow-hidden bg-white">
                <Image 
                  src="/logo.jpg" 
                  alt="Collaborative Developments LLC Logo" 
                  width={144}
                  height={144}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4 font-inter">Quick Links</h4>
              <ul className="space-y-3 text-sm ">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <Link 
                      href={item.href} 
                      className="hover:text-accent-gold transition-colors duration-200 flex items-center"
                    >
                      <span className="font-inter mr-2">→</span>
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Contact Info */}
            <div>
              <h4 className="font-semibold mb-4 font-inter">Contact</h4>
              <address className="text-sm opacity-90 not-italic leading-relaxed font-inter">
                <div className="mb-3">
                  <div className="font-medium mb-1">Email:</div>
                  <a href="mailto:info@collaborative-developments.com" className="hover:text-accent-gold transition-colors">
                    info@collaborative-developments.com
                  </a>
                </div>
                <div className="mb-3">
                  <div className="font-medium mb-1">Phone:</div>
                  <a href="tel:+17344174550" className="hover:text-accent-gold transition-colors">
                    +1 (734) 417-4550
                  </a>
                </div>
              </address>
            </div>
            
            {/* Mission */}
            <div>
              <h4 className="font-semibold mb-4 font-inter">Our Mission</h4>
              <p className="text-sm opacity-90 leading-relaxed font-inter">
                Applying society-building principles to community development, food security, and job creation.
              </p>
            </div>
          </div>
          
          {/* Copyright Section */}
          <div className="border-t border-green-shadow mt-8 pt-6 text-center">
            <p className="text-sm opacity-75">
              © {new Date().getFullYear()} Collaborative Developments LLC. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
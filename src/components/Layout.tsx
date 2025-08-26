'use client';
import { useState } from 'react';
import Link from 'next/link';
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
      <nav className="bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 w-full">
            {/* All Navigation Items Spread Evenly */}
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="hover:text-accent-gold transition-colors text-white flex-1 text-center"
              >
                {item.name}
              </Link>
            ))}
            
            {/* Auth Section */}
            <div className="flex-1 flex justify-center">
              {user && (
                <div className="flex items-center space-x-4">
                  <Link
                    href="/admin"
                    className="bg-white text-primary-600 px-4 py-2 rounded hover:bg-gray-100 transition-colors font-medium"
                  >
                    Admin
                  </Link>
                  <button
                    onClick={logout}
                    className="hover:text-accent-gold"
                  >
                    Logout
                  </button>
                </div>
              )}
              {!user && (
                <Link
                  href="/login"
                  className="bg-white text-primary-600 px-4 py-2 rounded hover:bg-gray-100 transition-colors font-medium"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1">{children}</main>

      {/* Footer */}
        <div className="max-auto relative">
            <div className="top-0 flex right-4 justify-end">
                <img 
                    src="/people.png" 
                    alt="Community of people holding hands" 
                    className="opacity-80"
                    style={{ height: '200px', width: 'auto', filter: 'brightness(0) saturate(100%) invert(37%) sepia(18%) saturate(1352%) hue-rotate(95deg) brightness(91%) contrast(89%)' }}
                />
            </div>
        </div>
      <footer className="bg-primary-600 text-white py-12 mt-auto">
        {/* Community Silhouette Image */}
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold mb-4">Collaborative Developments LLC</h3>
              <p className="text-sm opacity-90">
                Foster community engagement, provide valuable resources, and facilitate collaboration.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <Link href={item.href} className="hover:text-accent-gold">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <address className="text-sm opacity-90 not-italic">
                5847 Sage River Court SW<br />
                Wyoming, MI 49418
              </address>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Mission</h4>
              <p className="text-sm opacity-90">
                Applying society-building principles to community development, food security, and jobs.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
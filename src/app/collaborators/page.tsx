'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { getCollaborators } from '../../lib/db';

interface DatabaseCollaborator {
  id: string;
  name: string;
  description: string;
  logo_url?: string;
  website_url?: string;
  featured: boolean;
}

interface Collaborator {
  id: string;
  name: string;
  description: string;
  logoUrl?: string;
  websiteUrl?: string;
  featured: boolean;
}

export default function CollaboratorsPage() {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCollaboratorsData();
  }, []);

  const loadCollaboratorsData = async () => {
    try {
      setLoading(true);
      const collaboratorsData = await getCollaborators();
      // Map database fields to component fields
      const mappedData = (collaboratorsData as DatabaseCollaborator[]).map(collab => ({
        ...collab,
        logoUrl: collab.logo_url,
        websiteUrl: collab.website_url
      }));
      setCollaborators(mappedData);
    } catch (error) {
      console.error('Error loading collaborators:', error);
      setCollaborators([]);
    } finally {
      setLoading(false);
    }
  };

  // Separate featured and regular collaborators
  const featuredCollaborators = collaborators.filter(collab => collab.featured);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-cream">
      {/* Header Section */}
      <section className="bg-primary-600 text-white py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl lg:text-5xl font-jost font-bold mb-6 text-neutral-cream">
              Our Collaborators
            </h1>
            <div className="max-w-3xl mx-auto">
              <p className="text-xl font-jost opacity-90">
                Building stronger communities through meaningful partnerships and collaborative relationships
                that advance our shared vision of sustainable development and social progress.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Collaborators Section */}
      {featuredCollaborators.length > 0 && (
        <section className="py-16 bg-neutral-cream">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-jost font-bold mb-4" style={{ color: '#785038' }}>
                Featured Partners
              </h2>
              <p className="text-lg font-jost text-gray-600 max-w-2xl mx-auto">
                Our key collaborative relationships that exemplify our commitment to community-driven development
              </p>
            </motion.div>

            <div className="space-y-20">
              {featuredCollaborators.map((collaborator, index) => (
                <motion.div
                  key={collaborator.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12"
                >
                  {/* Logo Container */}
                  <div className="flex-shrink-0">
                    <div
                      className="w-48 h-48 lg:w-56 lg:h-56 rounded-3xl flex items-center justify-center"
                      style={{ backgroundColor: '#F5F1E5', border: '3px solid #785038' }}
                    >
                      {collaborator.logoUrl ? (
                        <Image
                          src={collaborator.logoUrl}
                          alt={`${collaborator.name} logo`}
                          width={160}
                          height={160}
                          className="w-32 h-32 lg:w-40 lg:h-40 object-contain"
                        />
                      ) : (
                        <svg
                          className="w-20 h-20 lg:w-24 lg:h-24"
                          style={{ color: '#785038' }}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                          />
                        </svg>
                      )}
                    </div>
                  </div>

                  {/* Collaborator Information */}
                  <div className="flex-1 text-center lg:text-left">
                    <h3 className="text-2xl lg:text-3xl font-jost font-bold mb-4" style={{ color: '#785038' }}>
                      {collaborator.name}
                    </h3>
                    <p className="text-base lg:text-lg font-jost leading-relaxed mb-6 text-gray-700">
                      {collaborator.description}
                    </p>
                    {collaborator.websiteUrl && (
                      <a
                        href={collaborator.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-medium rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all duration-300 transform hover:scale-105 shadow-lg"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        Visit Website
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Collaborators Section */}
      <section className={`py-16 ${featuredCollaborators.length > 0 ? 'bg-gradient-to-b from-green-50 to-neutral-cream' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-jost font-bold mb-4" style={{ color: '#785038' }}>
              {featuredCollaborators.length > 0 ? 'All Partners' : 'Our Partners'}
            </h2>
            <p className="text-lg font-jost text-gray-600 max-w-2xl mx-auto">
              Organizations and individuals working together toward common goals of community empowerment and sustainable development
            </p>
          </motion.div>

          {collaborators.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="text-green-400 mb-4">
                <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-700 mb-2">No Collaborators Yet</h3>
              <p className="text-gray-500 mb-8">
                We&apos;re always looking for new partnerships. Check back soon for updates on our growing network of collaborators.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-medium rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Get In Touch
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {collaborators.map((collaborator, index) => (
                <motion.div
                  key={collaborator.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
                >
                  {/* Featured badge */}
                  {collaborator.featured && (
                    <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-center py-2 text-sm font-medium">
                      ⭐ Featured Partner
                    </div>
                  )}

                  {/* Card Content */}
                  <div className="p-6 text-center">
                    {/* Logo */}
                    <div className="mb-6">
                      {collaborator.logoUrl ? (
                        <div className="w-24 h-24 mx-auto mb-4">
                          <Image
                            src={collaborator.logoUrl}
                            alt={`${collaborator.name} logo`}
                            width={96}
                            height={96}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      ) : (
                        <div
                          className="w-24 h-24 mx-auto mb-4 rounded-2xl flex items-center justify-center"
                          style={{ backgroundColor: '#F5F1E5', border: '2px solid #785038' }}
                        >
                          <svg
                            className="w-10 h-10"
                            style={{ color: '#785038' }}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                            />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Name and Description */}
                    <h3 className="text-xl font-jost font-bold mb-3 group-hover:text-green-700 transition-colors" style={{ color: '#785038' }}>
                      {collaborator.name}
                    </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed text-sm font-jost">
                      {collaborator.description}
                    </p>

                    {/* Website Link */}
                    {collaborator.websiteUrl && (
                      <a
                        href={collaborator.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg text-sm"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        Visit Website
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-gradient-to-r from-green-50 to-green-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl font-jost font-bold mb-6" style={{ color: '#785038' }}>
              Interested in Collaboration?
            </h2>
            <div className="max-w-2xl mx-auto mb-8">
              <p className="text-lg font-jost text-gray-700">
                We believe in the power of unity and collective action. If your organization shares our vision
                for sustainable community development, we&apos;d love to explore partnership opportunities.
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white font-medium rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2v-6a2 2 0 012-2h2V3a2 2 0 012-2h4a2 2 0 012 2v5z" />
              </svg>
              Start a Conversation
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
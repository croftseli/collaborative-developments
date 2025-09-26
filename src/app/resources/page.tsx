'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { getResources } from '../../lib/db';

interface Resource {
  id: string;
  title: string;
  description: string;
  category: string;
  file_url?: string;
  external_url?: string;
  date: string;
}

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResourcesData();
  }, []);

  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredResources(resources);
    } else {
      setFilteredResources(resources.filter(resource => resource.category === selectedCategory));
    }
  }, [selectedCategory, resources]);

  const loadResourcesData = async () => {
    try {
      setLoading(true);
      const resourcesData = await getResources();
      setResources(resourcesData as Resource[]);
      setFilteredResources(resourcesData as Resource[]);
    } catch (error) {
      console.error('Error loading resources:', error);
      setResources([]);
      setFilteredResources([]);
    } finally {
      setLoading(false);
    }
  };

  // Get unique categories
  const categories = ['All', ...Array.from(new Set(resources.map(r => r.category)))];

  // Get category colors - using sky blue as primary accent
  const getCategoryColor = (category: string) => {
    const colors = {
      'Agricultural': 'from-green-500 to-green-600', // Green for agricultural
      'Community': 'from-sky-500 to-sky-600', // Sky blue for community
      'Framework': 'from-orange-500 to-orange-600', // Orange for framework
      'Construction': 'from-amber-500 to-amber-600', // Amber for construction
      'Training': 'from-purple-500 to-purple-600', // Purple for training
      'Investment': 'from-emerald-500 to-emerald-600', // Emerald for investment
    };
    return colors[category as keyof typeof colors] || 'from-gray-500 to-gray-600';
  };

  const getCategoryBorderColor = (category: string) => {
    const colors = {
      'Agricultural': 'border-green-500',
      'Community': 'border-sky-500',
      'Framework': 'border-orange-500',
      'Construction': 'border-amber-500',
      'Training': 'border-purple-500',
      'Investment': 'border-emerald-500',
    };
    return colors[category as keyof typeof colors] || 'border-gray-500';
  };

  const getCategoryTextColor = (category: string) => {
    const colors = {
      'Agricultural': 'text-green-700',
      'Community': 'text-sky-700',
      'Framework': 'text-orange-700',
      'Construction': 'text-amber-700',
      'Training': 'text-purple-700',
      'Investment': 'text-emerald-700',
    };
    return colors[category as keyof typeof colors] || 'text-gray-700';
  };

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
            <h1 className="text-4xl lg:text-5xl font-jost font-bold mb-6">Resource Library</h1>
            <div className="max-w-3xl mx-auto">
              <p className="text-xl opacity-90">
                Access documents, guides, and materials that support our community development initiatives
                and collaborative growth projects.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-jost font-bold mb-12"
            style={{
              fontWeight: 700,
              lineHeight: '100%',
              letterSpacing: '0%',
              verticalAlign: 'middle',
              color: '#785038'
            }}>
              Browse by Category
            </h2>
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
                    selectedCategory === category
                      ? 'bg-green-500 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-green-50 border border-gray-200'
                  }`}
                >
                  {category}
                  <span className="ml-2 text-sm opacity-75">
                    ({category === 'All' ? resources.length : resources.filter(r => r.category === category).length})
                  </span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Resources Grid */}
          {filteredResources.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="text-green-400 mb-4">
                <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-700 mb-2">No Resources Available</h3>
              <p className="text-gray-500">
                {selectedCategory === 'All'
                  ? 'Check back later for resources and materials.'
                  : `No resources found in the "${selectedCategory}" category.`
                }
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredResources.map((resource, index) => (
                <motion.div
                  key={resource.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col"
                  whileHover={{ y: -5 }}
                >
                  {/* Category Header */}
                  <div className={`h-2 bg-gradient-to-r ${getCategoryColor(resource.category)}`} />

                  {/* Card Content */}
                  <div className="p-6 flex flex-col flex-1">
                    {/* Category Badge */}
                    <div className="flex items-center justify-between mb-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border-2 ${getCategoryBorderColor(resource.category)} ${getCategoryTextColor(resource.category)} bg-white`}>
                        <div className={`w-2 h-2 rounded-full mr-2 bg-gradient-to-r ${getCategoryColor(resource.category)}`} />
                        {resource.category}
                      </span>
                      <div className="text-xs text-gray-500">
                        {new Date(resource.date).toLocaleDateString()}
                      </div>
                    </div>

                    {/* Title and Description */}
                    <Link href={`/resources/${resource.id}`}>
                      <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-green-700 transition-colors cursor-pointer hover:underline">
                        {resource.title}
                      </h3>
                    </Link>

                    <div className="flex-1">
                      <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">
                        {resource.description}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2 mt-auto">
                      {/* Primary View Details Button - Always full width */}
                      <Link
                        href={`/resources/${resource.id}`}
                        className="w-full inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-medium rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all duration-300 transform hover:scale-105 shadow-lg"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View Details
                      </Link>

                      {/* Secondary action buttons in a row */}
                      {(resource.file_url || resource.external_url) && (
                        <div className="flex gap-2">
                          {resource.file_url && (
                            <a
                              href={resource.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg text-sm"
                            >
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              Download
                            </a>
                          )}

                          {resource.external_url && (
                            <a
                              href={resource.external_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg text-sm"
                            >
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                              View Online
                            </a>
                          )}
                        </div>
                      )}
                    </div>
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
            <h2 className="text-3xl font-bold mb-6" style={{ color: '#785038' }}>
              Looking for Something Specific?
            </h2>
            <div className="max-w-2xl mx-auto mb-8">
              <p className="text-lg text-gray-700">
                Can&apos;t find the resource you need? We&apos;re continuously adding new materials to support
                our community development initiatives. Reach out to us for assistance.
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white hover:text-accent-gold font-medium rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Contact Us
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
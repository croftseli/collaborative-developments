'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { supabase } from '../../../lib/supabase';

interface Resource {
  id: string;
  title: string;
  description: string;
  category: string;
  file_url?: string;
  external_url?: string;
  date: string;
  created_at?: string;
}

export default function ResourceDetailPage() {
  const params = useParams();
  const [resource, setResource] = useState<Resource | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      loadResource(params.id as string);
    }
  }, [params.id]);

  const loadResource = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from('resources')
        .select('*')
        .eq('id', id)
        .single();

      if (supabaseError) {
        throw supabaseError;
      }

      if (!data) {
        setError('Resource not found');
        return;
      }

      setResource(data);
    } catch (err) {
      console.error('Error loading resource:', err);
      setError('Failed to load resource');
    } finally {
      setLoading(false);
    }
  };

  // Get category colors - using sky blue as primary accent
  const getCategoryColor = (category: string) => {
    const colors = {
      'Agricultural': 'from-green-500 to-green-600',
      'Community': 'from-sky-500 to-sky-600',
      'Framework': 'from-orange-500 to-orange-600',
      'Construction': 'from-amber-500 to-amber-600',
      'Training': 'from-purple-500 to-purple-600',
      'Investment': 'from-emerald-500 to-emerald-600',
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !resource) {
    return (
      <div className="min-h-screen bg-neutral-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {error || 'Resource not found'}
            </h1>
            <Link
              href="/resources"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              ← Back to Resources
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-cream">
      {/* Header */}
      <div className="bg-primary-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/resources"
            className="inline-flex items-center text-white hover:text-accent-gold transition-colors mb-6"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Resources
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-4 mb-4">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border-2 ${getCategoryBorderColor(resource.category)} ${getCategoryTextColor(resource.category)} bg-white`}>
                <div className={`w-2 h-2 rounded-full mr-2 bg-gradient-to-r ${getCategoryColor(resource.category)}`} />
                {resource.category}
              </span>
              <div className="text-sm opacity-75">
                {new Date(resource.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold mb-4">
              {resource.title}
            </h1>
          </motion.div>
        </div>
      </div>

      {/* Resource Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          {/* Category Header */}
          <div className={`h-3 bg-gradient-to-r ${getCategoryColor(resource.category)}`} />

          {/* Resource Body */}
          <div className="p-8 lg:p-12">
            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#785038' }}>Description</h2>
              <div
                className="prose prose-lg max-w-none"
                style={{
                  color: '#333333',
                  lineHeight: '1.7'
                }}
              >
                {resource.description.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mb-8">
              {resource.file_url && (<h2 className="text-2xl font-bold mb-4" style={{ color: '#785038' }}>Access Resource</h2>)}
              <div className="flex flex-col sm:flex-row gap-4">
                {resource.file_url && (
                  <a
                    href={resource.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download Resource
                  </a>
                )}

                {resource.external_url && (
                  <a
                    href={resource.external_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    View Online
                  </a>
                )}
              </div>
            </div>

            {/* Resource Info */}
            <div className="pt-8 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Category</h3>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border-2 ${getCategoryBorderColor(resource.category)} ${getCategoryTextColor(resource.category)} bg-white`}>
                    <div className={`w-2 h-2 rounded-full mr-2 bg-gradient-to-r ${getCategoryColor(resource.category)}`} />
                    {resource.category}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Published</h3>
                  <p className="text-gray-700">
                    {new Date(resource.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="mt-8 flex justify-center">
              <Link
                href="/resources"
                className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Resources
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
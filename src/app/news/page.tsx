'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { getNews } from '../../lib/db';

interface NewsItem {
  id: string;
  title: string;
  content: string;
  published: boolean;
  author: string;
  featured_image?: string;
  date: string;
  created_at?: string;
}

export default function NewsPage() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNewsData();
  }, []);

  const loadNewsData = async () => {
    try {
      setLoading(true);
      const publishedNews = await getNews(true); // Get only published news
      setNewsItems(publishedNews as NewsItem[]);
    } catch (error) {
      console.error('Error loading news:', error);
      setNewsItems([]);
    } finally {
      setLoading(false);
    }
  };

  // Create a summary from content (first 150 characters)
  const createSummary = (content: string) => {
    return content.length > 150 ? content.substring(0, 150) + '...' : content;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-cream">
      {/* Header */}
      <div className="bg-primary-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center text-white hover:text-accent-gold transition-colors mb-6"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl lg:text-4xl font-bold mb-4">All News Updates</h1>
            <p className="text-lg opacity-90">
              Stay updated with our latest community development initiatives and progress.
            </p>
          </motion.div>
        </div>
      </div>

      {/* News Articles */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {newsItems.length === 0 ? (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No News Available</h2>
            <p className="text-gray-600">Check back later for updates on our community initiatives.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newsItems.map((item, index) => (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                {/* Featured Image */}
                <div className="relative h-48 overflow-hidden">
                  {item.featured_image ? (
                    <Image
                      src={item.featured_image}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                      <svg className="w-12 h-12 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2m-4-3H9M7 16h6" />
                      </svg>
                    </div>
                  )}
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="text-sm text-gray-500 mb-2">
                    {new Date(item.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })} • By {item.author}
                  </div>

                  <h2 className="text-xl font-bold mb-3 text-gray-900 line-clamp-2">
                    {item.title}
                  </h2>

                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {createSummary(item.content)}
                  </p>

                  <Link
                    href={`/news/${item.id}`}
                    className="inline-flex items-center text-primary-600 hover:text-primary-700 font-semibold transition-colors group/link"
                  >
                    <span>Read Full Article</span>
                    <svg
                      className="w-5 h-5 ml-2 group-hover/link:translate-x-1 transition-transform duration-200"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
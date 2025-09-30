'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { getNews } from '../lib/db';

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

const NewsSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Load news from database
  useEffect(() => {
    loadNewsData();
  }, []);

  const loadNewsData = async () => {
    try {
      setLoading(true);
      const publishedNews = await getNews(true); // Get only published news
      console.log('Loaded published news:', publishedNews);
      console.log('First news item:', publishedNews[0]);
      if (publishedNews[0]) {
        console.log('Featured image field:', publishedNews[0].featured_image);
      }
      setNewsItems(publishedNews as NewsItem[]);
    } catch (error) {
      console.error('Error loading news:', error);
      setNewsItems([]);
    } finally {
      setLoading(false);
    }
  };

  // Auto-advance functionality
  useEffect(() => {
    if (!isAutoPlaying || newsItems.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % newsItems.length);
    }, 15000); // Change slide every 15 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, newsItems.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % newsItems.length);
    setIsAutoPlaying(false); // Pause auto-play when user interacts
    setTimeout(() => setIsAutoPlaying(true), 10000); // Resume after 10 seconds
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + newsItems.length) % newsItems.length);
    setIsAutoPlaying(false); // Pause auto-play when user interacts
    setTimeout(() => setIsAutoPlaying(true), 10000); // Resume after 10 seconds
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false); // Pause auto-play when user interacts
    setTimeout(() => setIsAutoPlaying(true), 10000); // Resume after 10 seconds
  };

  const getVisibleCards = () => {
    if (newsItems.length === 0) return [];
    
    const cards = [];
    const maxCards = Math.min(3, newsItems.length);
    for (let i = 0; i < maxCards; i++) {
      const index = (currentSlide + i) % newsItems.length;
      cards.push(newsItems[index]);
    }
    return cards;
  };

  // Create a summary from content (first 100 characters)
  const createSummary = (content: string) => {
    return content.length > 100 ? content.substring(0, 100) + '...' : content;
  };

  // Show loading state
  if (loading) {
    return (
      <section className="bg-neutral-cream py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-jost font-bold mb-12" style={{ color: '#785038' }}>
            News Updates
          </h2>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        </div>
      </section>
    );
  }

  // Show message if no news available
  if (!newsItems || newsItems.length === 0) {
    return (
      <section className="bg-neutral-cream py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-jost font-bold mb-12" style={{ color: '#785038' }}>
            News Updates
          </h2>
          <div className="text-center">
            <p className="text-gray-600 text-lg">No news updates available at this time.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-neutral-cream py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl lg:text-4xl font-jost font-bold mb-12"
          style={{
            fontWeight: 700,
            lineHeight: '100%',
            letterSpacing: '0%',
            verticalAlign: 'middle',
            color: '#785038'
          }}
        >
          News Updates
        </motion.h2>

        {/* News Cards Container */}
        <div className="relative">
          {/* Navigation Arrows - Only show if more than 3 items */}
          {newsItems.length > 3 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                style={{
                  backgroundColor: '#785038',
                  boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)'
                }}
                aria-label="Previous news items"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                style={{
                  backgroundColor: '#785038',
                  boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)'
                }}
                aria-label="Next news items"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <AnimatePresence mode="wait">
              {getVisibleCards().map((item, index) => (
                <motion.div
                  key={`${currentSlide}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                  whileHover={{ y: -5 }}
                >
                  {/* Card Image */}
                  <div className="relative h-64 lg:h-72 overflow-hidden">
                    {item.featured_image ? (
                      <Image
                        src={item.featured_image}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          console.error('Image failed to load:', item.featured_image);
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                        <svg className="w-16 h-16 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2m-4-3H9M7 16h6" />
                        </svg>
                      </div>
                    )}
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    
                    {/* Title overlay */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-white font-bold text-lg lg:text-xl leading-tight mb-2">
                        {item.title}
                      </h3>
                      <p className="text-white/90 text-sm line-clamp-2">
                        {createSummary(item.content)}
                      </p>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6">
                    <motion.div
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="text-sm text-gray-500 mb-2">
                        By {item.author} • {new Date(item.date).toLocaleDateString()}
                      </div>
                      <Link
                        href={`/news/${item.id}`}
                        className="group/link inline-flex items-center text-primary-600 hover:text-primary-700 font-semibold transition-colors duration-200"
                      >
                        <span>Learn more</span>
                        <svg 
                          className="w-5 h-5 ml-2 group-hover/link:translate-x-1 transition-transform duration-200" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </Link>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Dots Indicator - Only show if more than 3 items */}
          {newsItems.length > 3 && (
            <div className="flex justify-center mt-8 space-x-2">
              {newsItems.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide 
                      ? 'bg-primary-600 w-8' 
                      : 'bg-primary-300 hover:bg-primary-400'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

const NewsSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  
  // Mock news data - in production, this would come from the database
  const newsItems = [
    {
      id: 1,
      title: "Community Engagement Workshop",
      image: "/design1.png", // Using existing community images
      summary: "Building stronger communities through collaborative dialogue",
      link: "/news/community-workshop"
    },
    {
      id: 2,
      title: "Agricultural Development Initiative",
      image: "/design2.png", // Using existing community images
      summary: "Sustainable farming practices for food security",
      link: "/news/agricultural-development"
    },
    {
      id: 3,
      title: "Youth Training Program Launch",
      image: "/image.png", // Using existing community images
      summary: "Empowering youth through skill development",
      link: "/news/youth-training"
    }
  ];

  // Auto-advance functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % newsItems.length);
    }, 5000); // Change slide every 5 seconds

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
    const cards = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentSlide + i) % newsItems.length;
      cards.push(newsItems[index]);
    }
    return cards;
  };

  return (
    <section className="bg-neutral-cream py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl lg:text-4xl font-bold mb-12"
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
          {/* Navigation Arrows */}
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
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    
                    {/* Title overlay */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-white font-bold text-lg lg:text-xl leading-tight mb-2">
                        {item.title}
                      </h3>
                      <p className="text-white/90 text-sm line-clamp-2">
                        {item.summary}
                      </p>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6">
                    <motion.div
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Link
                        href={item.link}
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

          {/* Dots Indicator */}
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
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
'use client';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

const HeroSection = () => {
  return (
    <section className="bg-primary-600 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl font-bold mb-6 font-serif">
              Collaborative Developments
            </h1>
            <p className="text-xl mb-8 opacity-90">
              Foster community engagement, provide valuable resources, and facilitate collaboration.
            </p>
            <div className="space-x-4">
              <Link
                href="/about"
                className="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Placeholder for community collaboration image */}
            <div className="bg-primary-500 rounded-lg h-96 flex items-center justify-center">
              <p className="text-white text-center">
                Community Collaboration Image<br />
                (Hands coming together holding a plant)
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
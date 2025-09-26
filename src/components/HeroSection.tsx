'use client';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

const HeroSection = () => {
  return (
    <section className="bg-primary-600 text-white py-12 sm:py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center justify-items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left order-2 lg:order-1"
          >
            <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-jost font-bold mb-4 sm:mb-6 leading-tight text-neutral-cream">
              Collaborative<br />
              Developments
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl mb-6 sm:mb-8 opacity-90 leading-relaxed max-w-lg mx-auto lg:mx-0 text-center lg:text-left" style={{ color: '#FFF9EB' }}>
              foster community engagement, provide valuable resources, and facilitate collaboration
            </p>
            
            {/* Get Involved Button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Link
                href="/contact"
                className="group inline-flex items-center text-primary-600 px-8 py-4 font-bold text-lg hover:opacity-90 transition-all duration-300 relative overflow-hidden rounded-xl shadow-lg hover:text-accent-gold"
                style={{
                  backgroundColor: '#FFF9EB'
                }}
              >
                <span className="relative z-10 group-hover:translate-x-1 transition-transform duration-300">
                  Get Involved
                </span>
                
                {/* Animated background effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-accent-gold to-secondary-brown opacity-0 group-hover:opacity-20"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '0%' }}
                  transition={{ duration: 0.3 }}
                />
              </Link>
            </motion.div>
          </motion.div>
          
          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative flex justify-center lg:justify-start order-1 lg:order-2 lg:ml-10"
          >
            <div className="relative">
              {/* Circular container for the hands image */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="relative w-72 h-96 sm:w-80 sm:h-[400px] lg:w-96 lg:h-[480px] xl:w-[400px] xl:h-[540px] overflow-hidden shadow-2xl"
                style={{
                  borderRadius: '0px 0px 160px 0px'
                }}
              >
                <Image
                  src="/hands.jpg"
                  alt="Hands coming together holding a plant symbolizing collaboration and growth"
                  fill
                  className="object-cover"
                  priority
                />
                
                {/* Subtle overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary-700/10" />
              </motion.div>
              
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
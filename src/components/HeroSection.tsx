'use client';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

const HeroSection = () => {
  return (
    <section className="bg-primary-600 text-white py-12 sm:py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left order-2 lg:order-1"
          >
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 leading-tight" style={{ color: '#FFF9EB', fontFamily: 'Futura, sans-serif', fontWeight: 700, fontStyle: 'bold' }}>
              Collaborative<br />
              Developments
            </h1>
            <p className="text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 opacity-90 leading-relaxed max-w-lg mx-auto lg:mx-0" style={{ color: '#FFF9EB' }}>
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
                className="group inline-flex items-center text-primary-600 px-8 py-4 font-bold text-lg hover:opacity-90 transition-all duration-300 relative overflow-hidden"
                style={{
                  backgroundColor: '#FFF9EB',
                  clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 100%, 20px 100%)'
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
            className="relative flex justify-center lg:justify-start order-1 lg:order-2"
          >
            <div className="relative">
              {/* Circular container for the hands image */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="relative w-72 h-72 sm:w-80 sm:h-80 lg:w-96 lg:h-96 xl:w-[450px] xl:h-[450px] rounded-full overflow-hidden shadow-2xl"
              >
                <Image
                  src="/hands.png"
                  alt="Hands coming together holding a plant symbolizing collaboration and growth"
                  fill
                  className="object-cover"
                  priority
                />
                
                {/* Subtle overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary-700/10 rounded-full" />
              </motion.div>
              
              {/* Decorative elements */}
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute -inset-4 border-2 border-white/20 rounded-full"
              />
              
              <motion.div
                animate={{ 
                  scale: [1, 1.05, 1],
                  opacity: [0.2, 0.4, 0.2]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
                className="absolute -inset-8 border-2 border-white/10 rounded-full"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
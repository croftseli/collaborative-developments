'use client';
import { motion } from 'framer-motion';

const keyMembers = [
  {
    name: 'Roi Qualls',
    role: 'Financial Officer',
    description: 'Brings extensive experience in financial management and strategic planning. Committed to applying sound fiscal principles to support sustainable community development initiatives and ensure responsible stewardship of resources.'
  },
  {
    name: 'John Everett',
    role: 'Managing Member',
    description: 'Provides leadership in organizational development and community engagement. Dedicated to fostering collaborative partnerships and implementing society-building principles in practical community development projects.'
  }
];

export default function AboutPage() {
  return (
    <div>
      {/* About Us Section - Full Width Green Background */}
      <section className="bg-primary-600 text-white py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-8 color-neutral-cream">About Us</h1>
            <div className="max-w-3xl mx-auto">
              <p className="text-lg mb-6 color-neutral-cream">
                Provide detailed information about Collaborative Developments LLC, including its purpose to
                apply society-building principles to community development, food security, and job creation.
                That which while leads us, but within the paths guidance has made them, Make sure which made. Also like those within also made them, also made them.
              </p>
              <p className="color-neutral-cream">
                Our mission is rooted in foundational spiritual principles that guide our approach to sustainable
                community development and collaborative growth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Members Section */}
      <section className="py-16 bg-neutral-cream">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16" style={{ color: '#785038' }}>Key Members</h2>
          
          <div className="space-y-20 lg:space-y-24">
            {keyMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12"
              >
                {/* Profile Icon Container */}
                <div className="flex-shrink-0">
                  <div 
                    className="w-48 h-48 lg:w-56 lg:h-56 rounded-3xl flex items-center justify-center"
                    style={{ backgroundColor: '#785038' }}
                  >
                    {/* Simple line art profile icon */}
                    <svg 
                      className="w-20 h-20 lg:w-24 lg:h-24 text-white" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" 
                      />
                    </svg>
                  </div>
                </div>

                {/* Member Information */}
                <div className="flex-1 text-center lg:text-left">
                  <h3 className="text-2xl lg:text-3xl font-bold mb-2" style={{ color: '#785038' }}>
                    {member.name}
                  </h3>
                  <p className="text-lg lg:text-xl font-medium mb-4" style={{ color: '#785038', opacity: 0.8 }}>
                    {member.role}
                  </p>
                  <p className="text-base lg:text-lg leading-relaxed max-w-2xl" style={{ color: '#666666' }}>
                    {member.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Foundation Story Section */}
          <div className="mt-32 lg:mt-40 max-w-4xl mx-auto">
            <p className="text-base leading-relaxed text-center" style={{ color: '#666666' }}>
              This is a foundation story. Founded with a commitment to applying society-building principles to practical 
              community development initiatives, Collaborative Developments LLC emerged from a deep understanding that 
              sustainable progress requires both spiritual insight and practical action. Our approach integrates timeless 
              principles of unity, justice, and collaborative decision-making with modern methodologies for community 
              engagement, resource development, and capacity building. Through partnerships with local organizations, 
              government entities, and community leaders, we work to create lasting positive change that addresses 
              fundamental needs while building the foundations for long-term prosperity and social cohesion.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
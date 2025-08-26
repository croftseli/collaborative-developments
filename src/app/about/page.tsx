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
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* About Us Section */}
        <section className="bg-primary-600 text-white py-16 rounded-lg mb-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-8">About Us</h1>
            <div className="max-w-3xl mx-auto">
              <p className="text-lg mb-6">
                Provide detailed information about Collaborative Developments LLC, including its purpose to
                apply society-building principles to community development, food security, and job creation.
                That which while leads us, but within the paths guidance has made them, Make sure which made. Also like those within also made them, also made them.
              </p>
              <p>
                Our mission is rooted in foundational spiritual principles that guide our approach to sustainable
                community development and collaborative growth.
              </p>
            </div>
          </div>
        </section>

        {/* Key Members Section */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-12 text-earthy-700">Key Members</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {keyMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-white rounded-lg shadow-lg p-8"
              >
                <div className="flex items-start space-x-4">
                  <div className="bg-earthy-700 rounded-full p-4 text-white">
                    {/* Placeholder for member photo or icon */}
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-earthy-700">{member.name}</h3>
                    <p className="text-earthy-600 font-medium">{member.role}</p>
                    <p className="mt-2 text-neutral-charcoal">{member.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
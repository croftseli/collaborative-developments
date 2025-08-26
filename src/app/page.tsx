import HeroSection from '../components/HeroSection';

export default function Home() {
  return (
    <>
      <HeroSection />
      
      {/* News Updates Section */}
      <section className="bg-neutral-cream py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-earthy-700 mb-8">News Updates</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* News Card 1 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="h-48 bg-earthy-600 flex items-center justify-center">
                <span className="text-white text-center">Meeting Room<br />Image</span>
              </div>
              <div className="p-4">
                <button className="text-primary-600 hover:text-primary-700 font-medium">
                  Learn more →
                </button>
              </div>
            </div>
            
            {/* News Card 2 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="h-48 bg-earthy-600 flex items-center justify-center">
                <span className="text-white text-center">Office Space<br />Image</span>
              </div>
              <div className="p-4">
                <button className="text-primary-600 hover:text-primary-700 font-medium">
                  Learn more →
                </button>
              </div>
            </div>
            
            {/* News Card 3 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="h-48 bg-earthy-600 flex items-center justify-center">
                <span className="text-white text-center">Collaboration<br />Image</span>
              </div>
              <div className="p-4">
                <button className="text-primary-600 hover:text-primary-700 font-medium">
                  Learn more →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
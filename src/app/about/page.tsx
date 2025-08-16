import Image from "next/image";
import Link from "next/link";

const AboutPage = () => {
  return (
    <div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative min-h-screen bg-white dark:bg-secondary-900 transition-colors duration-300">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-950 dark:to-secondary-950 rounded-2xl p-8 md:p-12 mb-12 mt-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            About SUKKU
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Crafting exceptional e-commerce experiences with passion, innovation, and a commitment to quality.
          </p>
        </div>
      </div>

      {/* Story Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        <div className="order-2 lg:order-1">
          <div className="bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900/30 dark:to-secondary-900/30 rounded-2xl aspect-square flex items-center justify-center">
            <div className="text-center">
              <div className="text-8xl mb-4">🚀</div>
              <div className="text-primary-600 dark:text-primary-400 font-bold text-xl">Est. 2024</div>
            </div>
          </div>
        </div>
        <div className="order-1 lg:order-2 flex flex-col justify-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Our Story
          </h2>
          <div className="space-y-4 text-gray-600 dark:text-gray-400">
            <p className="text-lg">
              SUKKU was born from a simple vision: to create an online shopping experience that combines 
              cutting-edge technology with genuine human care. Founded by <strong className="text-primary-600 dark:text-primary-400">Sukrit Chopra</strong>, 
              our journey began with the belief that every customer deserves exceptional service.
            </p>
            <p>
              What started as a small project has grown into a comprehensive e-commerce platform, 
              powered by modern web technologies including Next.js and Wix Headless CMS. We&apos;re committed 
              to providing not just products, but experiences that delight and inspire.
            </p>
            <p>
              Today, SUKKU serves customers across India, delivering quality products with the speed 
              and reliability that modern shoppers demand.
            </p>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-12 text-center">
          Our Core Values
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-secondary-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 text-center group hover:scale-105 transition-transform duration-300">
            <div className="bg-primary-100 dark:bg-primary-900/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">💎</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Quality First</h3>
            <p className="text-gray-600 dark:text-gray-400">
              We curate only the finest products, ensuring every item meets our high standards for quality and durability.
            </p>
          </div>

          <div className="bg-white dark:bg-secondary-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 text-center group hover:scale-105 transition-transform duration-300">
            <div className="bg-primary-100 dark:bg-primary-900/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">🤝</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Customer Centric</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Your satisfaction is our priority. We listen, adapt, and continuously improve based on your feedback.
            </p>
          </div>

          <div className="bg-white dark:bg-secondary-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 text-center group hover:scale-105 transition-transform duration-300">
            <div className="bg-primary-100 dark:bg-primary-900/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">⚡</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Innovation</h3>
            <p className="text-gray-600 dark:text-gray-400">
              We embrace the latest technologies to create shopping experiences that are fast, intuitive, and enjoyable.
            </p>
          </div>
        </div>
      </div>

      {/* Founder Section */}
      <div className="bg-gradient-to-r from-secondary-50 to-primary-50 dark:from-secondary-950 dark:to-primary-950 rounded-2xl p-8 md:p-12 mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Meet the Founder
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            The visionary behind SUKKU&apos;s success
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="text-center lg:text-left">
            <div className="bg-gradient-to-br from-primary-200 to-secondary-200 dark:from-primary-800 dark:to-secondary-800 rounded-full w-48 h-48 mx-auto lg:mx-0 mb-6 flex items-center justify-center">
              <div className="text-6xl">👨‍💻</div>
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Sukrit Chopra</h3>
            <div className="text-primary-600 dark:text-primary-400 font-semibold mb-4">Founder & CEO</div>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>
                A passionate entrepreneur and technology enthusiast, Sukrit brings years of experience 
                in e-commerce and web development to SUKKU. His vision is to democratize online shopping 
                and make quality products accessible to everyone.
              </p>
              <p>
                When not working on SUKKU, Sukrit enjoys exploring new technologies, traveling, 
                and connecting with fellow entrepreneurs and customers.
              </p>
            </div>
            <div className="mt-6">
              <Link 
                href="/contact" 
                className="inline-flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-colors duration-200"
              >
                Get in Touch →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="bg-white dark:bg-secondary-800 rounded-2xl p-8 md:p-12 shadow-lg border border-gray-200 dark:border-gray-700 mb-16">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8 text-center">
          SUKKU by the Numbers
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">1000+</div>
            <div className="text-gray-600 dark:text-gray-400">Happy Customers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">500+</div>
            <div className="text-gray-600 dark:text-gray-400">Products</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">50+</div>
            <div className="text-gray-600 dark:text-gray-400">Cities Served</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">99.9%</div>
            <div className="text-gray-600 dark:text-gray-400">Uptime</div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 dark:from-primary-700 dark:to-secondary-700 rounded-2xl p-8 md:p-12 text-white text-center mb-12">
        <h3 className="text-2xl md:text-3xl font-bold mb-4">Ready to Shop with SUKKU?</h3>
        <p className="text-lg mb-6 opacity-90">
          Join thousands of satisfied customers and discover why SUKKU is the preferred choice for online shopping.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/shop" 
            className="px-8 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            Start Shopping
          </Link>
          <Link 
            href="/contact" 
            className="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-primary-600 transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;

"use client";

import { useState } from "react";
import Image from "next/image";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative min-h-screen bg-white dark:bg-secondary-900 transition-colors duration-300">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-950 dark:to-secondary-950 rounded-2xl p-8 md:p-12 mb-12 mt-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Get in Touch
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            We&apos;d love to hear from you! Reach out with any questions, feedback, or collaboration ideas.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Contact Information */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
            Contact Information
          </h2>
          
          <div className="space-y-6 mb-8">
            <div className="flex items-start space-x-4">
              <div className="bg-primary-100 dark:bg-primary-900/30 rounded-full p-3 flex-shrink-0">
                <span className="text-xl">📍</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Address</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  3252 Plaza Apartments<br />
                  Central Delhi, New Delhi 110052<br />
                  India
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-primary-100 dark:bg-primary-900/30 rounded-full p-3 flex-shrink-0">
                <span className="text-xl">✉️</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Email</h3>
                <a 
                  href="mailto:sukritchopra2003@gmail.com" 
                  className="text-primary-600 dark:text-primary-400 hover:underline"
                >
                  sukritchopra2003@gmail.com
                </a>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-primary-100 dark:bg-primary-900/30 rounded-full p-3 flex-shrink-0">
                <span className="text-xl">📱</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Phone</h3>
                <a 
                  href="tel:+919560760057" 
                  className="text-primary-600 dark:text-primary-400 hover:underline"
                >
                  +91 9560760057
                </a>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-primary-100 dark:bg-primary-900/30 rounded-full p-3 flex-shrink-0">
                <span className="text-xl">🕒</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Business Hours</h3>
                <div className="text-gray-600 dark:text-gray-400 space-y-1">
                  <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p>Saturday: 10:00 AM - 4:00 PM</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="bg-primary-100 dark:bg-primary-900/30 rounded-full p-3 hover:bg-primary-200 dark:hover:bg-primary-800/50 transition-colors">
                <Image src="/facebook.png" alt="Facebook" width={20} height={20} className="opacity-70 hover:opacity-100 transition-opacity" />
              </a>
              <a href="#" className="bg-primary-100 dark:bg-primary-900/30 rounded-full p-3 hover:bg-primary-200 dark:hover:bg-primary-800/50 transition-colors">
                <Image src="/instagram.png" alt="Instagram" width={20} height={20} className="opacity-70 hover:opacity-100 transition-opacity" />
              </a>
              <a href="#" className="bg-primary-100 dark:bg-primary-900/30 rounded-full p-3 hover:bg-primary-200 dark:hover:bg-primary-800/50 transition-colors">
                <Image src="/x.png" alt="X (Twitter)" width={20} height={20} className="opacity-70 hover:opacity-100 transition-opacity" />
              </a>
              <a href="#" className="bg-primary-100 dark:bg-primary-900/30 rounded-full p-3 hover:bg-primary-200 dark:hover:bg-primary-800/50 transition-colors">
                <Image src="/youtube.png" alt="YouTube" width={20} height={20} className="opacity-70 hover:opacity-100 transition-opacity" />
              </a>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
            Send us a Message
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-secondary-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-secondary-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                placeholder="Enter your email address"
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Subject *
              </label>
              <select
                id="subject"
                name="subject"
                required
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-secondary-800 text-gray-900 dark:text-gray-100 transition-colors"
              >
                <option value="">Select a subject</option>
                <option value="general">General Inquiry</option>
                <option value="support">Customer Support</option>
                <option value="business">Business Partnership</option>
                <option value="feedback">Feedback</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Message *
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={6}
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-secondary-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors resize-vertical"
                placeholder="Tell us how we can help you..."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitted}
              className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
            >
              {isSubmitted ? (
                <>
                  <span className="mr-2">✅</span>
                  Message Sent!
                </>
              ) : (
                <>
                  <span className="mr-2">📧</span>
                  Send Message
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white dark:bg-secondary-800 rounded-2xl p-8 md:p-12 shadow-lg border border-gray-200 dark:border-gray-700 mb-16">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8 text-center">
          Frequently Asked Questions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">What are your shipping options?</h4>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              We offer free shipping on orders over ₹999. Standard shipping takes 3-5 business days, 
              while express shipping delivers within 1-2 business days.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Do you have a return policy?</h4>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Yes! We offer a 30-day money-back guarantee on all products. Items must be in original 
              condition for returns.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">How can I track my order?</h4>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Once your order ships, you&apos;ll receive a tracking number via email. You can also track 
              orders in your account dashboard.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Do you offer wholesale pricing?</h4>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Yes, we offer wholesale pricing for bulk orders. Contact us directly to discuss 
              volume discounts and partnership opportunities.
            </p>
          </div>
        </div>
      </div>

      {/* Map placeholder */}
      <div className="bg-gradient-to-r from-secondary-100 to-primary-100 dark:from-secondary-900/30 dark:to-primary-900/30 rounded-2xl p-8 md:p-12 text-center mb-12">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Visit Our Location</h3>
        <div className="bg-gray-200 dark:bg-gray-700 rounded-xl h-64 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-2">🗺️</div>
            <p className="text-gray-600 dark:text-gray-400">Interactive map coming soon</p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
              Central Delhi, New Delhi 110052, India
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;

import React from 'react';
import { Mail, Phone, MapPin, ArrowRight, Linkedin, Twitter, Instagram, Github, Facebook } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const services = [
    'AI & Machine Learning',
    'Mobile Development', 
    'Web Development',
    'Cloud Solutions',
    'Data Analytics',
    'Cybersecurity'
  ];

  const company = [
    { name: 'About Us', href: '#about' },
    { name: 'Our Team', href: '#team' },
    { name: 'Careers', href: '#careers' },
    { name: 'News & Updates', href: '#news' },
    { name: 'Privacy Policy', href: '#privacy' },
    { name: 'Terms of Service', href: '#terms' }
  ];

  const resources = [
    { name: 'Documentation', href: '#docs' },
    { name: 'API Reference', href: '#api' },
    { name: 'Support Center', href: '#support' },
    { name: 'Case Studies', href: '#case-studies' },
    { name: 'Whitepapers', href: '#whitepapers' },
    { name: 'Blog', href: '#blog' }
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white">
      {/* Newsletter Section */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-4">Stay Updated with TimingoTech</h3>
              <p className="text-gray-400 text-lg">
                Get the latest insights on AI, technology trends, and exclusive updates on our projects.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-6 py-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white/20 transition-all"
              />
              <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center gap-2 whitespace-nowrap">
                Subscribe <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-5 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">T</span>
              </div>
              <span className="text-2xl font-bold">
                Timingo<span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Tech</span>
              </span>
            </div>
            
            <p className="text-gray-400 mb-8 max-w-md leading-relaxed">
              Pioneering precision with AI-driven solutions. We embrace tomorrow's challenges 
              with today's cutting-edge technology, delivering innovation that transforms businesses globally.
            </p>

            {/* Contact Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <div className="text-sm text-gray-400">Email</div>
                  <a href="mailto:hello@timingotech.com" className="text-white hover:text-blue-400 transition-colors">
                    hello@timingotech.com
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center">
                  <Phone className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <div className="text-sm text-gray-400">Phone</div>
                  <a href="tel:+15551234567" className="text-white hover:text-purple-400 transition-colors">
                    +1 (555) 123-4567
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-600/20 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <div className="text-sm text-gray-400">Address</div>
                  <div className="text-white">123 Tech Street, Innovation City</div>
                </div>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Services</h4>
            <ul className="space-y-3">
              {services.map((service, index) => (
                <li key={index}>
                  <a href="#services" className="text-gray-400 hover:text-white transition-colors flex items-center group">
                    <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transform translate-x-[-8px] group-hover:translate-x-0 transition-all" />
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Company</h4>
            <ul className="space-y-3">
              {company.map((item, index) => (
                <li key={index}>
                  <a href={item.href} className="text-gray-400 hover:text-white transition-colors flex items-center group">
                    <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transform translate-x-[-8px] group-hover:translate-x-0 transition-all" />
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Resources</h4>
            <ul className="space-y-3">
              {resources.map((item, index) => (
                <li key={index}>
                  <a href={item.href} className="text-gray-400 hover:text-white transition-colors flex items-center group">
                    <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transform translate-x-[-8px] group-hover:translate-x-0 transition-all" />
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Copyright */}
            <div className="text-gray-400 text-center lg:text-left">
              <p>&copy; {currentYear} TimingoTech. All rights reserved.</p>
              <p className="text-sm mt-1">Pioneering the future of technology, one innovation at a time.</p>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              <span className="text-gray-400 text-sm mr-4">Follow us:</span>
              
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110 group">
                <Linkedin className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
              </a>
              
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-sky-500 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110 group">
                <Twitter className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
              </a>
              
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-pink-600 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110 group">
                <Instagram className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
              </a>
              
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-gray-600 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110 group">
                <Github className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
              </a>
              
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-blue-700 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110 group">
                <Facebook className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
              </a>
            </div>

            {/* Back to Top */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-6 py-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-600/30 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 flex items-center gap-2"
            >
              Back to Top <ArrowRight className="w-4 h-4 transform rotate-[-90deg]" />
            </button>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-600/5 rounded-full blur-3xl"></div>
      </div>

      <style jsx>{`
        .group:hover .group-hover\\:opacity-100 {
          opacity: 1;
        }
        .group:hover .group-hover\\:translate-x-0 {
          transform: translateX(0);
        }
        .group:hover .group-hover\\:text-white {
          color: white;
        }
        .group:hover .group-hover\\:scale-110 {
          transform: scale(1.1);
        }
      `}</style>
    </footer>
  );
};

export default Footer;
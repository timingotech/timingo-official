import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ArrowRight, Linkedin, Twitter, Instagram, Facebook } from 'lucide-react';
import InfoModal from './InfoModal';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState(null);
  const [subscribeEmail, setSubscribeEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState(null); // 'success' | 'error' | null

  const openModal = (name) => {
    setModalTitle(name);
    const emailLink = (
      <a href="mailto:team@timingotech.com" className="text-blue-600 hover:underline">team@timingotech.com</a>
    );

    switch (name) {
      case 'Our Team':
        setModalContent(
          <div>
            <p>Meet the talented team behind TimingoTech. Team bios and roles will be published here soon.</p>
            <p className="mt-3">To inquire about collaboration or speaking with the team, email {emailLink}.</p>
          </div>
        );
        break;
      case 'Careers':
        setModalContent(
          <div>
            <p>We hire across engineering, design, and product. Open roles will appear here.</p>
            <p className="mt-3">To apply or ask about opportunities, contact {emailLink} with your CV.</p>
          </div>
        );
        break;
      case 'News & Updates':
        setModalContent(
          <div>
            <p>News, announcements, and product updates will be posted here. Subscribe to our newsletter to stay informed.</p>
            <p className="mt-3">Subscribe via email: {emailLink}</p>
          </div>
        );
        break;
      case 'Privacy Policy':
      case 'Terms of Service':
        setModalContent(
          <div>
            <p>This site’s {name.toLowerCase()} will be published shortly. For immediate questions, reach out to {emailLink}.</p>
          </div>
        );
        break;
      case 'Documentation':
      case 'API Reference':
        setModalContent(
          <div>
            <p>Developer documentation and API reference are available on request.</p>
            <p className="mt-3">Request access via {emailLink} and include your organization details.</p>
          </div>
        );
        break;
      case 'Whitepapers':
        setModalContent(
          <div>
            <p>Whitepapers and research documents will be available soon. Contact {emailLink} to request copies.</p>
          </div>
        );
        break;
      case 'Blog':
        setModalContent(
          <div>
            <p>Our blog is coming soon. For insights and updates, subscribe via email: {emailLink}.</p>
          </div>
        );
        break;
      default:
        setModalContent(<div><p>Information coming soon. Contact {emailLink} for details.</p></div>);
    }

    setModalOpen(true);
  };

  const services = [
    'AI & Machine Learning',
    'Mobile Development', 
    'Web Development',
    'Cloud Solutions',
    'Data Analytics',
    'Cybersecurity'
  ];

  const company = [
    { name: 'About Us', href: '/about' }
  ];

  const resources = [
    { name: 'Support Center', href: '/support' },
    { name: 'Case Studies', href: '/projects' }
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white">
      <InfoModal open={modalOpen} title={modalTitle} onClose={() => setModalOpen(false)}>
        {modalContent}
      </InfoModal>
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
                value={subscribeEmail}
                onChange={(e) => setSubscribeEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-6 py-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white/20 transition-all"
              />
              <button onClick={async () => {
                if (!subscribeEmail) return setSubscribeStatus('error');
                setSubscribeStatus(null);
                try {
                  await axios.post('/api/subscribe', { email: subscribeEmail });
                  setSubscribeStatus('success');
                  setSubscribeEmail('');
                  setTimeout(() => setSubscribeStatus(null), 4000);
                } catch (e) {
                  console.error(e);
                  setSubscribeStatus('error');
                  setTimeout(() => setSubscribeStatus(null), 4000);
                }
              }} className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center gap-2 whitespace-nowrap">
                Subscribe <ArrowRight className="w-5 h-5" />
              </button>
              {subscribeStatus === 'success' && <div className="text-green-400 ml-4 self-center">Subscribed</div>}
              {subscribeStatus === 'error' && <div className="text-red-400 ml-4 self-center">Error</div>}
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
                  <a href="mailto:team@timingotech.com" className="text-white hover:text-blue-400 transition-colors">
                    team@timingotech.com
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center">
                  <Phone className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <div className="text-sm text-gray-400">Phone</div>
                  <a href="tel:+2349022013174" className="text-white hover:text-purple-400 transition-colors">
                    +234 (902) 201-3174
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-600/20 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <div className="text-sm text-gray-400">Service</div>
                  <div className="text-white">Worldwide</div>
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
                      <Link to="/services" className="text-gray-400 hover:text-white transition-colors flex items-center group">
                        <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all" />
                        {service}
                      </Link>
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
                  {item.href ? (
                    <Link to={item.href} className="text-gray-400 hover:text-white transition-colors flex items-center group">
                      <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all" />
                      {item.name}
                    </Link>
                  ) : (
                    <button
                      onClick={() => openModal(item.name)}
                      className="text-gray-400 hover:text-white transition-colors flex items-center group"
                    >
                      <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all" />
                      {item.name}
                    </button>
                  )}
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
                  {item.href ? (
                    <Link to={item.href} className="text-gray-400 hover:text-white transition-colors flex items-center group">
                      <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all" />
                      {item.name}
                    </Link>
                  ) : (
                    <button
                      onClick={() => openModal(item.name)}
                      className="text-gray-400 hover:text-white transition-colors flex items-center group"
                    >
                      <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all" />
                      {item.name}
                    </button>
                  )}
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
              
              <a aria-label="TimingoTech on LinkedIn" href="https://www.linkedin.com/company/timingotech/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110 group">
                <Linkedin className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
              </a>

              <a aria-label="TimingoTech on X" href="https://x.com/_timingotech" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 hover:bg-sky-500 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110 group">
                <Twitter className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
              </a>

              <a aria-label="TimingoTech on Instagram" href="https://www.instagram.com/timingotech/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 hover:bg-pink-600 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110 group">
                <Instagram className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
              </a>

              <a aria-label="TimingoTech on Facebook" href="https://www.facebook.com/timingotech" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 hover:bg-blue-700 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110 group">
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

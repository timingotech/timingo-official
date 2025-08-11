import { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, Code, Rocket, Users, Mail, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [showServices, setShowServices] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const closeMenu = () => {
    setShowMenu(false);
    setShowServices(false);
  };

  const toggleServices = () => {
    setShowServices(!showServices);
  };

  const services = [
    { name: 'AI & Machine Learning', icon: <Code className="w-4 h-4" />, desc: 'Advanced AI solutions' },
    { name: 'Mobile Development', icon: <Rocket className="w-4 h-4" />, desc: 'Native & cross-platform apps' },
    { name: 'Web Development', icon: <Users className="w-4 h-4" />, desc: 'Modern web applications' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-200/20' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
        <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2" onClick={closeMenu}>
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <span className={`text-2xl font-bold ${scrolled ? 'text-gray-900' : 'text-white'}`}>
                Timingo<span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Tech</span>
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
         <div className="hidden lg:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`font-medium transition-colors hover:text-blue-600 ${scrolled ? 'text-gray-700' : 'text-white'}`}
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className={`font-medium transition-colors hover:text-blue-600 ${scrolled ? 'text-gray-700' : 'text-white'}`}
            >
              About
            </Link>

            {/* Services Dropdown */}
            <div className="relative group">
              <button 
                className={`flex items-center space-x-1 font-medium transition-colors hover:text-blue-600 ${scrolled ? 'text-gray-700' : 'text-white'}`}
                onClick={toggleServices}
              >
                <span>Services</span>
                <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
              </button>
              <div className={`absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0`}>
                <div className="p-6">
                  <div className="grid gap-4">
                    {services.map((service, index) => (
                      <Link
                        key={index}
                        to="/services"
                        className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                        onClick={closeMenu}
                      >
                        <div className="text-blue-600 mt-1">{service.icon}</div>
                        <div>
                          <div className="font-medium text-gray-900">{service.name}</div>
                          <div className="text-sm text-gray-500">{service.desc}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <Link 
              to="/projects" 
              className={`font-medium transition-colors hover:text-blue-600 ${scrolled ? 'text-gray-700' : 'text-white'}`}
            >
              Projects
            </Link>
            <Link 
              to="/contact" 
              className={`font-medium transition-colors hover:text-blue-600 ${scrolled ? 'text-gray-700' : 'text-white'}`}
            >
              Contact
            </Link>
          </div>
          {/* CTA Button */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link 
            to="/contact"
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105">
              
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className={`lg:hidden p-2 rounded-lg transition-colors ${
              scrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'
            }`}
          >
            {showMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden transition-all duration-300 ${
        showMenu ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
      } overflow-hidden bg-white border-t border-gray-200`}>
        <div className="px-6 py-6 space-y-6">
          <Link
            to="/"
            onClick={closeMenu}
            className="block text-lg font-medium text-gray-700 hover:text-blue-600 transition-colors"
          >
            Home
          </Link>
          <Link
            to="/about"
            onClick={closeMenu}
            className="block text-lg font-medium text-gray-700 hover:text-blue-600 transition-colors"
          >
            About
          </Link>
          
          {/* Mobile Services */}
          <div>
            <button
              onClick={toggleServices}
              className="flex items-center justify-between w-full text-lg font-medium text-gray-700 hover:text-blue-600 transition-colors"
            >
              <span>Services</span>
              <ChevronDown className={`w-5 h-5 transition-transform ${showServices ? 'rotate-180' : ''}`} />
            </button>
            
            <div className={`mt-4 ml-4 space-y-3 transition-all duration-300 ${
              showServices ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
            } overflow-hidden`}>
              {services.map((service, index) => (
                <Link
                  key={index}
                  to="/services"
                  onClick={closeMenu}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="text-blue-600">{service.icon}</div>
                  <div>
                    <div className="font-medium text-gray-900">{service.name}</div>
                    <div className="text-sm text-gray-500">{service.desc}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

         <Link to="/projects" onClick={closeMenu} className="block text-lg font-medium text-gray-700 hover:text-blue-600 transition-colors">
            Projects
          </Link>
          <Link to="/contact" onClick={closeMenu} className="block text-lg font-medium text-gray-700 hover:text-blue-600 transition-colors">
            Contact
          </Link>
          
          <div className="pt-4 border-t border-gray-200">
         <Link 
              to="/contact"
              onClick={closeMenu}
              className="w-full block text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .group:hover .group-hover\\:opacity-100 {
          opacity: 1;
        }
        .group:hover .group-hover\\:visible {
          visibility: visible;
        }
        .group:hover .group-hover\\:translate-y-0 {
          transform: translateY(0);
        }
        .group:hover .group-hover\\:rotate-180 {
          transform: rotate(180deg);
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
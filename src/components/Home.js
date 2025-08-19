import React, { useEffect, useState, useRef } from 'react';
import { ChevronRight, Users, Trophy, Lightbulb, Zap, Shield, Globe, ArrowRight, CheckCircle, Star, TrendingUp, Code, Smartphone, Cloud, Database, Brain, Rocket, Target, Award, X, ExternalLink } from 'lucide-react';
import {Link} from 'react-router-dom'
import Microsoft from '../images/Microsoft.jpeg'
import SereniMind from '../images/SereniMind.png'
import Trof from '../images/Trof.png'

const Home = () => {
  const [animateOnLoad, setAnimateOnLoad] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [selectedProject, setSelectedProject] = useState(null);
  const form = useRef();

  useEffect(() => {
    setAnimateOnLoad(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll('.animate-on-scroll');
      elements.forEach((el) => {
        const elementTop = el.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        if (elementTop < windowHeight * 0.8) {
          el.classList.add('show');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Testimonial rotation
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const sendEmail = (e) => {  
    e.preventDefault();
    // Simulated email sending
    alert('Message sent successfully!');
    form.current.reset();
  };

  const newsLetter = (e) => {
    e.preventDefault();
    alert('Successfully subscribed to newsletter!');
    e.target.reset();
  };

  const partners = [
    { name: 'SereniMind', logo: SereniMind },
    { name: 'TROF', logo: Trof },
    { name: 'Microsoft', logo: Microsoft }
  ];

  const services = [
    { icon: <Brain className="w-8 h-8" />, title: 'AI & Machine Learning', desc: 'Advanced AI solutions for business automation' },
    { icon: <Smartphone className="w-8 h-8" />, title: 'Mobile Development', desc: 'Native and cross-platform mobile applications' },
    { icon: <Cloud className="w-8 h-8" />, title: 'Cloud Solutions', desc: 'Scalable cloud infrastructure and migration' },
    { icon: <Database className="w-8 h-8" />, title: 'Data Analytics', desc: 'Big data processing and business intelligence' },
    { icon: <Shield className="w-8 h-8" />, title: 'Cybersecurity', desc: 'Comprehensive security solutions and audits' },
    { icon: <Globe className="w-8 h-8" />, title: 'Web Development', desc: 'Modern, responsive web applications' }
  ];

  const projects = [
    {
      title: 'SereniMind',
      category: 'Mental Health Tech Startup',
      achievement: '300,000+ Users',
      description: 'AI-powered mental health platform providing therapy, community support, and wellness tools',
      metrics: ['Over 10+ African & global partnerships', '99.9% uptime', 'Top 100 Health Companies in Nigeria'],
      tech: ['React', 'Django REST', 'TensorFlow', 'AWS'],
      website: 'https://serenimind.com.ng',
      fullDescription: 'SereniMind is a revolutionary mental health platform that combines AI technology with human expertise to provide accessible mental health care across Africa. The platform offers personalized therapy sessions, community support groups, wellness tracking, and crisis intervention services.',
      features: [
        'AI-powered mental health assessments',
        'Video therapy sessions with licensed professionals',
        'Community support forums and group therapy',
        'Wellness tracking and mood monitoring',
        '24/7 crisis intervention hotline',
        'Multilingual support for African languages'
      ]
    },
    {
      title: 'FinTech Mobile App',
      category: 'Financial Technology',
      achievement: '$2M+ Transactions',
      description: 'Secure mobile banking solution with biometric authentication',
      metrics: ['5K+ downloads', 'Bank-grade security', '4.8/5 rating'],
      tech: ['React Native', 'Blockchain', 'AWS Lambda'],
      website: '',
      fullDescription: 'A cutting-edge mobile banking application that revolutionizes financial transactions with advanced security features and seamless user experience. Built with blockchain technology for enhanced security and transparency.',
      features: [
        'Biometric authentication (fingerprint & face recognition)',
        'Real-time transaction monitoring',
        'Blockchain-based security',
        'Multi-currency support',
        'Investment portfolio management',
        'AI-powered spending insights'
      ]
    },
    {
      title: 'Raymond Ofodu Foundation (TROF)',
      category: 'Nonprofit & Community Development',
      achievement: '1,000+ Children Supported',
      description: 'A pan-African charity dedicated to child protection, education, youth empowerment, and climate action.',
      metrics: [
        '1,000+ children supported',
        '25+ communities reached',
        '500+ testimonials from grateful families'
      ],
      tech: ['React', 'Node JS', 'Vercel'],
      website: 'https://trof.vercel.app',
      fullDescription: 'The Raymond Ofodu Foundation is a comprehensive nonprofit platform that manages charitable activities across Africa, focusing on child welfare, education, and environmental sustainability. The platform streamlines donation management, volunteer coordination, and impact tracking.',
      features: [
        'Donation management system',
        'Volunteer registration and coordination',
        'Impact tracking and reporting',
        'Educational resource distribution',
        'Community outreach programs',
        'Climate action initiatives tracking'
      ]
    }
  ];

  const testimonials = [
    {
      name: 'Adebola Adeniyi',
      company: 'SereniMind',
      role: 'CTO',
      content: 'TimingoTech transformed our digital infrastructure. Their AI solutions increased our efficiency by 40%.',
      rating: 5
    },
    {
      name: 'Michael Chen',
      company: 'Global Media Ltd.',
      role: 'CEO',
      content: 'The MediaFlow platform revolutionized how we handle content. Exceptional technical expertise.',
      rating: 5
    },
    {
      name: 'David Chibu',
      company: 'FinanceFlow',
      role: 'Product Director',
      content: 'Outstanding mobile development. Our app now serves millions with perfect reliability.',
      rating: 5
    }
  ];

  const openProjectModal = (project) => {
    setSelectedProject(project);
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  };

  const closeProjectModal = () => {
    setSelectedProject(null);
    document.body.style.overflow = 'unset'; // Restore scrolling
  };

  // Close modal on escape key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        closeProjectModal();
      }
    };

    if (selectedProject) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [selectedProject]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <style jsx>{`
        .animate-on-scroll {
          opacity: 0;
          transform: translateY(50px);
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .animate-on-scroll.show {
          opacity: 1;
          transform: translateY(0);
        }
        .animate-left {
          opacity: 0;
          transform: translateX(-100px);
          transition: all 1s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .animate-left.show {
          opacity: 1;
          transform: translateX(0);
        }
        .animate-right {
          opacity: 0;
          transform: translateX(100px);
          transition: all 1s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .animate-right.show {
          opacity: 1;
          transform: translateX(0);
        }
        .gradient-text {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .card-hover {
          transition: all 0.3s ease;
        }
        .card-hover:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        }
        .partners-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 2rem;
          align-items: center;
          justify-items: center;
        }
        .modal-backdrop {
          backdrop-filter: blur(8px);
          background-color: rgba(0, 0, 0, 0.8);
        }
        .modal-content {
          max-height: 90vh;
          overflow-y: auto;
        }
      `}</style>

      {/* Hero Section */}
      <section className="relative px-6 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className={`animate-left ${animateOnLoad ? 'show' : ''}`}>
              <h1 className="mb-6 text-4xl font-bold leading-tight text-white lg:text-6xl">
                Embracing the <span className="gradient-text">World's</span> Challenges,
                <br />Leading with <span className="gradient-text">Technology</span> and <span className="gradient-text">AI</span>
              </h1>
              <p className="mb-8 text-xl text-gray-300 max-w-2xl">
                We innovate with precision timing and AI to solve global challenges across industries, 
                delivering cutting-edge solutions that transform businesses and drive digital evolution.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to='/projects' className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center gap-2">
                  Explore Our Projects <ChevronRight className="w-5 h-5" />
                </Link>
                <Link to='/contact' className="px-8 py-4 border-2 border-white/30 text-white rounded-lg font-semibold hover:bg-white/10 transition-all duration-300">
                  Get Started
                </Link>
              </div>
            </div>
            <div className={`animate-right ${animateOnLoad ? 'show' : ''}`}>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-purple-600/30 blur-3xl"></div>
                <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white">500+</div>
                      <div className="text-gray-300">Projects Delivered</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white">98%</div>
                      <div className="text-gray-300">Client Satisfaction</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white">50+</div>
                      <div className="text-gray-300">Team Experts</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white">24/7</div>
                      <div className="text-gray-300">Support</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Core Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive technology solutions designed to accelerate your digital transformation
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="animate-on-scroll card-hover bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                <div className="text-blue-600 mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600 mb-4">{service.desc}</p>
                <Link 
                  to="/services" 
                  className="text-blue-600 font-semibold flex items-center gap-2 hover:gap-3 transition-all"
                >
                  Learn More <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Projects</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Showcase of our successful implementations across various industries
            </p>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <div key={index} className="animate-on-scroll card-hover bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <Trophy className="w-6 h-6 text-yellow-500" />
                    <span className="text-yellow-600 font-semibold">{project.achievement}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{project.title}</h3>
                  <p className="text-blue-600 font-medium mb-4">{project.category}</p>
                  <p className="text-gray-600 mb-6">{project.description}</p>
                  
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Key Achievements:</h4>
                    {project.metrics.map((metric, i) => (
                      <div key={i} className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-gray-600 text-sm">{metric}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tech.map((tech, i) => (
                      <span key={i} className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {tech}
                      </span>
                    ))}
                  </div>
                  
                  <button 
                    onClick={() => openProjectModal(project)}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
                  >
                    View Case Study
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Project Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop">
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full modal-content">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">{selectedProject.title}</h2>
              <button 
                onClick={closeProjectModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-3">
                <Trophy className="w-6 h-6 text-yellow-500" />
                <span className="text-yellow-600 font-semibold">{selectedProject.achievement}</span>
              </div>
              
              <div>
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full mb-4">
                  {selectedProject.category}
                </span>
                <p className="text-gray-700 text-lg leading-relaxed">{selectedProject.fullDescription}</p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Key Features</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {selectedProject.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Key Achievements</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {selectedProject.metrics.map((metric, index) => (
                    <div key={index} className="bg-blue-50 p-4 rounded-lg text-center">
                      <div className="text-blue-600 font-semibold">{metric}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Technologies Used</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.tech.map((tech, index) => (
                    <span key={index} className="px-4 py-2 bg-gray-100 text-gray-800 rounded-full font-medium">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                <a
                  href={selectedProject.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  Visit Website <ExternalLink className="w-5 h-5" />
                </a>
                <button
                  onClick={closeProjectModal}
                  className="flex-1 border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Development Approach */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Design and Development Approach</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Embark on a journey where innovation meets precision. Our approach isn't just a process; 
              it's a philosophy built on agility, collaboration, and client-centricity.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="animate-on-scroll card-hover bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-xl border border-blue-200">
              <Zap className="w-10 h-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-4">Agile Methodology</h3>
              <p className="text-gray-600">
                We embrace Agile as our cornerstone, fostering iterative and collaborative workflows 
                that ensure flexibility and adaptability in delivering evolving solutions.
              </p>
            </div>

            <div className="animate-on-scroll card-hover bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-xl border border-purple-200">
              <Users className="w-10 h-10 text-purple-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-4">User-Centered Design</h3>
              <p className="text-gray-600">
                Our commitment to UCD places users at the core of our development cycle, 
                analyzing behaviors and feedback to craft intuitive, resonant solutions.
              </p>
            </div>

            <div className="animate-on-scroll card-hover bg-gradient-to-br from-green-50 to-blue-50 p-8 rounded-xl border border-green-200">
              <Shield className="w-10 h-10 text-green-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-4">Test-Driven Development</h3>
              <p className="text-gray-600">
                Quality assurance is paramount. With TDD, we rigorously validate and refine 
                our codebase, ensuring robustness and reliability from the outset.
              </p>
            </div>

            <div className="animate-on-scroll card-hover bg-gradient-to-br from-yellow-50 to-orange-50 p-8 rounded-xl border border-yellow-200">
              <Rocket className="w-10 h-10 text-orange-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-4">CI/CD Pipeline</h3>
              <p className="text-gray-600">
                Efficiency and seamless deployment define our practices. We automate processes 
                for swift and consistent integration, testing, and deployment.
              </p>
            </div>

            <div className="animate-on-scroll card-hover bg-gradient-to-br from-pink-50 to-red-50 p-8 rounded-xl border border-pink-200">
              <Lightbulb className="w-10 h-10 text-pink-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-4">Rapid Prototyping</h3>
              <p className="text-gray-600">
                We employ rapid prototyping techniques to swiftly visualize and iterate 
                on concepts, expediting the path from idea to execution.
              </p>
            </div>

            <div className="animate-on-scroll card-hover bg-gradient-to-br from-indigo-50 to-blue-50 p-8 rounded-xl border border-indigo-200">
              <Target className="w-10 h-10 text-indigo-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-4">Thorough Testing</h3>
              <p className="text-gray-600">
                Our rigorous testing methodologies ensure quality assurance at every stage, 
                validating functionalities and performance for reliable solutions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-20 bg-gray-900">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-4xl font-bold text-white mb-4">Our Partners</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Trusted by leading organizations worldwide
            </p>
          </div>
          <div className="partners-grid">
            {partners.map((partner, index) => (
            <div key={index} className="animate-on-scroll">
              <div className="bg-white rounded-lg p-6 text-center border border-white/20 hover:bg-[#c7c5c5] transition-all duration-300">
                <img src={partner.logo} alt={partner.name} className="mx-auto h-16 object-contain mb-3" />
                <div className="text-black font-semibold">{partner.name}</div>
              </div>
            </div>
          ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Clients Say</h2>
            <p className="text-xl text-gray-600">Real feedback from real clients</p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-200 animate-on-scroll">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-2xl text-gray-700 mb-6 italic">
                  "{testimonials[currentTestimonial].content}"
                </blockquote>
                <div className="text-lg font-semibold text-gray-900">
                  {testimonials[currentTestimonial].name}
                </div>
                <div className="text-blue-600">
                  {testimonials[currentTestimonial].role}, {testimonials[currentTestimonial].company}
                </div>
              </div>
            </div>
            <div className="flex justify-center mt-6 gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentTestimonial ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-4xl font-bold text-white mb-4">Get In Touch</h2>
            <p className="text-xl text-gray-300">Ready to start your next project?</p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <form ref={form} onSubmit={sendEmail} className="animate-on-scroll bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold text-white mb-6">Leave a Message</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-300 mb-2">Name</label>
                  <input
                    type="text"
                    name="user_name"
                    required
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:border-blue-400"
                    placeholder="Your Name"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    name="user_email"
                    required
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:border-blue-400"
                    placeholder="your.email@example.com"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Message</label>
                  <textarea
                    name="message"
                    required
                    rows="5"
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:border-blue-400"
                    placeholder="Tell us about your project..."
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                >
                  Send Message
                </button>
              </div>
            </form>

            {/* Newsletter & Contact Info */}
            <div className="space-y-8">
              <form onSubmit={newsLetter} className="animate-on-scroll bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold text-white mb-6">Join Our Newsletter</h3>
                <div className="space-y-4">
                  <input
                    type="email"
                    name="user_email"
                    required
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:border-blue-400"
                    placeholder="your.email@example.com"
                  />
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
                  >
                    Subscribe
                  </button>
                </div>
              </form>

              <div className="animate-on-scroll bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold text-white mb-6">Contact Information</h3>
                <div className="space-y-4 text-gray-300">
                  <div>📧 timingotech@gmail.com</div>
                  <div>📞 +234 (902) 201-3174</div>
                  <div>📍 Lagos, Nigeria</div>
                  <div>🕒 Mon-Sat: 9:00 AM - 6:00 PM</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
 
    </div>
  );
};

export default Home;
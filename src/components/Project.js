import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, ArrowRight, Users, Target, Zap, Brain, Leaf, Calendar, Mail, Code, Globe, Github, ChevronRight, Award, TrendingUp, Shield } from 'lucide-react';

const Project = () => {
  const [animateOnLoad, setAnimateOnLoad] = useState(false);

  useEffect(() => {
    setAnimateOnLoad(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll('.animate-on-scroll');
      elements.forEach((el) => {
        const elementTop = el.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        if (elementTop < windowHeight * 0.85) {
          el.classList.add('show');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleEmailClick = () => {
    window.location.href = 'mailto:timingotech@gmail.com';
  };

  const projects = [
    {
      id: 'serenimind',
      title: 'SereniMind',
      category: 'Mental Health Tech',
      tagline: 'AI-Powered Mental Wellness Platform',
      description: 'Innovative mental wellness platform transforming self-care with AI-driven personalized support.',
      image: '🧠', // Using emoji as placeholder for images
      bgGradient: 'from-blue-500 to-purple-600',
      features: [
        'AI-powered mental health chatbot for personalized support',
        'Safe community platform for mental health discussions',
        'Customizable goal setting and mood tracking system',
        'Interactive exercises, games, and soothing soundscapes'
      ],
      metrics: {
        users: '10K+',
        rating: '4.8/5',
        sessions: '500K+'
      },
      technologies: ['React', 'Python', 'TensorFlow', 'Node.js', 'MongoDB'],
      website: 'https://serenimind.onrender.com',
      status: 'Live',
      achievements: [
        'Featured in Mental Health Innovation Awards 2024',
        '95% user satisfaction rate',
        'Reduced anxiety levels by 40% in clinical trials'
      ]
    },
    {
      id: 'vitaskr',
      title: 'Vitaskr',
      category: 'Productivity & Wellness',
      tagline: 'Corporate Mental Well-being & Task Management',
      description: 'Comprehensive platform integrating task management with employee well-being for enhanced productivity.',
      image: '📋',
      bgGradient: 'from-green-500 to-blue-600',
      features: [
        'AI-powered task manager with mental health integration',
        'Employee well-being tracking and analytics',
        'Team-building tools and stress-relief resources',
        'Personalized self-care routines powered by AI'
      ],
      metrics: {
        companies: '50+',
        employees: '25K+',
        efficiency: '+35%'
      },
      technologies: ['Vue.js', 'Django', 'PostgreSQL', 'Redis', 'AWS'],
      website: 'https://vitaskr-website.com',
      status: 'Live',
      achievements: [
        'Adopted by Fortune 500 companies',
        '35% improvement in employee productivity',
        'Winner of Corporate Wellness Tech Award 2024'
      ]
    },
    {
      id: 'agritos',
      title: 'Agritos',
      category: 'AgriTech',
      tagline: 'Sustainable Agriculture Technology',
      description: 'Revolutionary farming platform using AI for crop monitoring, resource optimization, and sustainable practices.',
      image: '🌱',
      bgGradient: 'from-green-600 to-yellow-500',
      features: [
        'AI-driven real-time crop monitoring systems',
        'Urban vertical farming solutions',
        'Water conservation and pesticide reduction',
        'Soil health optimization through smart crop rotation'
      ],
      metrics: {
        farms: '200+',
        yield: '+45%',
        water: '-30%'
      },
      technologies: ['React Native', 'IoT', 'Machine Learning', 'Azure', 'Python'],
      website: 'https://agritos-platform.com',
      status: 'Beta',
      achievements: [
        'Sustainable Farming Innovation Award 2024',
        '45% increase in crop yield',
        '30% reduction in water usage'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
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
        .card-hover {
          transition: all 0.3s ease;
        }
        .card-hover:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.15);
        }
        .gradient-text {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>

      {/* Header Section */}
      <section className="py-20 px-6  bg-gradient-to-br from-blue-900 via-purple-900 to-slate-900">
        <div className="max-w-7xl mx-auto text-center ">
          <div className="">
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
              Discover Our <span className="gradient-text">Projects</span>
            </h1>
            <p className="text-xl text-white max-w-3xl mx-auto mb-8">
              Explore our portfolio of innovative solutions that are transforming industries 
              and improving lives through cutting-edge technology and AI.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                to="/about" 
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center gap-2"
              >
                Learn About Us <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                to="/contact" 
                className="px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-all duration-300"
              >
                Start Your Project
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-20">
            {projects.map((project, index) => (
              <div 
                key={project.id} 
                className={`${index % 2 === 0 ? '' : 'lg:flex-row-reverse'} flex flex-col lg:flex-row items-center gap-12`}
              >
                {/* Project Image/Visual */}
                <div className="lg:w-1/2">
                  <div className={`card-hover relative bg-gradient-to-br ${project.bgGradient} rounded-2xl p-12 text-center min-h-[400px] flex items-center justify-center overflow-hidden`}>
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="relative z-10">
                      <div className="text-8xl mb-6">{project.image}</div>
                      <div className="text-white/90 text-lg font-medium">{project.category}</div>
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-4 ${
                        project.status === 'Live' ? 'bg-green-500/20 text-green-100' : 'bg-yellow-500/20 text-yellow-100'
                      }`}>
                        <div className={`w-2 h-2 rounded-full mr-2 ${
                          project.status === 'Live' ? 'bg-green-400' : 'bg-yellow-400'
                        }`}></div>
                        {project.status}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Project Details */}
                <div className="lg:w-1/2 space-y-8">
                  <div>
                    <h2 className="text-4xl font-bold text-gray-900 mb-3">{project.title}</h2>
                    <p className="text-xl text-blue-600 font-semibold mb-4">{project.tagline}</p>
                    <p className="text-gray-600 text-lg leading-relaxed">{project.description}</p>
                  </div>

                  {/* Key Features */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-blue-600" />
                      Key Features
                    </h3>
                    <ul className="space-y-3">
                      {project.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <ChevronRight className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-4">
                    {Object.entries(project.metrics).map(([key, value]) => (
                      <div key={key} className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-gray-900">{value}</div>
                        <div className="text-sm text-gray-600 capitalize">{key}</div>
                      </div>
                    ))}
                  </div>

                  {/* Technologies */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Code className="w-5 h-5 text-purple-600" />
                      Technologies
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, i) => (
                        <span key={i} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Achievements */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Award className="w-5 h-5 text-yellow-600" />
                      Key Achievements
                    </h3>
                    <ul className="space-y-2">
                      {project.achievements.map((achievement, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-700 text-sm">{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-4">
                    <a 
                      href={project.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center gap-2"
                    >
                      <Globe className="w-5 h-5" />
                      Visit Website
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <Link 
                      to={`/projects/${project.id}`}
                      className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-blue-600 hover:text-blue-600 transition-all duration-300 flex items-center gap-2"
                    >
                      View Case Study
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-900 to-purple-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-4xl font-bold text-white mb-4">Our Impact Across Industries</h2>
            <p className="text-xl text-blue-200">Numbers that tell our success story</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="animate-on-scroll text-center">
              <div className="text-5xl font-bold text-white mb-2">85K+</div>
              <div className="text-blue-200 text-lg">Total Users Served</div>
            </div>
            <div className="animate-on-scroll text-center">
              <div className="text-5xl font-bold text-white mb-2">250+</div>
              <div className="text-blue-200 text-lg">Organizations Helped</div>
            </div>
            <div className="animate-on-scroll text-center">
              <div className="text-5xl font-bold text-white mb-2">40%</div>
              <div className="text-blue-200 text-lg">Average Efficiency Gain</div>
            </div>
            <div className="animate-on-scroll text-center">
              <div className="text-5xl font-bold text-white mb-2">98%</div>
              <div className="text-blue-200 text-lg">Client Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center animate-on-scroll">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join the hundreds of organizations that have revolutionized their operations with our innovative solutions.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/contact"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Mail className="w-5 h-5" />
              Start Your Project
            </Link>
            
            <button
              onClick={handleEmailClick}
              className="px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Users className="w-5 h-5" />
              Join Our Team
            </button>
            
            <Link 
              to="/about"
              className="px-8 py-4 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Target className="w-5 h-5" />
              Learn More About Us
            </Link>
          </div>
        </div>
      </section>

      {/* Navigation Footer */}
      <section className="py-12 px-6 bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <Link 
              to="/about" 
              className="group p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
            >
              <Users className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">About Us</h3>
              <p className="text-gray-600 group-hover:text-blue-600 transition-colors">
                Learn about our mission, vision, and the team behind these innovations
              </p>
            </Link>
            
            <Link 
              to="/services" 
              className="group p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
            >
              <Code className="w-8 h-8 text-purple-600 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Our Services</h3>
              <p className="text-gray-600 group-hover:text-purple-600 transition-colors">
                Explore our comprehensive technology and AI solution offerings
              </p>
            </Link>
            
            <Link 
              to="/contact" 
              className="group p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
            >
              <Mail className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Get In Touch</h3>
              <p className="text-gray-600 group-hover:text-green-600 transition-colors">
                Ready to start your project? Let's discuss your requirements
              </p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Project;
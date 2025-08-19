import React, { useEffect, useState } from 'react';
import { Brain, Smartphone, Cloud, Database, Shield, Globe, ArrowRight, CheckCircle, Star, Users, Target, Zap, Code, Award, TrendingUp, ChevronRight, ExternalLink, Mail, Phone, X } from 'lucide-react';

const Services = () => {
  const [animateOnLoad, setAnimateOnLoad] = useState(false);
  const [activeService, setActiveService] = useState(null);

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

  const handleNavigation = (path) => {
    console.log(`Navigate to: ${path}`);
    alert(`Navigation to ${path} - In your app, use React Router's useNavigate() or Link component`);
  };

  const handleEmailClick = () => {
    window.location.href = 'mailto:hello@timingotech.com';
  };

  const handlePhoneClick = () => {
    window.location.href = 'tel:+2349022013174';
  };

  const services = [
    {
      id: 'ai-ml',
      icon: <Brain className="w-12 h-12" />,
      title: 'AI & Machine Learning',
      subtitle: 'Advanced AI solutions for business automation',
      description: 'Transform your business with cutting-edge artificial intelligence and machine learning solutions that automate processes, provide insights, and drive innovation.',
      features: [
        'Custom AI model development and training',
        'Natural Language Processing (NLP) solutions',
        'Computer Vision and image recognition',
        'Predictive analytics and forecasting',
        'Chatbots and virtual assistants',
        'Machine learning pipeline automation'
      ],
      technologies: ['TensorFlow', 'PyTorch', 'OpenAI', 'Scikit-learn', 'Hugging Face', 'AWS SageMaker'],
      useCases: [
        { title: 'Customer Service Automation', desc: 'AI-powered chatbots reducing response time by 80%' },
        { title: 'Predictive Maintenance', desc: 'ML models preventing equipment failures' },
        { title: 'Fraud Detection', desc: 'Real-time fraud prevention systems' }
      ],
      pricing: 'Starting from $15,000',
      timeline: '8-16 weeks',
      bgGradient: 'from-purple-600 to-blue-600'
    },
    {
      id: 'mobile-dev',
      icon: <Smartphone className="w-12 h-12" />,
      title: 'Mobile Development',
      subtitle: 'Native and cross-platform mobile applications',
      description: 'Create powerful, user-friendly mobile applications that engage your audience and drive business growth across iOS and Android platforms.',
      features: [
        'Native iOS and Android development',
        'Cross-platform React Native & Flutter apps',
        'Progressive Web Apps (PWAs)',
        'Mobile app UI/UX design',
        'App Store optimization and deployment',
        'Mobile backend and API integration'
      ],
      technologies: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Ionic', 'Xamarin'],
      useCases: [
        { title: 'E-commerce Apps', desc: 'Mobile-first shopping experiences' },
        { title: 'Healthcare Apps', desc: 'Patient management and telemedicine' },
        { title: 'Fintech Solutions', desc: 'Secure banking and payment apps' }
      ],
      pricing: 'Starting from $25,000',
      timeline: '12-20 weeks',
      bgGradient: 'from-green-600 to-blue-600'
    },
    {
      id: 'cloud-solutions',
      icon: <Cloud className="w-12 h-12" />,
      title: 'Cloud Solutions',
      subtitle: 'Scalable cloud infrastructure and migration',
      description: 'Modernize your infrastructure with scalable, secure, and cost-effective cloud solutions that grow with your business needs.',
      features: [
        'Cloud migration and modernization',
        'Multi-cloud and hybrid cloud architecture',
        'Serverless application development',
        'Container orchestration with Kubernetes',
        'Cloud security and compliance',
        'DevOps and CI/CD pipeline setup'
      ],
      technologies: ['AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Terraform'],
      useCases: [
        { title: 'Enterprise Migration', desc: 'Legacy system modernization to cloud' },
        { title: 'Auto-scaling Apps', desc: 'Applications that scale with demand' },
        { title: 'Disaster Recovery', desc: 'Robust backup and recovery solutions' }
      ],
      pricing: 'Starting from $20,000',
      timeline: '6-12 weeks',
      bgGradient: 'from-cyan-600 to-blue-600'
    },
    {
      id: 'data-analytics',
      icon: <Database className="w-12 h-12" />,
      title: 'Data Analytics',
      subtitle: 'Big data processing and business intelligence',
      description: 'Unlock the power of your data with comprehensive analytics solutions that provide actionable insights and drive informed decision-making.',
      features: [
        'Data warehouse design and implementation',
        'ETL pipeline development',
        'Real-time data processing and streaming',
        'Business intelligence dashboards',
        'Data visualization and reporting',
        'Advanced analytics and data science'
      ],
      technologies: ['Apache Spark', 'Hadoop', 'Tableau', 'Power BI', 'Apache Kafka', 'Snowflake'],
      useCases: [
        { title: 'Sales Analytics', desc: 'Revenue optimization through data insights' },
        { title: 'Customer Analytics', desc: 'Understanding customer behavior patterns' },
        { title: 'Operational Analytics', desc: 'Process optimization and efficiency gains' }
      ],
      pricing: 'Starting from $18,000',
      timeline: '10-16 weeks',
      bgGradient: 'from-orange-600 to-red-600'
    },
    {
      id: 'cybersecurity',
      icon: <Shield className="w-12 h-12" />,
      title: 'Cybersecurity',
      subtitle: 'Comprehensive security solutions and audits',
      description: 'Protect your digital assets with enterprise-grade security solutions, vulnerability assessments, and compliance frameworks.',
      features: [
        'Security audits and penetration testing',
        'Identity and access management (IAM)',
        'Network security and firewall configuration',
        'Compliance frameworks (SOC2, GDPR, HIPAA)',
        'Incident response and disaster recovery',
        'Security awareness training'
      ],
      technologies: ['Splunk', 'CrowdStrike', 'Okta', 'AWS Security', 'Nessus', 'Metasploit'],
      useCases: [
        { title: 'Financial Security', desc: 'Banking-grade security implementations' },
        { title: 'Healthcare Compliance', desc: 'HIPAA-compliant system security' },
        { title: 'Enterprise Protection', desc: 'Multi-layered security architectures' }
      ],
      pricing: 'Starting from $12,000',
      timeline: '4-8 weeks',
      bgGradient: 'from-red-600 to-pink-600'
    },
    {
      id: 'web-development',
      icon: <Globe className="w-12 h-12" />,
      title: 'Web Development',
      subtitle: 'Modern, responsive web applications',
      description: 'Build cutting-edge web applications that deliver exceptional user experiences and drive business growth across all devices.',
      features: [
        'Custom web application development',
        'E-commerce platform development',
        'Content management systems (CMS)',
        'API development and integration',
        'Performance optimization and SEO',
        'Responsive design and accessibility'
      ],
      technologies: ['React', 'Next.js', 'Node.js', 'Django', 'Laravel', 'Vue.js'],
      useCases: [
        { title: 'Corporate Websites', desc: 'Professional business presence online' },
        { title: 'SaaS Platforms', desc: 'Scalable software-as-a-service solutions' },
        { title: 'E-commerce Sites', desc: 'High-converting online stores' }
      ],
      pricing: 'Starting from $10,000',
      timeline: '8-14 weeks',
      bgGradient: 'from-indigo-600 to-purple-600'
    }
  ];

  const processSteps = [
    {
      step: '01',
      title: 'Discovery & Planning',
      description: 'We analyze your requirements, define project scope, and create a detailed roadmap.',
      icon: <Target className="w-8 h-8" />
    },
    {
      step: '02',
      title: 'Design & Architecture',
      description: 'Our team designs the solution architecture and creates user-centered designs.',
      icon: <Code className="w-8 h-8" />
    },
    {
      step: '03',
      title: 'Development & Testing',
      description: 'We build your solution using agile methodologies with continuous testing.',
      icon: <Zap className="w-8 h-8" />
    },
    {
      step: '04',
      title: 'Deployment & Support',
      description: 'We deploy your solution and provide ongoing support and maintenance.',
      icon: <Award className="w-8 h-8" />
    }
  ];

  const selectedService = services.find(service => service.id === activeService);

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
        .service-card {
          transition: all 0.3s ease;
        }
        .service-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        .modal-overlay {
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
        }
        .modal-content {
          max-height: 90vh;
          overflow-y: auto;
        }
      `}</style>

      {/* Hero Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-blue-900 via-purple-900 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <div className="">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">
              Our Core <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Services</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-8">
              Comprehensive technology solutions designed to accelerate your digital transformation 
              and drive innovation across every aspect of your business.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button 
                onClick={() => handleNavigation('/contact')}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center gap-2"
              >
                Get Started Today <ArrowRight className="w-5 h-5" />
              </button>
              <button 
                onClick={() => handleNavigation('/projects')}
                className="px-8 py-4 border-2 border-white/30 text-white rounded-lg font-semibold hover:bg-white/10 transition-all duration-300"
              >
                View Our Work
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div 
                key={service.id} 
                className="service-card bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`bg-gradient-to-br ${service.bgGradient} p-8 text-white`}>
                  <div className="text-white/90 mb-4">{service.icon}</div>
                  <h3 className="text-2xl font-bold mb-2">{service.title}</h3>
                  <p className="text-white/90">{service.subtitle}</p>
                </div>
                
                <div className="p-8">
                  <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
                  
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Key Features:</h4>
                    <ul className="space-y-2">
                      {service.features.slice(0, 3).map((feature, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600 text-sm">{feature}</span>
                        </li>
                      ))}
                      {service.features.length > 3 && (
                        <li className="text-blue-600 text-sm font-medium">
                          +{service.features.length - 3} more features
                        </li>
                      )}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between mb-6 text-sm">
                    <div>
                      <div className="text-gray-500">Starting from</div>
                      <div className="font-bold text-gray-900">{service.pricing}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-gray-500">Timeline</div>
                      <div className="font-bold text-gray-900">{service.timeline}</div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setActiveService(service.id)}
                    className={`w-full bg-gradient-to-r ${service.bgGradient} text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2`}
                  >
                    Learn More <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal */}
      {activeService && selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full modal-content">
            <div className={`bg-gradient-to-br ${selectedService.bgGradient} p-8 text-white rounded-t-2xl relative`}>
              <button
                onClick={() => setActiveService(null)}
                className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="flex items-center gap-4 mb-4">
                <div className="text-white/90">{selectedService.icon}</div>
                <div>
                  <h3 className="text-3xl font-bold">{selectedService.title}</h3>
                  <p className="text-white/90">{selectedService.subtitle}</p>
                </div>
              </div>
            </div>
            
            <div className="p-8">
              <p className="text-gray-600 mb-8 text-lg leading-relaxed">{selectedService.description}</p>
              
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4 text-lg">All Features:</h4>
                  <div className="space-y-3">
                    {selectedService.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-4 text-lg">Technologies:</h4>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {selectedService.technologies.map((tech, i) => (
                      <span key={i} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <h4 className="font-semibold text-gray-900 mb-4 text-lg">Use Cases:</h4>
                  <div className="space-y-4">
                    {selectedService.useCases.map((useCase, i) => (
                      <div key={i} className="border-l-4 border-blue-500 pl-4">
                        <div className="font-medium text-gray-900">{useCase.title}</div>
                        <div className="text-gray-600">{useCase.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mb-8 p-6 bg-gray-50 rounded-lg">
                <div>
                  <div className="text-gray-500 mb-1">Starting from</div>
                  <div className="font-bold text-2xl text-gray-900">{selectedService.pricing}</div>
                </div>
                <div className="text-right">
                  <div className="text-gray-500 mb-1">Timeline</div>
                  <div className="font-bold text-2xl text-gray-900">{selectedService.timeline}</div>
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => handleNavigation('/contact')}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Get Quote
                </button>
                <button 
                  onClick={() => handleNavigation('/projects')}
                  className="flex-1 border border-blue-600 text-blue-600 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                >
                  View Examples
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Process Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Development Process</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A proven methodology that ensures successful project delivery every time
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <div key={index} className="animate-on-scroll text-center">
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white mx-auto mb-4">
                    {step.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-6 bg-gradient-to-br from-gray-900 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-4xl font-bold mb-4">Why Choose TimingoTech?</h2>
            <p className="text-xl text-blue-200">The advantages that set us apart</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="animate-on-scroll text-center">
              <Users className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">Expert Team</h3>
              <p className="text-gray-300">50+ certified professionals with proven industry experience</p>
            </div>
            
            <div className="animate-on-scroll text-center">
              <Award className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">Proven Track Record</h3>
              <p className="text-gray-300">500+ successful projects delivered across various industries</p>
            </div>
            
            <div className="animate-on-scroll text-center">
              <TrendingUp className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">Measurable Results</h3>
              <p className="text-gray-300">Average 40% efficiency improvement for our clients</p>
            </div>
            
            <div className="animate-on-scroll text-center">
              <Shield className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">Enterprise Security</h3>
              <p className="text-gray-300">Bank-grade security and compliance standards</p>
            </div>
            
            <div className="animate-on-scroll text-center">
              <Zap className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">Agile Delivery</h3>
              <p className="text-gray-300">Fast, iterative development with continuous feedback</p>
            </div>
            
            <div className="animate-on-scroll text-center">
              <Globe className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">Global Reach</h3>
              <p className="text-gray-300">24/7 support across multiple time zones</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center animate-on-scroll">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Let's discuss how our services can accelerate your digital transformation and drive growth.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleEmailClick}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Mail className="w-5 h-5" />
              hello@timingotech.com
            </button>
            
            <button
              onClick={handlePhoneClick}
              className="px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Phone className="w-5 h-5" />
              +234-90-220-13174
            </button>
          </div>

          <div className="mt-12 p-6 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">What You Get:</h3>
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div>
                <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <div className="font-medium">Free Consultation</div>
                <div className="text-sm text-gray-600">30-minute strategy session</div>
              </div>
              <div>
                <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <div className="font-medium">Custom Proposal</div>
                <div className="text-sm text-gray-600">Tailored solution roadmap</div>
              </div>
              <div>
                <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <div className="font-medium">No Obligation</div>
                <div className="text-sm text-gray-600">Complete transparency</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
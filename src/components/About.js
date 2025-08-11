import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Target, Zap, Brain, Leaf, Calendar, Mail, Code, Globe, Github, ChevronRight, Award, TrendingUp, Shield, Lightbulb, Heart, Rocket } from 'lucide-react';

const About = () => {
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

  const values = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Innovation First",
      description: "We push the boundaries of technology to create groundbreaking solutions that transform industries and improve lives.",
      color: "text-blue-600"
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Human-Centered",
      description: "Every solution we build puts human needs at the center, ensuring technology serves people, not the other way around.",
      color: "text-red-600"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Trust & Security",
      description: "We prioritize data security and privacy, building trust through transparent practices and robust protection measures.",
      color: "text-green-600"
    },
    {
      icon: <Rocket className="w-8 h-8" />,
      title: "Excellence Driven",
      description: "We strive for excellence in every project, delivering high-quality solutions that exceed expectations and drive results.",
      color: "text-purple-600"
    }
  ];

  const stats = [
    { number: "85K+", label: "Lives Impacted", icon: <Users className="w-6 h-6" /> },
    { number: "250+", label: "Organizations Served", icon: <Target className="w-6 h-6" /> },
    { number: "98%", label: "Client Satisfaction", icon: <Award className="w-6 h-6" /> },
    { number: "40%", label: "Average Efficiency Gain", icon: <TrendingUp className="w-6 h-6" /> }
  ];

  const milestones = [
    {
      year: "2020",
      title: "Company Founded",
      description: "Timingotech was established with a vision to solve global challenges through innovative AI solutions."
    },
    {
      year: "2021",
      title: "First Major Platform",
      description: "Launched SereniMind, our breakthrough mental health platform that would go on to help thousands."
    },
    {
      year: "2022",
      title: "Corporate Expansion",
      description: "Introduced Vitaskr, expanding our reach to enterprise clients and corporate wellness programs."
    },
    {
      year: "2023",
      title: "AgriTech Innovation",
      description: "Launched Agritos, revolutionizing sustainable agriculture with AI-powered farming solutions."
    },
    {
      year: "2024",
      title: "Industry Recognition",
      description: "Received multiple awards for innovation in mental health, corporate wellness, and sustainable agriculture."
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

      {/* Hero Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-blue-900 via-purple-900 to-slate-900">
        <div className="max-w-7xl mx-auto text-center">
          <div className={`animate-on-scroll ${animateOnLoad ? 'show' : ''}`}>
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
              About <span className="gradient-text">Timingotech</span>
            </h1>
            <p className="text-xl text-white max-w-3xl mx-auto mb-8">
              We're a forward-thinking technology company dedicated to solving global challenges through innovative AI solutions, transforming industries and improving lives worldwide.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                to="/projects" 
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center gap-2"
              >
                View Our Work <ChevronRight className="w-5 h-5" />
              </Link>
              <Link 
                to="/contact" 
                className="px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-all duration-300"
              >
                Get In Touch
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16">
            <div className={`animate-left ${animateOnLoad ? 'show' : ''}`}>
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-1 rounded-2xl">
                <div className="bg-white p-8 rounded-2xl h-full">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Target className="w-8 h-8 text-blue-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
                  </div>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    To harness the transformative power of artificial intelligence and cutting-edge technology to address the world's most pressing challenges. We create innovative solutions that not only solve problems but also empower individuals, organizations, and communities to thrive in an increasingly digital world.
                  </p>
                </div>
              </div>
            </div>

            <div className={`animate-right ${animateOnLoad ? 'show' : ''}`}>
              <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-1 rounded-2xl">
                <div className="bg-white p-8 rounded-2xl h-full">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <Lightbulb className="w-8 h-8 text-purple-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">Our Vision</h2>
                  </div>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    To be the global leader in AI-powered solutions that create meaningful impact across industries. We envision a future where technology seamlessly integrates with human needs, fostering innovation, sustainability, and well-being for all.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-900 to-purple-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-4xl font-bold text-white mb-4">Our Impact in Numbers</h2>
            <p className="text-xl text-blue-200">Measurable results that drive meaningful change</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="animate-on-scroll text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-white/10 rounded-full text-white">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-4xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-blue-200 text-lg">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-600">The principles that guide everything we do</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="animate-on-scroll card-hover bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <div className={`${value.color} mb-6`}>
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-700 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Journey</h2>
            <p className="text-xl text-gray-600">Key milestones in our growth and innovation</p>
          </div>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-px bg-blue-600"></div>
            
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className="animate-on-scroll flex items-start gap-8">
                  <div className="flex-shrink-0 w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg relative z-10">
                    {milestone.year.slice(-2)}
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100 flex-grow">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-bold text-gray-900">{milestone.title}</h3>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-medium">
                        {milestone.year}
                      </span>
                    </div>
                    <p className="text-gray-700">{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center animate-on-scroll">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Transform Your Industry?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join us in shaping the future through innovative AI solutions. Let's build something extraordinary together.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/contact"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Mail className="w-5 h-5" />
              Start a Project
            </Link>
            
            <Link 
              to="/projects"
              className="px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Globe className="w-5 h-5" />
              View Our Work
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
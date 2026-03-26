import React, { useEffect, useState, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { ArrowRight, Check, X, Zap, Target, Users, TrendingUp, Clock, Shield, Sparkles, Calendar, MessageSquare, Filter, BarChart3, ChevronRight, Loader2, CheckCircle } from 'lucide-react';

const TimingoFlow = () => {
  const [animateOnLoad, setAnimateOnLoad] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null
  const demoForm = useRef();

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

  const scrollToDemo = () => {
    document.getElementById('demo-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDemoSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    const formData = new FormData(demoForm.current);
    const payload = {
      name: formData.get('demo_name'),
      email: formData.get('demo_email'),
      phone: formData.get('demo_phone'),
      industry: formData.get('demo_industry'),
    };

    try {
      await axios.post('/api/demo', payload, {
        headers: { 'Content-Type': 'application/json' }
      });

      setSubmitStatus('success');
      demoForm.current.reset();

      setTimeout(() => {
        setSubmitStatus(null);
      }, 5000);
    } catch (error) {
      console.error('Demo submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const howItWorks = [
    {
      icon: <Target className="w-10 h-10" />,
      title: 'Capture',
      description: 'AI scrapes 1000+ qualified leads from your target market in minutes'
    },
    {
      icon: <Filter className="w-10 h-10" />,
      title: 'Qualify',
      description: 'AI filters and scores leads automatically based on your ideal client profile'
    },
    {
      icon: <Zap className="w-10 h-10" />,
      title: 'Convert',
      description: 'AI crafts personalized messages that get responses and book meetings'
    },
    {
      icon: <Sparkles className="w-10 h-10" />,
      title: 'Automate',
      description: 'AI sends personalized messages to thousands of leads automatically—no manual work'
    }
  ];

  const features = [
    { icon: <Calendar className="w-6 h-6" />, text: 'Up to 7,500 leads/month' },
    { icon: <Filter className="w-6 h-6" />, text: 'AI qualification & scoring' },
    { icon: <MessageSquare className="w-6 h-6" />, text: '300 AI-assisted messages/day' },
    { icon: <Users className="w-6 h-6" />, text: 'Kanban board management' },
    { icon: <Clock className="w-6 h-6" />, text: 'Automated follow-up system' },
    { icon: <TrendingUp className="w-6 h-6" />, text: 'Full analytics & tracking' }
  ];

  const useCases = [
    'Freelancers',
    'Small Businesses',
    'Veterinary Clinics',
    'Healthcare Providers',
    'Consultants & Coaches',
    'Service Businesses',
    'Agencies'
  ];

  const results = [
    { stat: 'Up to 7,500 Leads/Month', desc: 'Capture and manage thousands of leads automatically' },
    { stat: 'AI-Assisted Messaging', desc: 'Up to 300 personalized messages per day' },
    { stat: 'Smart Organization', desc: 'Kanban boards, pipelines, and lead tracking' },
    { stat: 'Automated Follow-ups', desc: 'Never miss a lead with smart reminders' }
  ];

  const pricingTiers = [
    {
      name: 'Starter',
      subtitle: 'Best for individuals and small teams getting started',
      price: '$99',
      period: '/month',
      description: 'Perfect for getting started with lead management and AI assistance.',
      features: [
        'Up to 50 leads/day',
        'Up to 1,500 leads/month',
        'Up to 1,500 stored leads',
        'Up to 30 AI-assisted messages/day',
        'Up to 5 pipelines (folders)',
        'Lead capture + basic qualification',
        'Basic booking & inquiry flow',
        'Kanban pipeline board',
        'Lead history & reminders',
        'Event tracking',
        'Pop-up capture forms',
        'Basic analytics dashboard'
      ],
      outcome: 'Capture and manage leads efficiently with essential AI support.',
      highlighted: false
    },
    {
      name: 'Growth',
      subtitle: 'For businesses scaling lead generation',
      price: '$249',
      period: '/month',
      badge: 'Most Popular',
      description: 'Scale your lead generation with more volume and advanced features.',
      features: [
        'Up to 120 leads/day',
        'Up to 3,500 leads/month',
        'Up to 5,000 stored leads',
        'Up to 120 AI-assisted messages/day',
        'Up to 15 pipelines (folders)',
        'Advanced qualification flows',
        'Lead filtering & smart routing',
        'Automated follow-up system',
        'Kanban pipeline board',
        'Full analytics dashboard',
        'Smart reminders',
        'Event tracking',
        'Pop-up + embedded capture forms'
      ],
      outcome: 'Generate and convert more leads with automation and smarter workflows.',
      highlighted: true
    },
    {
      name: 'Pro',
      subtitle: 'For high-growth teams and advanced operations',
      price: '$499',
      period: '/month',
      description: 'Enterprise-grade features for teams that need maximum capacity.',
      features: [
        'Up to 250 leads/day',
        'Up to 7,500 leads/month',
        'Up to 15,000 stored leads',
        'Up to 300 AI-assisted messages/day',
        'Unlimited pipelines',
        'Multi-step conversion funnels',
        'Advanced automation & routing',
        'Fully optimized client journey',
        'Advanced analytics & reporting',
        'Smart reminders + scheduling',
        'Event tracking',
        'Pop-up + embedded + API capture',
        'Priority support'
      ],
      outcome: 'Scale lead generation and conversions with full automation and maximum capacity.',
      highlighted: false
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>TimingoFlow - Get 1000+ Leads & AI-Powered Outreach in 5 Clicks | Timingotech</title>
        <meta name="description" content="AI-powered lead generation and outreach for freelancers and small businesses. Get 1000+ qualified leads, send personalized messages automatically. Setup in under 5 minutes." />
        <meta name="keywords" content="AI lead generation, automated outreach, personalized messages, lead scraping, freelancer leads, small business marketing, TimingoFlow" />
        <link rel="canonical" href="https://www.timingotech.com/timingoflow" />
      </Helmet>

      <style jsx>{`
        .animate-on-scroll {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .animate-on-scroll.show {
          opacity: 1;
          transform: translateY(0);
        }
        .flow-gradient {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .flow-gradient-soft {
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
        }
      `}</style>

      {/* Hero Section */}
      <section className="relative overflow-hidden flow-gradient py-20 md:py-32">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className={`text-center space-y-8 ${animateOnLoad ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} transition-all duration-1000`}>
            <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-4">
              By Timingotech
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
              Get Leads. Send AI-Powered Messages.<br />Book Clients. All in 5 Clicks.
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              AI-powered lead generation and automated outreach system. Set up in under 5 minutes. Get 1000+ qualified leads, send personalized messages, and book clients—all on autopilot.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <button 
                onClick={scrollToDemo}
                className="group px-8 py-4 bg-white text-purple-600 rounded-lg font-semibold text-lg hover:bg-gray-50 transition-all duration-300 flex items-center gap-2 shadow-xl hover:shadow-2xl transform hover:scale-105"
              >
                Book a Demo
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-lg font-semibold text-lg hover:bg-white/20 transition-all duration-300 border border-white/30"
              >
                View How It Works
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Freelancers & Small Businesses Are Stuck
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Spending hours on manual outreach with little to show for it
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              { icon: <X className="w-6 h-6" />, title: 'Manual lead hunting', desc: 'Spending hours finding leads on LinkedIn and Google with no system' },
              { icon: <X className="w-6 h-6" />, title: 'Copy-paste messages', desc: 'Sending the same generic message to everyone and getting ignored' },
              { icon: <X className="w-6 h-6" />, title: 'No follow-up system', desc: 'Forgetting to follow up and losing warm leads constantly' },
              { icon: <X className="w-6 h-6" />, title: 'Low response rates', desc: 'Getting 1-2% response rates because outreach isn\'t personalized' }
            ].map((problem, idx) => (
              <div key={idx} className="animate-on-scroll bg-white p-6 rounded-xl border border-red-100 hover:border-red-200 transition-all">
                <div className="flex items-start gap-4">
                  <div className="text-red-500 mt-1">{problem.icon}</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">{problem.title}</h3>
                    <p className="text-gray-600">{problem.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16 animate-on-scroll">
            <div className="inline-block px-4 py-2 flow-gradient-soft rounded-full text-purple-600 text-sm font-medium mb-4">
              AI-Powered Solution
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              TimingoFlow: AI That Gets You Clients
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Set up in 5 clicks, under 5 minutes. Our AI scrapes thousands of qualified leads, writes personalized messages, and sends them automatically. You just watch the bookings roll in.
            </p>
          </div>

          <div className="animate-on-scroll bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8 md:p-12 border border-purple-100">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-5xl font-bold text-purple-600 mb-2">3,000+</div>
                <div className="text-gray-700">Leads per month (Growth plan)</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-purple-600 mb-2">AI-Powered</div>
                <div className="text-gray-700">Automated messaging & qualification</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-purple-600 mb-2">5 min</div>
                <div className="text-gray-700">Quick setup, instant results</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              How It Works: 4 Steps, 5 Clicks, Under 5 Minutes
            </h2>
            <p className="text-xl text-gray-600">AI handles everything from lead generation to personalized outreach</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {howItWorks.map((step, idx) => (
              <div key={idx} className="animate-on-scroll">
                <div className="bg-white rounded-2xl p-6 h-full hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                  <div className="flow-gradient-soft rounded-xl p-4 inline-block mb-4 group-hover:scale-110 transition-transform">
                    <div className="text-purple-600">{step.icon}</div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-3">{step.title}</div>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              What You Get
            </h2>
            <p className="text-xl text-gray-600">Everything you need to convert more visitors into clients</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {features.map((feature, idx) => (
              <div key={idx} className="animate-on-scroll bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-all border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="text-purple-600 bg-purple-100 p-2 rounded-lg">
                    {feature.icon}
                  </div>
                  <span className="font-semibold text-gray-900">{feature.text}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Built For Freelancers, Small Businesses & Service Providers
            </h2>
            <p className="text-xl text-gray-600">Trusted by professionals who need clients, not complexity</p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto animate-on-scroll">
            {useCases.map((useCase, idx) => (
              <div key={idx} className="px-6 py-3 bg-white rounded-full border border-purple-200 text-gray-700 font-medium hover:border-purple-400 hover:shadow-md transition-all">
                {useCase}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              The Results You'll See
            </h2>
            <p className="text-xl text-gray-600">Real outcomes that matter to your business</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {results.map((result, idx) => (
              <div key={idx} className="animate-on-scroll text-center p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border border-purple-100">
                <div className="text-2xl font-bold text-purple-600 mb-2">{result.stat}</div>
                <p className="text-gray-700">{result.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Simple Monthly Pricing
            </h2>
            <p className="text-xl text-gray-600">Choose the plan that fits your lead volume. Cancel anytime.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {pricingTiers.map((tier, idx) => (
              <div key={idx} className={`animate-on-scroll bg-white rounded-2xl p-8 border-2 ${tier.highlighted ? 'border-purple-500 shadow-2xl scale-105' : 'border-gray-200'} relative`}>
                {tier.badge && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="px-4 py-1 bg-purple-500 text-white text-sm font-semibold rounded-full">
                      {tier.badge}
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{tier.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{tier.subtitle}</p>
                  <div className="text-5xl font-bold text-gray-900 mb-2">
                    {tier.price}
                    <span className="text-lg font-normal text-gray-600"> {tier.period}</span>
                  </div>
                  <p className="text-gray-600 text-sm">{tier.description}</p>
                </div>

                <ul className="space-y-3 mb-6">
                  {tier.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="bg-purple-50 rounded-lg p-4 mb-6">
                  <p className="text-sm font-semibold text-purple-900 mb-1">Outcome:</p>
                  <p className="text-sm text-gray-700">{tier.outcome}</p>
                </div>

                <button 
                  onClick={scrollToDemo}
                  className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${
                    tier.highlighted 
                      ? 'flow-gradient text-white hover:shadow-lg' 
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>

          {/* What's Included */}
          <div className="animate-on-scroll max-w-3xl mx-auto bg-white rounded-2xl p-8 border border-gray-200">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Every Plan Includes</h3>
              <p className="text-gray-600">Core features available across all tiers</p>
            </div>
            <ul className="grid md:grid-cols-2 gap-3 mb-6">
              {['Kanban board management', 'Lead capture & qualification', 'Analytics & tracking', 'Event tracking', 'AI-assisted messaging', 'Pop-up capture forms'].map((item, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Add-ons */}
          <div className="animate-on-scroll mt-8 text-center space-y-2">
            <p className="text-gray-600">
              <strong>Need more?</strong> Custom lead limits available • Enterprise solutions • API access • White-label options
            </p>
          </div>

          {/* Positioning Line */}
          <div className="animate-on-scroll mt-12 text-center space-y-2 max-w-2xl mx-auto">
            <p className="text-lg text-gray-700 font-medium">
              Simple monthly subscription. Cancel anytime.
            </p>
            <p className="text-gray-600">
              Start capturing and converting leads with AI-powered automation today.
            </p>
          </div>
        </div>
      </section>

      {/* Demo CTA Section */}
      <section id="demo-section" className="py-20 flow-gradient">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center text-white space-y-8 animate-on-scroll">
            <h2 className="text-4xl md:text-5xl font-bold">
              Ready to Manage Leads Like a Pro?
            </h2>
            <p className="text-xl text-white/90">
              Book a quick 10-minute demo. See how TimingoFlow helps you capture, qualify, and convert leads with AI-powered automation.
            </p>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md mx-auto border border-white/20">
              <form ref={demoForm} onSubmit={handleDemoSubmit} className="space-y-4">
                <input 
                  type="text" 
                  name="demo_name"
                  placeholder="Your Name" 
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/90 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
                />
                <input 
                  type="email" 
                  name="demo_email"
                  placeholder="Email Address" 
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/90 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
                />
                <input 
                  type="tel" 
                  name="demo_phone"
                  placeholder="Phone (optional)" 
                  className="w-full px-4 py-3 rounded-lg bg-white/90 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
                />
                <input 
                  type="text" 
                  name="demo_industry"
                  placeholder="Your Industry" 
                  className="w-full px-4 py-3 rounded-lg bg-white/90 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
                />
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-white text-purple-600 rounded-lg font-semibold text-lg hover:bg-gray-50 transition-all duration-300 flex items-center justify-center gap-2 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Book 10-Minute Demo
                      <ChevronRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                {/* Success Message */}
                {submitStatus === 'success' && (
                  <div className="flex items-center gap-2 p-4 bg-green-500 text-white rounded-lg">
                    <CheckCircle className="w-5 h-5" />
                    <span>Demo request sent! We'll contact you within 24 hours.</span>
                  </div>
                )}

                {/* Error Message */}
                {submitStatus === 'error' && (
                  <div className="flex items-center gap-2 p-4 bg-red-500 text-white rounded-lg">
                    <X className="w-5 h-5" />
                    <span>Something went wrong. Please try again or email us directly.</span>
                  </div>
                )}
              </form>
            </div>

            <p className="text-white/80 text-sm">
              No pressure. No hard sell. Just see how AI can 10x your outreach in 5 minutes.
            </p>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center space-y-8 animate-on-scroll">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              AI-Powered. Simple. Built For Results.
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8 pt-8">
              <div className="text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">No Complex Setup</h3>
                <p className="text-gray-600">5 clicks, under 5 minutes. That's it.</p>
              </div>
              
              <div className="text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">AI Does The Work</h3>
                <p className="text-gray-600">Automated lead gen and personalized outreach</p>
              </div>
              
              <div className="text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Built For Freelancers</h3>
                <p className="text-gray-600">Perfect for solopreneurs and small teams</p>
              </div>
            </div>

            <div className="pt-8 border-t border-gray-200">
              <p className="text-gray-600">
                A product by <span className="font-semibold text-purple-600">Timingotech</span> — AI-powered systems that get you clients, not complexity.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TimingoFlow;

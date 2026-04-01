import React, { useEffect, useState, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { ArrowRight, Check, X, Target, Users, TrendingUp, Clock, Shield, Calendar, MessageSquare, BarChart3, ChevronRight, Loader2, CheckCircle } from 'lucide-react';

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
      title: 'Step 1',
      description: 'We find businesses already needing your service'
    },
    {
      icon: <MessageSquare className="w-10 h-10" />,
      title: 'Step 2',
      description: 'We contact them with personalized outreach'
    },
    {
      icon: <Users className="w-10 h-10" />,
      title: 'Step 3',
      description: 'They respond and book with you'
    },
    {
      icon: <Check className="w-10 h-10" />,
      title: 'Step 4',
      description: 'You close the deal'
    }
  ];

  const features = [
    { icon: <Users className="w-6 h-6" />, text: 'Find qualified clients automatically' },
    { icon: <MessageSquare className="w-6 h-6" />, text: 'Personalized outreach at scale' },
    { icon: <Calendar className="w-6 h-6" />, text: 'Book meetings on autopilot' },
    { icon: <TrendingUp className="w-6 h-6" />, text: 'Track results & ROI' },
    { icon: <Clock className="w-6 h-6" />, text: 'Consistent client pipeline' },
    { icon: <Check className="w-6 h-6" />, text: 'Simple setup, no complexity' }
  ];

  const useCases = [
    'Marketing Agencies',
    'Web Design Agencies',
    'SEO Agencies',
    'Consultants',
    'Service Businesses',
    'Growth Teams'
  ];

  const results = [
    { stat: '10-30 Clients/Month', desc: 'Consistent new business every month' },
    { stat: 'Qualified Leads', desc: 'Businesses already looking for your service' },
    { stat: 'Personalized Outreach', desc: 'Messages that get responses, not ignored' },
    { stat: 'Automated Pipeline', desc: 'System runs while you focus on closing' }
  ];

  const pricingTiers = [
    {
      name: 'Starter',
      subtitle: 'Best for solo agencies and consultants',
      price: '$99',
      period: '/month',
      description: 'Start building a consistent client pipeline.',
      features: [
        'Up to 50 leads/day',
        'Up to 1,500 leads/month',
        'Up to 1,500 stored leads',
        '50 AI prompt credits/month',
        '20 AI chats/month',
        '5 saved workflows',
        'Up to 30 AI-assisted messages/day',
        'Multi-channel outreach',
        'API access',
        'Analytics dashboard (standard)',
        'Up to 5 pipelines',
        'Basic qualification + booking',
        'Kanban board',
        'Pop-up capture'
      ],
      outcome: 'Get your first 5-10 qualified clients per month.',
      highlighted: false
    },
    {
      name: 'Growth',
      subtitle: 'For agencies scaling to 6-7 figures',
      price: '$249',
      period: '/month',
      badge: 'Most Popular',
      description: 'Scale your agency with more clients and automation.',
      features: [
        'Up to 120 leads/day',
        'Up to 3,500 leads/month',
        'Up to 5,000 stored leads',
        '250 AI prompt credits/month',
        '100 AI chats/month',
        '20 saved workflows',
        'Up to 120 AI-assisted messages/day',
        'Multi-channel outreach',
        'API access',
        'Full analytics dashboard',
        'Up to 15 pipelines',
        'Advanced qualification',
        'Smart routing',
        'Automated follow-ups',
        'Embedded + pop-up capture'
      ],
      outcome: 'Get 15-20 qualified clients per month consistently.',
      highlighted: true
    },
    {
      name: 'Pro',
      subtitle: 'For multi-6-figure and 7-figure agencies',
      price: '$499',
      period: '/month',
      description: 'Enterprise-grade client acquisition for growing agencies.',
      features: [
        'Up to 250 leads/day',
        'Up to 7,500 leads/month',
        'Up to 15,000 stored leads',
        '700 AI prompt credits/month',
        'Unlimited AI chats',
        'Unlimited workflows',
        'Up to 300 AI-assisted messages/day',
        'Multi-channel outreach',
        'API access',
        'Advanced analytics & reporting',
        'Unlimited pipelines',
        'Multi-step funnels',
        'Advanced automation + routing',
        'Full client journey optimization',
        'API + webhooks + integrations',
        'Priority support'
      ],
      outcome: 'Get 25-30+ qualified clients per month at scale.',
      highlighted: false
    }
  ];

  const addOns = [
    {
      category: 'Extra AI Prompt Credits',
      description: 'Your #1 revenue driver - essential if your AI is doing the heavy lifting',
      options: [
        { amount: '+100 prompts', price: '$29' },
        { amount: '+300 prompts', price: '$79' },
        { amount: '+1,000 prompts', price: '$199' }
      ]
    },
    {
      category: 'Extra AI Sessions (Chats)',
      description: 'Important for users running multiple campaigns',
      options: [
        { amount: '+50 AI sessions', price: '$19' },
        { amount: '+200 AI sessions', price: '$59' }
      ]
    },
    {
      category: 'Lead Boost (Volume Add-on)',
      description: 'For agencies and heavy users needing more lead capacity',
      options: [
        { amount: '+1,000 leads/month', price: '$49' },
        { amount: '+5,000 leads/month', price: '$199' }
      ]
    },
    {
      category: 'Email Sending / Outreach Credits',
      description: 'More outreach = more results. Direct value alignment.',
      options: [
        { amount: '+1,000 emails', price: '$29' },
        { amount: '+5,000 emails', price: '$99' }
      ]
    },
    {
      category: 'Advanced Automation Pack',
      description: 'Unlock complex workflows, conditional logic, and deeper routing rules',
      options: [
        { amount: 'Full automation suite', price: '$99/month' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>TimingoFlow - Get 10-30 Qualified Clients Every Month | Client Acquisition for Agencies</title>
        <meta name="description" content="Get consistent clients for your agency. We find businesses already needing your service, reach out with personalized messages, and book meetings automatically. Built for marketing, web design, and consulting agencies." />
        <meta name="keywords" content="client acquisition, agency clients, marketing agency leads, web design clients, consulting clients, automated client generation, agency growth, get clients" />
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
              Get 10–30 Qualified Clients<br />Every Month Without Cold Outreach
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              We find, contact, and convert businesses already needing your service — so you don't have to chase leads.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <button 
                onClick={scrollToDemo}
                className="group px-8 py-4 bg-white text-purple-600 rounded-lg font-semibold text-lg hover:bg-gray-50 transition-all duration-300 flex items-center gap-2 shadow-xl hover:shadow-2xl transform hover:scale-105"
              >
                See How You Get Clients
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-lg font-semibold text-lg hover:bg-white/20 transition-all duration-300 border border-white/30"
              >
                Watch 5-Min Demo
              </button>
            </div>
            <p className="text-white/80 text-sm mt-4">
              No pressure. See exactly how it works for your agency.
            </p>
          </div>
        </div>
      </section>

      {/* Try It Risk-Free Section */}
      <section className="py-16 bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="animate-on-scroll">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Try It Risk-Free
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed max-w-2xl mx-auto">
              We'll show you exactly how this would bring in clients for your agency before you commit to anything.
              If it makes sense, we continue. If not, no worries.
            </p>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Most Agencies Struggle to Get Consistent Clients
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The same problems keep agencies stuck
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              { icon: <X className="w-6 h-6" />, title: 'Spending hours finding leads manually', desc: 'No system, just endless searching' },
              { icon: <X className="w-6 h-6" />, title: 'Sending messages that get ignored', desc: 'Generic outreach that doesn\'t convert' },
              { icon: <X className="w-6 h-6" />, title: 'No consistent pipeline of new clients', desc: 'Feast or famine revenue cycles' },
              { icon: <X className="w-6 h-6" />, title: 'Losing deals due to poor follow-up', desc: 'Warm leads go cold from inconsistent contact' }
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
              The Solution
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              How You Get Clients Consistently
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              This system finds businesses already looking for your service, reaches out with personalized messages, and turns them into booked meetings — automatically.
            </p>
          </div>

          <div className="animate-on-scroll bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8 md:p-12 border border-purple-100">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-5xl font-bold text-purple-600 mb-2">10-30</div>
                <div className="text-gray-700">Qualified clients per month</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-purple-600 mb-2">Personalized</div>
                <div className="text-gray-700">Outreach that actually gets responses</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-purple-600 mb-2">Automated</div>
                <div className="text-gray-700">Runs on autopilot while you close</div>
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
              How It Works
            </h2>
            <p className="text-xl text-gray-600">Simple. Believable. Results-driven.</p>
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
              What This Gets You
            </h2>
            <p className="text-xl text-gray-600">Results that matter for your agency</p>
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
              Built For Agencies That Want More Clients
            </h2>
            <p className="text-xl text-gray-600">Trusted by agencies that need consistent growth</p>
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

      {/* Example Results Section */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Example Results
            </h2>
            <p className="text-xl text-gray-600">Here's what this system can generate:</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Example Leads */}
            <div className="animate-on-scroll bg-white rounded-xl p-6 border border-purple-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Sample Leads</h3>
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded">
                  <p className="font-semibold text-gray-900">Acme Marketing Co.</p>
                  <p className="text-sm text-gray-600">Looking for web design services</p>
                  <p className="text-xs text-purple-600 mt-1">Score: 92/100</p>
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <p className="font-semibold text-gray-900">Growth Digital Ltd.</p>
                  <p className="text-sm text-gray-600">Needs SEO consultant</p>
                  <p className="text-xs text-purple-600 mt-1">Score: 88/100</p>
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <p className="font-semibold text-gray-900">Tech Solutions Inc.</p>
                  <p className="text-sm text-gray-600">Hiring marketing agency</p>
                  <p className="text-xs text-purple-600 mt-1">Score: 95/100</p>
                </div>
              </div>
            </div>

            {/* Sample Outreach */}
            <div className="animate-on-scroll bg-white rounded-xl p-6 border border-purple-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Sample Message</h3>
              <div className="p-4 bg-gray-50 rounded text-sm text-gray-700 leading-relaxed">
                <p className="mb-2">Hi Sarah,</p>
                <p className="mb-2">
                  Noticed you're looking for SEO help for Growth Digital. We specialize in helping B2B companies like yours rank for competitive keywords.
                </p>
                <p className="mb-2">
                  Would love to show you a quick case study from a similar client we helped — are you free for 15 min this week?
                </p>
                <p>Best,<br />Alex</p>
              </div>
            </div>

            {/* Example Response */}
            <div className="animate-on-scroll bg-white rounded-xl p-6 border border-purple-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Typical Response</h3>
              <div className="p-4 bg-green-50 rounded text-sm text-gray-700 leading-relaxed border border-green-200">
                <p className="mb-2 font-semibold text-green-800">✓ Positive Response</p>
                <p className="mb-2">
                  "Hi Alex, yes we're actively looking for SEO support. Would Thursday at 2pm work for a quick call?"
                </p>
                <p className="text-xs text-gray-600 mt-3">→ Meeting booked</p>
              </div>
              <div className="mt-3 p-3 bg-purple-50 rounded text-xs text-purple-900">
                <p className="font-semibold">Conversion Rate: 15-25%</p>
                <p className="text-purple-700">Typical response rate from qualified leads</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              What You Can Expect
            </h2>
            <p className="text-xl text-gray-600">Real outcomes for your agency</p>
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
          <div className="text-center mb-4 animate-on-scroll">
            <p className="text-2xl font-semibold text-purple-600 mb-8">
              One client can easily cover your monthly plan.
            </p>
          </div>
          
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Simple Monthly Pricing
            </h2>
            <p className="text-xl text-gray-600">Choose the plan that fits your agency size. Cancel anytime.</p>
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
                  Get Clients Now
                </button>
              </div>
            ))}
          </div>

          {/* What's Included */}
          <div className="animate-on-scroll max-w-3xl mx-auto bg-white rounded-2xl p-8 border border-gray-200">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Every Plan Includes</h3>
              <p className="text-gray-600">Core features for consistent client acquisition</p>
            </div>
            <ul className="grid md:grid-cols-2 gap-3 mb-6">
              {['Find qualified clients', 'Personalized outreach', 'Meeting booking', 'Performance tracking', 'Multi-channel contact', 'Simple dashboard'].map((item, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Add-ons Section */}
          <div className="animate-on-scroll mt-16">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-3">Power-Ups & Add-ons</h3>
              <p className="text-lg text-gray-600">Scale beyond your plan limits with flexible add-ons</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {addOns.map((addon, idx) => (
                <div key={idx} className="bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-purple-400 transition-all">
                  <h4 className="text-lg font-bold text-gray-900 mb-2">{addon.category}</h4>
                  <p className="text-sm text-gray-600 mb-4">{addon.description}</p>
                  <div className="space-y-2">
                    {addon.options.map((option, oIdx) => (
                      <div key={oIdx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-700">{option.amount}</span>
                        <span className="text-sm font-bold text-purple-600">{option.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Positioning Line */}
          <div className="animate-on-scroll mt-12 text-center space-y-2 max-w-2xl mx-auto">
            <p className="text-lg text-gray-700 font-medium">
              Simple monthly subscription. Cancel anytime.
            </p>
            <p className="text-gray-600">
              Start getting consistent clients for your agency today.
            </p>
          </div>
        </div>
      </section>

      {/* Demo CTA Section */}
      <section id="demo-section" className="py-20 flow-gradient">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center text-white space-y-8 animate-on-scroll">
            <h2 className="text-4xl md:text-5xl font-bold">
              Ready to Get More Clients Consistently?
            </h2>
            <p className="text-xl text-white/90">
              See exactly how this will work for your agency in 5 minutes.
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
                      See How It Works For You
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
              No pressure. Just see how this would bring in clients for your agency.
            </p>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center space-y-8 animate-on-scroll">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              Simple. Effective. Built For Results.
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8 pt-8">
              <div className="text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">No Complex Setup</h3>
                <p className="text-gray-600">Simple onboarding. Start getting clients fast.</p>
              </div>
              
              <div className="text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Qualified Leads Only</h3>
                <p className="text-gray-600">Businesses already looking for your service</p>
              </div>
              
              <div className="text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Built For Agencies</h3>
                <p className="text-gray-600">Perfect for marketing, web design, and consulting agencies</p>
              </div>
            </div>

            <div className="pt-8 border-t border-gray-200">
              <p className="text-gray-600">
                A product by <span className="font-semibold text-purple-600">Timingotech</span> — systems that get you clients, not complexity.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TimingoFlow;

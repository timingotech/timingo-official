import React, { useEffect, useState, useRef } from 'react';
import { ExternalLink, ArrowRight, Users, Target, Zap, Brain, Leaf, Calendar, Mail, Code, Globe, Github, ChevronRight, Award, TrendingUp, Shield, Phone, MapPin, Clock, MessageCircle, Loader2, CheckCircle } from 'lucide-react';
import axios from "axios";

const Contact = () => {
  const [animateOnLoad, setAnimateOnLoad] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', or null
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
  
        if (elementTop < windowHeight * 0.85) {
          el.classList.add('show');
        }
      });
    };
  
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

const sendEmail = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  setSubmitStatus(null);

  const formData = new FormData(form.current);
  const payload = {
    name: formData.get("user_name"),
    email: formData.get("user_email"),
    phone: formData.get("user_phone"),
    company: formData.get("user_company"),
    service_interest: formData.get("service_interest"),
    message: formData.get("message"),
  };

  try {
    await axios.post("https://serenimindbackend.onrender.com/api/contact/", payload, {
      headers: { "Content-Type": "application/json" }
    });
    
    setSubmitStatus('success');
    
    // Wait 3 seconds then reload the page
    setTimeout(() => {
      window.location.reload();
    }, 3000);
    
  } catch (error) {
    console.error(error);
    setSubmitStatus('error');
    setIsSubmitting(false);
    
    // Reset error status after 5 seconds
    setTimeout(() => {
      setSubmitStatus(null);
    }, 5000);
  }
};

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
        .hometext-gradient {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .text-gradient {
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .pulse-success {
          animation: pulse-success 0.6s ease-in-out;
        }
        @keyframes pulse-success {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        .fade-in {
          animation: fadeIn 0.3s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Header Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-blue-900 via-purple-900 to-slate-900">
        <div className="max-w-7xl mx-auto text-center">
          <div className={`${animateOnLoad ? 'show' : ''}`}>
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
              Contact <span className="gradient-text">Us</span>
            </h1>
            <p className="text-xl text-white max-w-3xl mx-auto mb-8">
              Ready to transform your business with cutting-edge AI solutions? Let's discuss your project 
              and explore how we can help you achieve your goals.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href="#contact-form" 
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center gap-2"
              >
                Start Your Project <ArrowRight className="w-5 h-5" />
              </a>
              <a 
                href="#office-info" 
                className="px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-all duration-300"
              >
                Visit Our Office
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 gap-16 md:grid-cols-2">
            <div className={`animate-left ${animateOnLoad ? 'show' : ''}`}>
              <h2 className="mb-6 text-4xl font-bold text-gray-900">Get in Touch</h2>
              <p className="mb-6 text-lg text-gray-700 leading-relaxed">
                We'd love to hear from you! Feel free to reach out to us with any questions, inquiries, 
                or partnership opportunities. Our team is ready to assist you in transforming your business 
                with innovative AI solutions.
              </p>
              
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Mail className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Email Us</h3>
                    <p className="text-gray-600 mb-2">Get detailed responses to your inquiries</p>
                    <a 
                      href="mailto:timingotech@gmail.com" 
                      className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2"
                    >
                      timingotech@gmail.com
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Phone className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Call Us</h3>
                    <p className="text-gray-600 mb-2">Speak directly with our team</p>
                    <a 
                      href="tel:+2349022013174" 
                      className="text-green-600 hover:text-green-700 font-semibold"
                    >
                      +234 902 201 3174
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-12 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  Response Time
                </h3>
                <p className="text-gray-700">
                  We typically respond to all inquiries within 24 hours during business days. 
                  For urgent matters, please call us directly.
                </p>
              </div>
            </div>

            <div className={`animate-right ${animateOnLoad ? 'show' : ''}`}>
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <h2 className="mb-6 text-3xl font-bold text-gray-900 flex items-center gap-2">
                  <MapPin className="w-8 h-8 text-purple-600" />
                  Visit Us
                </h2>
                <p className="mb-6 text-lg text-gray-700">
                  Come and visit our office! We are conveniently located and would be delighted 
                  to meet you in person for detailed project discussions.
                </p>
                
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Timingotech Headquarters</h3>
                  <address className="not-italic text-gray-700 leading-relaxed">
                    <div className="flex items-start gap-3 mb-4">
                      <MapPin className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
                      <div>
                        Bello Folawuyo Crescent,<br />
                        Lagos State, 10001,<br />
                        Nigeria.
                      </div>
                    </div>
                  </address>
                </div>

                <div className="space-y-4">
                  <button 
                    className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center justify-center gap-2"
                    onClick={() => window.open('https://maps.google.com/?q=Bello+Folawuyo+Crescent+Lagos+Nigeria', '_blank')}
                  >
                    <MapPin className="w-5 h-5" />
                    View on Google Maps
                  </button>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg text-center">
                      <Clock className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                      <div className="font-semibold text-gray-900">Office Hours</div>
                      <div className="text-sm text-gray-600">Mon-Fri 9AM-6PM</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg text-center">
                      <Users className="w-6 h-6 text-green-600 mx-auto mb-2" />
                      <div className="font-semibold text-gray-900">Team Available</div>
                      <div className="text-sm text-gray-600">Schedule Meeting</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact-form" className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Leave a Message</h2>
            <p className="text-xl text-gray-600">
              Fill out the form below and we'll get back to you within 24 hours
            </p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12 animate-on-scroll">
            <form ref={form} onSubmit={sendEmail} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <label htmlFor="name" className="block mb-3 text-lg font-semibold text-gray-900">
                    Name *
                  </label>
                  <input 
                    type="text" 
                    id="name" 
                    name="user_name" 
                    placeholder="Your name" 
                    required
                    disabled={isSubmitting}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors text-lg disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block mb-3 text-lg font-semibold text-gray-900">
                    Email *
                  </label>
                  <input 
                    type="email" 
                    id="email" 
                    name="user_email" 
                    placeholder="Your email" 
                    required
                    disabled={isSubmitting}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors text-lg disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <label htmlFor="phone" className="block mb-3 text-lg font-semibold text-gray-900">
                    Phone Number
                  </label>
                  <input 
                    type="tel" 
                    id="phone" 
                    name="user_phone" 
                    placeholder="Your phone number" 
                    disabled={isSubmitting}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors text-lg disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>
                
                <div>
                  <label htmlFor="company" className="block mb-3 text-lg font-semibold text-gray-900">
                    Company/Organization
                  </label>
                  <input 
                    type="text" 
                    id="company" 
                    name="user_company" 
                    placeholder="Your company name" 
                    disabled={isSubmitting}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors text-lg disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="service" className="block mb-3 text-lg font-semibold text-gray-900">
                  Service Interest
                </label>
                <select 
                  id="service" 
                  name="service_interest"
                  disabled={isSubmitting}
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors text-lg disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">Select a service</option>
                  <option value="mental-health">Health Technology </option>
                  <option value="corporate-wellness">E-Commerce Technology </option>
                  <option value="agritech">Agricultural Technology </option>
                  <option value="ai-consulting">AI Consulting</option>
                  <option value="custom-development">Custom Development</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block mb-3 text-lg font-semibold text-gray-900">
                  Message *
                </label>
                <textarea 
                  id="message" 
                  name="message" 
                  placeholder="Tell us about your project, goals, and how we can help you..."
                  rows="6"
                  required
                  disabled={isSubmitting}
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors text-lg resize-vertical disabled:bg-gray-100 disabled:cursor-not-allowed"
                ></textarea>
              </div>

              <div className="text-center">
                <button 
                  type="submit" 
                  disabled={isSubmitting || submitStatus === 'success'}
                  className={`px-12 py-4 rounded-lg font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 mx-auto min-w-[200px] ${
                    submitStatus === 'success' 
                      ? 'bg-green-600 text-white pulse-success' 
                      : submitStatus === 'error'
                      ? 'bg-red-600 text-white'
                      : isSubmitting 
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transform hover:scale-105'
                  }`}
                >
                  {submitStatus === 'success' ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Message Sent!
                    </>
                  ) : submitStatus === 'error' ? (
                    <>
                      <MessageCircle className="w-5 h-5" />
                      Failed to Send
                    </>
                  ) : isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <MessageCircle className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </button>
                
                {submitStatus === 'success' && (
                  <p className="text-green-600 mt-4 fade-in font-semibold">
                    Thank you! We'll get back to you soon. Page will reload automatically...
                  </p>
                )}
                
                {submitStatus === 'error' && (
                  <p className="text-red-600 mt-4 fade-in">
                    Something went wrong. Please try again or contact us directly.
                  </p>
                )}
                
                {!submitStatus && !isSubmitting && (
                  <p className="text-gray-600 mt-4">We'll respond within 24 hours</p>
                )}
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-900 to-purple-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-4xl font-bold text-white mb-4">Why Choose Timingotech?</h2>
            <p className="text-xl text-blue-200">Trusted by organizations worldwide</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="animate-on-scroll text-center">
              <div className="text-5xl font-bold text-white mb-2">85K+</div>
              <div className="text-blue-200 text-lg">Lives Impacted</div>
            </div>
            <div className="animate-on-scroll text-center">
              <div className="text-5xl font-bold text-white mb-2">250+</div>
              <div className="text-blue-200 text-lg">Organizations Served</div>
            </div>
            <div className="animate-on-scroll text-center">
              <div className="text-5xl font-bold text-white mb-2">98%</div>
              <div className="text-blue-200 text-lg">Client Satisfaction</div>
            </div>
            <div className="animate-on-scroll text-center">
              <div className="text-5xl font-bold text-white mb-2">24hrs</div>
              <div className="text-blue-200 text-lg">Response Time</div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center animate-on-scroll">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join the hundreds of organizations that have transformed their operations with our innovative solutions.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="mailto:timingotech@gmail.com"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Mail className="w-5 h-5" />
              Email Us Now
            </a>
            
            <a 
              href="tel:+2349022013174"
              className="px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Phone className="w-5 h-5" />
              Call Us Today
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
import React from 'react'
import Alfa from '../images/Alfa.JPG'
import Line from '../images/Line.png'
import LinkedInLogo from '../images/LinkedInLogo.png'; 
import { useEffect,useState } from 'react'


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
  
        // Adjust the trigger point here
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

  return (
    <div className="container mx-auto">
      <h1 className="p-8 text-4xl font-bold text-center mb-[-20px] mt-[-20px] hometext-gradient">About Timingotech</h1>

      <div className="flex flex-col items-center px-5 mb-8 md:px-16 md:flex-row" >
        <div className= {`animate-left ${animateOnLoad ? 'show' : ''} mb-4 md:w-1/2`}>
          <img src={Alfa} alt="Founder" className="md:w-[400px] md:h-[500px] rounded-lg shadow-md" />
        </div>

        <div className= {`animate-right ${animateOnLoad ? 'show' : ''} md:w-1/2 md:pl-8`}>
          <h2 className="mb-4 text-2xl font-semibold">Meet <span className='hometext-gradient'>Ridwan Oyenuga</span> ,  Founder & CEO {' '}
          <a href="https://www.linkedin.com/in/ridwanoyenuga/" target="_blank" rel="noopener noreferrer">
              <img src={LinkedInLogo} alt="LinkedIn" className="w-[22px] h-[22px] inline-block mt-[-6px]" />
            </a>
          </h2>
          <p className="mb-4">
          Ridwan Oyenuga, an innovator and tech enthusiast, founded Timingotech with a vision to utilize
            technology and AI to address global challenges. His journey started from humble beginnings, driven
            by a passion for leveraging innovation to improve lives.
          </p>
          <p className="mb-4">
          Ridwan's relentless pursuit of technological solutions led to the establishment of Timingotech, a
            company committed to revolutionizing industries through cutting-edge AI applications.
            
          </p>
        </div>
      </div>
      <div className='bg-[#eaeaec] px-4 py-5'>
      <div className="mb-8">
      <div className="flex justify-center deco-line">
        <img src={Line} alt="" className='w-[70px] h-[5px] mt-8' />
      </div> 
        <h2 className="mt-4 mb-4 text-2xl text-center animate-on-scroll left-to-right">Journey to Build <span className='font-bold '>Timingotech</span></h2>
        <p className="mb-4 animate-on-scroll right-to-left">
          The journey to build Timingotech was fueled by the desire to create a tech-driven enterprise capable
          of addressing pressing global issues. Ridwan Oyenuga's leadership and a team of dedicated professionals
          worked tirelessly to create an environment fostering innovation, collaboration, and technological advancement.
        </p>
        <p className="mb-4 animate-on-scroll right-to-left">
          Starting with a small team, Timingotech has evolved into a powerhouse of talent, where creativity meets
          technology, aiming to revolutionize the world through inventive AI solutions.
        </p>
      </div>
      <div>
      <div className="flex justify-center deco-line">
        <img src={Line} alt="" className='w-[70px] h-[5px] mt-8' />
      </div> 
        <h2 className="mt-4 mb-4 text-2xl text-center animate-on-scroll left-to-right">Mission of <span className='font-bold'>Timingotech</span></h2>
        <p className="mb-4 animate-on-scroll right-to-left">
          Timingotech is on a mission to tackle global challenges using state-of-the-art technology and AI. The company
          strives to provide innovative solutions that redefine possibilities across various industries.
        </p>
        <p className="mb-4 animate-on-scroll right-to-left">
          Committed to making a positive impact, Timingotech endeavors to harness the potential of AI to transform
          businesses, optimize processes, and contribute significantly to solving world problems.
        </p>
        <p className='animate-on-scroll right-to-left'>
          With a focus on innovation and a dedication to excellence, Timingotech aims to be a frontrunner in leveraging
          technology for the betterment of society, constantly pushing the boundaries of what's possible in the tech realm.
        </p>
      </div>
      </div>
      
    </div>
  )
}

export default About
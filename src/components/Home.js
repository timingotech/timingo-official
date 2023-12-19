import React from 'react'
import { useEffect,useState,useRef  } from 'react';
import emailjs from '@emailjs/browser';
import { Link } from 'react-router-dom'
import HomeoneImage from '../images/HomeoneImage.png';
import Line from '../images/Line.png'
import Addidas from '../images/Addidas.png'
import Nike from '../images/Nike.png'
import Microsoft from '../images/Microsoft.jpeg'
import Ibm from '../images/Ibm.png'
import Google from '../images/Google.png'
import Ngo from '../images/Ngo.png'
import Nestle from '../images/Nestle.png'
import Hp from '../images/Hp.png'

const Home = () => {
  //animations
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
        if (elementTop < windowHeight * 0.9) {
          el.classList.add('show');
        }
      });
    };
  
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  //email sending 
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs.sendForm('service_bt2q0z7', 'template_kwl0ojh', form.current, 'Yz16g8qPG_-f9ArRT')
      .then((result) => {
          console.log(result.text);
          window.alert('Email sent successfully!');
          window.location.reload();
      }, (error) => {
          console.log(error.text);
          window.alert('Failed to send email. Please try again later.');
      });
    };
  //newsletter sending 
    const newsLetter = (e) => {
      e.preventDefault();
  
      emailjs.sendForm('service_bt2q0z7', 'template_odtudw6', form.current, 'Yz16g8qPG_-f9ArRT')
        .then((result) => {
            console.log(result.text);
            window.alert('Successfully!');
            window.location.reload();
        }, (error) => {
            console.log(error.text);
            window.alert('Failed to send email. Please try again later.');
        });
      };

  return (
    <>
    <main className='pb-10 md:flex '>
      <div className={`animate-left ${animateOnLoad ? 'show' : ''} md:mt-[100px] mt-[25px] md:ml-[60px] mx-6`}>
        <h1 className='text-4xl home-text'>Embracing the <span className='font-bold hometext-gradient'>World's </span> Challenges, <br />Leading with <span className='font-bold'> Technology</span> and <span className='font-bold hometext-gradient'>AI </span></h1>
        <p className='md:first-letter:w-[500px] mt-8'>We innovate with precision timing and AI to solve global challenges across industries.</p>
        <Link to='services'>
        <button className='px-3 py-1 mt-8 rounded-md text-gradient text-gray-50'>Explore Our Projects</button>

        </Link>
      </div>
      <div className={`anima animate-right ${animateOnLoad ? 'show' : ''} justify-end ml-[-70px]`}>
        <img src={HomeoneImage} alt="" className="w-[600px] h-[500px] "  />
      </div>
    </main>
    <section className='bg-[#eaeaec] text-black pb-10'>
      <div className="flex justify-center deco-line">
        <img src={Line} alt="" className='w-[70px] h-[5px] mt-8' />
      </div> 
      <div className="texthome animate-on-scroll right-to-left">
        <h1 className='mt-4 text-2xl text-center'>Our design and<br /> <span className='font-bold'>development approach</span></h1>
      </div>
      <div>
        <div className="md:mx-[100px] mx-[10px] my-7 introduction animate-on-scroll left-to-right">
          <h1 className='text-xl font-bold'>Introduction:</h1>
          <p>Embark on a journey where innovation meets precision. At Timingotech, our design and development approach isn't just a process; it's a philosophy built on agility, collaboration, and client-centricity. Explore our seamless methodologies, where cutting-edge technologies merge with adaptable strategies to craft solutions that redefine possibilities.</p>
        </div>
        <div className="justify-center md:flex ">
          <div className="px-5 py-4 bg-white border animate-on-scroll left-to-right">
          <h1 className='font-bold md:mb-4 text-md'>Agile Approach</h1>
          <p className='md:w-[500px]'>At Timingotech, we embrace Agile methodologies as the cornerstone of our development process. By fostering iterative and collaborative workflows, we ensure flexibility and adaptability in delivering solutions that evolve alongside your needs.

</p>

          </div>
          <div className="px-5 py-4 bg-white border md:ml-6 animate-on-scroll right-to-left">
          <h1 className='mb-4 font-bold text-md'>User-Centered Design (UCD):</h1>
          <p className='md:w-[500px]'>Our commitment to User-Centered Design places our audience at the core of our development cycle. We meticulously analyze user behaviors, preferences, and feedback to craft intuitive, user-friendly solutions that resonate with your target audience.

</p>

          </div>
        </div>
        <div className="justify-center mt-6 md:flex">
          <div className="px-5 py-4 bg-white border animate-on-scroll left-to-right">
          <h1 className='mb-4 font-bold text-md'>Test-Driven Development (TDD):</h1>
          <p className='md:w-[500px]'>Quality assurance is paramount. With Test-Driven Development, we rigorously validate and refine our codebase, ensuring robustness, reliability, and adherence to project specifications from the outset.

</p>

          </div>
          <div className="px-5 py-4 bg-white border md:ml-6 animate-on-scroll right-to-left">
          <h1 className='mb-4 font-bold text-md'>Continuous Integration/Continuous Deployment (CI/CD):</h1>
          <p className='md:w-[500px]'>Efficiency and seamless deployment define our practices. Leveraging CI/CD pipelines, we automate processes, allowing for swift and consistent integration, testing, and deployment of code changes.
</p>

          </div>
        </div>
        <div className="justify-center mt-6 md:flex">
          <div className="px-5 py-4 bg-white border animate-on-scroll left-to-right">
          <h1 className='mb-4 font-bold text-md'>Rapid Prototyping:</h1>
          <p className='md:w-[500px]'>We employ rapid prototyping techniques to swiftly visualize and iterate on concepts, expediting the path from idea to execution.
</p>

          </div>
          <div className="px-5 py-4 bg-white border md:ml-6 animate-on-scroll right-to-left">
          <h1 className='mb-4 font-bold text-md'>Thorough Testing:</h1>
          <p className='md:w-[500px]'>Our rigorous testing methodologies ensure quality assurance at every stage, validating functionalities and performance for reliable, refined solutions.</p>

          </div>
        </div>
      </div>
    </section>
    <section className='pb-10 text-black bg-white'>
  <div className="flex justify-center deco-line">
    <img src={Line} alt="" className='w-[70px] h-[5px] mt-8' />
  </div> 
  <div className="mb-8 texthome">
    <h1 className='mt-4 text-2xl text-center'>Our Trusted <span className='font-bold'>Partnerships</span></h1>
  </div>
  <div className="marquee-container">
    <div className="marquee">
      <img src={Nike} alt="" className='w-48 mr-4' />
      <img src={Addidas} alt="" className='w-48 mr-4' />
      <img src={Hp} alt="" className='w-48 mr-4' />
      <img src={Ibm} alt="" className='w-48 mr-4' />
      <img src={Google} alt="" className='w-48 mr-4' />
      <img src={Microsoft} alt="" className='w-48 mr-4' />
      <img src={Ngo} alt="" className='w-48 mr-4' />
      <img src={Nestle} alt="" className='w-48 mr-4' />
      <img src={Nike} alt="" className='w-48 mr-4' />
      <img src={Addidas} alt="" className='w-48 mr-4' />
      <img src={Hp} alt="" className='w-48 mr-4' />
      <img src={Ibm} alt="" className='w-48 mr-4' />
    </div>
  </div>
</section>
    <div className='bg-[#eaeaec]'>
    <div className="flex justify-center deco-line bg-[#eaeaec]">
        <img src={Line} alt="" className='w-[70px] h-[5px] mt-8' />
      </div> 
      <div className="mb-8 texthome bg-[#eaeaec]">
        <h1 className='mt-4 text-2xl text-center'>Get In <span className='font-bold'>Touch</span></h1>
      </div>
      
    <div className="flex flex-col gap-8 md:px-[100px] px-4 py-20 md:flex-row bg-[#eaeaec]" >
      {/* Leave a Message Form */}
      
      <form ref={form} onSubmit={sendEmail} className="w-full md:w-1/2 animate-on-scroll left-to-right">
        <h2 className="mb-4 text-xl font-bold">Leave a Message for Us</h2>
        <div className="mb-4">
          <label htmlFor="user_name" className="block text-gray-700">Name</label>
          <input type="text" id="name" name="user_name" className="w-full px-3 py-2 border rounded-md" required />
        </div>
        <div className="mb-4">
          <label htmlFor="user_email" className="block text-gray-700">Email</label>
          <input type="email" id="email" name="user_email" className="w-full px-3 py-2 border rounded-md" required />
        </div>
        <div className="mb-4">
          <label htmlFor="message" className="block text-gray-700">Message</label>
          <textarea id="message" name="message" required className="w-full px-3 py-2 border rounded-md" rows="4"></textarea>
        </div>
        <button type="submit" value="Send" className="px-4 py-2 text-white rounded-md text-gradient">Submit</button>
      </form> 

      {/* Join Newsletter Form */}
      <form ref={form} onSubmit={newsLetter} className="w-full md:w-1/2 animate-on-scroll right-to-left">
        <h2 className="mb-4 text-xl font-bold">Join Our Newsletter</h2>
        <div className="mb-4">
          <label htmlFor="newsletterEmail" className="block text-gray-700">Email</label>
          <input type="email" id="newsletterEmail" name="user_email" className="w-full px-3 py-2 border rounded-md" />
        </div>
        <button type="submit" value="Send" className="px-4 py-2 text-white rounded-md text-gradient">Subscribe</button>
      </form>
    </div>
    </div>
    </>
  )
}

export default Home
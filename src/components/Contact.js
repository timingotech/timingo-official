import React from 'react'
import Line from '../images/Line.png'
import {useEffect,useState,useRef  } from 'react';
import emailjs from '@emailjs/browser';

const Contact = () => {
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
  
  return (
    <div>
      <div className="container px-[58px] py-3 mx-auto">
      <h1 className="mb-6 text-4xl font-bold text-center hometext-gradient">Contact Us</h1>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2" >
        <div className={`animate-left ${animateOnLoad ? 'show' : ''}  `}>
          <h2 className="mb-4 text-2xl font-semibold">Get in Touch</h2>
          <p className="mb-4">
            We'd love to hear from you! Feel free to reach out to us with any questions, inquiries, or partnership opportunities.
            Our team is ready to assist you.
          </p>
          <p className="mb-4">
            Contact us via email or phone:
          </p>
          <ul className="ml-6 list-disc">
            <li>Email: timingotech@gmail.com</li>
            <li>Phone: +2349022013174</li>
          </ul>
        </div>

        <div className={`anima animate-right ${animateOnLoad ? 'show' : ''} `}>
          <h2 className="mb-4 text-2xl font-semibold">Visit Us</h2>
          <p className="mb-4">
            Come and visit our office! We are conveniently located and would be delighted to meet you in person.
          </p>
          <p className="mb-4">
            Timingotech Headquarters:
          </p>
          <address className="not-italic">
            Bello Folawuyo Crescent,<br />
            Lagos State, 10001,<br />
            Nigeria.
          </address>
        </div>
      </div>
    </div>
    <div className='bg-[#eaeaec] pb-5'>
    <div className="flex justify-center deco-line">
        <img src={Line} alt="" className='w-[70px] h-[5px] mt-8' />
      </div> 
          <h2 className="mt-4 mb-4 text-2xl font-bold text-center">Leave a Message</h2>
          <div className='flex justify-center px-4'>
          <form ref={form} onSubmit={sendEmail}  className="space-y-4 w-[500px] ">
            <div>
              <label htmlFor="name" className="block mb-1 text-lg font-medium">Name</label>
              <input type="text" id="name" name="user_name" placeholder="Your name" className="w-full px-3 py-2 border rounded-md" />
            </div>
            <div>
              <label htmlFor="email" className="block mb-1 text-lg font-medium">Email</label>
              <input type="email" id="email" name="user_email" placeholder="Your email" className="w-full px-3 py-2 border rounded-md" />
            </div>
            <div>
              <label htmlFor="message" className="block mb-1 text-lg font-medium">Message</label>
              <textarea id="message" name="message" placeholder="Your message" className="w-full px-3 py-2 border rounded-md"></textarea>
            </div>
            <button type="submit" className="px-4 py-2 text-center text-white transition duration-300 text-gradient">Send Message</button>
          </form>
        </div>
        </div>
    </div>
  )
}

export default Contact
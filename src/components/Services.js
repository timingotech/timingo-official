import React,{useEffect,useState} from 'react'
import Agritech from '../images/Agritech.jpg'
import Task from '../images/Task.png'
import Mental from '../images/Mental.jpg'


const Services = () => {

  const handleEmailClick = () => {
     window.location.href = 'mailto:timingotech@gmail.com';
  };
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
    <div>
      <h1 className="mb-6 mt-3 text-4xl font-bold text-center hometext-gradient">Discover Our Projects</h1>
              {/* SereniMind */}
                
           <div className="md:flex justify-center items-center px-[33px] mb-5">
      {/* Left Section */}
      <h1 className="text-3xl font-bold mb-4 hometext-gradient text-center titleproject hidden">SereniMind</h1>
            <div className={`animate-left ${animateOnLoad ? 'show' : ''} md:w-[670px]  px-8 smalldevices`}>
        <img src={Mental} alt="SereniMind" className="w-[600px] h-[400px] rounded-md" />
      </div>

      {/* Right Section */}
      <div className={`animate-right ${animateOnLoad ? 'show' : ''} md:w-1/2 p-8 `}>
        <h1 className="text-3xl font-bold mb-4 hometext-gradient titleshowlarge">SereniMind</h1>
        <p className="mb-4 textproject">
        Explore SereniMind—an innovative mental wellness platform transforming self-care:
                  <ul className="list-disc pl-6">
            <li>
            SereniMind offers personalized support with an AI-powered mental health chatbot, catered to individuals seeking improved well-being and productivity.            </li>
            <li>
            SereniMind offers a large, safe community for discussions and support on various mental health topics.            </li>
            <li>
            Embracing personal growth, SereniMind enables self-improvement through customizable goal setting, mood tracking, exercises, games, and soothing sounds nurturing holistic mental wellness.
            </li>
          </ul>
        </p>
        <a href="https://vitaskr-website.com" target="_blank" rel="noopener noreferrer" className="text-gradient">
          Visit SereniMind's Official Website
        </a>
      </div>
    </div>
              {/* Vitaskr */}

    <div className="md:flex justify-center items-center px-[33px] mb-5">
      {/* Right Section */}
      <h1 className="text-3xl font-bold mb-4 hometext-gradient text-center titleproject2 hidden">Vitaskr</h1>
      <div className="md:w-[670px]  px-8 animate-on-scroll right-to-left smalldevices md:hidden">
        <img src={Task} alt="Task" className="w-[600px] h-[400px] rounded-md" />
      </div>
      {/* Left Section */}
      <div className="md:w-1/2 p-8 animate-on-scroll left-to-right">
        <h1 className="text-3xl font-bold mb-4 hometext-gradient titleshowlarge">Vitaskr</h1>
        <p className="mb-4 textproject">
          Explore Vitaskr, an innovative mental well-being platform that redefines self-care:
          <ul className="list-disc pl-6">
            <li>
            AI-powered mental health chatbot and task manager designed for personalized support and productivity enhancement.            </li>
            <li>
            Vitaskr enhances corporate settings by integrating task management, tracking employee well-being, fostering team-building, and offering stress-relief resources.            </li>
            <li>
            Vitaskr focuses on personal self-improvement and well-being through customizable goal setting, mood tracking, and AI-driven personalized self-care routines, promoting holistic mental wellness.            </li>
          </ul>
        </p>
        <a href="https://vitaskr-website.com" target="_blank" rel="noopener noreferrer" className="text-gradient">
          Visit Vitaskr's Official Website
        </a>
      </div>

      {/* Right Section */}
      <div className="w-[670px]  px-8 animate-on-scroll right-to-left largescreen">
        <img src={Task} alt="Vitaskr" className="w-[600px] h-[400px] rounded-md" />
      </div>
    </div>
              {/* Agritech */}

    <div className="md:flex justify-center items-center px-[33px] mb-5">
      {/* Left Section */}
      <h1 className="text-3xl font-bold mb-4 hometext-gradient text-center titleproject3 hidden">Agritos</h1>

      <div className="md:w-[670px]  px-8 animate-on-scroll left-to-right smalldevices">
        <img src={Agritech} alt="Vitaskr" className="w-[600px] h-[400px] rounded-md " />
      </div>

      {/* Right Section */}
      <div className="md:w-1/2 p-8 animate-on-scroll right-to-left">
        <h1 className="text-3xl font-bold mb-4 hometext-gradient titleshowlarge">Agritos</h1>
        <p className="mb-4 textproject">
        Discover Agritos—pioneering Sustainable Agriculture Technology revolutionizing farming:
<ul className="list-disc pl-6">
            <li>
            Agritos equips farmers with AI-driven systems for real-time crop monitoring and resource optimization.
            </li>
            <li>
            Introducing urban vertical farming, Agritos conserves land, reduces water use, and minimizes pesticides.
            </li>
            <li>
            Advocating soil health through crop rotation, Agritos promotes sustainable practices for enhanced farming.
</li>
          </ul>
        </p>
        <a href="https://vitaskr-website.com" target="_blank" rel="noopener noreferrer" className="text-gradient">
          Visit Agritos's Official Website
        </a>
      </div>
    </div>
    {/* Call-to-action button */}
    <div className="flex justify-center bg-[#eaeaec]">
          <button
            onClick={handleEmailClick}
            className="px-4 py-2 font-bold mt-8 mb-8 text-white text-gradient focus:outline-none focus:shadow-outline"
          >
            Join Our Team - Reach Out to Us
          </button>
        </div>

    </div>
    
  )
}

export default Services
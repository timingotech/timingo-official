import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <div className='text-center pb-9 text-black-500'>
    <div className="flex flex-col pt-16 md:flex-row md:pl-12 md:pr-12">
      <div className='mb-8 md:w-1/2 md:mb-0'>
        <h1>Timingotech: Pioneering Precision with AI-driven Solutions.</h1>
      </div>
      <div className='md:w-1/4 md:ml-12'>
        <h1 className='font-bold'>Links</h1>
        <Link to='about'>
          <h1>About us</h1>
        </Link>
        <Link to='services'>
          <h1>Projects</h1>
        </Link>
        <Link to='contact'>
          <h1>Contact</h1>
        </Link>
        <Link to='support'>
          <h1>Support us</h1>
        </Link>
      </div> <br />
      <div className='md:w-1/4 md:ml-12'>
        <h1 className='font-bold'>Contacts</h1>
        <a href="mailto:timingotech@gmail.com">
          timingotech@gmail.com
        </a><br />
        <a href="https://www.google.com" target="_blank" rel="noopener noreferrer">
          Instagram
        </a><br />
        <a href="https://www.google.com" target="_blank" rel="noopener noreferrer">
          X
        </a><br />
        <a href="https://www.google.com" target="_blank" rel="noopener noreferrer">
          LinkedIn
        </a> <br />
      </div>
    </div>
    <p className='mt-8 text-center'>&copy; 2024 Timingotech. All Rights Reserved.</p>
  </div>
  
  )
}

export default Footer
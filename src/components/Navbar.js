import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };
  
  const closeMenu = () => {
    setShowMenu(false);
  };

  return (
    <div>
      <nav className=' pl-[60px] mt-4 flex pb-4 shadow-md'>
        <h1 className='text-2xl font-bold text-gray-700 name'>Timingo<span>Tech<span>.</span></span></h1>
        <div className='flex'>
        <ul className={`md:hidden nav-menu navone sm:flex mt-4 sm:mt-0 sm:ml-[170px] text-gray-700 ${showMenu ? 'active' : 'inactive'}`}>
          <li className='block sm:inline-block navfirst'>
            <Link to='/' className='mr-4' onClick={closeMenu}>
              Home
            </Link>
          </li>
          <li className='block sm:inline-block navfirst'>
            <Link to='/about' className='mr-4' onClick={closeMenu}>
              About
            </Link>
          </li>
          <li className='block sm:inline-block navfirst'>
            <Link to='/services' className='mr-4' onClick={closeMenu}>
              Projects
            </Link>
          </li>
          <li className='block sm:inline-block navfirst'>
            <Link to='/contact' className='mr-4' onClick={closeMenu}>
              Contact
            </Link>
          </li>
          <li className='block sm:inline-block md:ml-64'>
            <Link to='/support' className='nav-text-gradient' onClick={closeMenu}>
              Support
            </Link>
          </li>
        </ul> 
            <button className='ml-auto mr-[-200px] sm:hidden' onClick={toggleMenu}>
              {showMenu ? (
                <FontAwesomeIcon icon={faTimes} className='text-gray-700 closebutton' />
              ) : (
                <FontAwesomeIcon icon={faBars} className='text-gray-700 ' />
              )}
            </button>
        </div>
         
        <ul className={`navtotal sm:flex mt-4 sm:mt-0 sm:ml-48 text-gray-700 ${showMenu ? 'block' : 'hidden'}`}>
          <li className='block sm:inline-block'>
            <Link to='/' className='mr-4 ml-[125px]' onClick={closeMenu}>
              Home
            </Link>
          </li>
          <li className='block sm:inline-block'>
            <Link to='/about' className='mr-4' onClick={closeMenu}>
              About
            </Link>
          </li>
          <li className='block sm:inline-block'>
            <Link to='/services' className='mr-4' onClick={closeMenu}>
              Projects
            </Link>
          </li>
          <li className='block sm:inline-block'>
            <Link to='/contact' className='mr-4' onClick={closeMenu}>
              Contact
            </Link>
          </li>
          <li className='block sm:inline-block md:ml-[335px]'>
            <Link to='/support' className='text-gradient' onClick={closeMenu}>
              Support
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;

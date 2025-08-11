import './App.css';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import Services from './components/Services';
import Contact from './components/Contact';
import Support from './components/Support';
import Footer from './components/Footer';
import Project from './components/Project';


function App() {
  return (
    <div className="App">
      <Navbar/>
      <Routes>
         <Route path='/' element={<Home/>}/> 
         <Route path='/about' element={<About/>}/> 
         <Route path='/services' element={<Services/>}/> 
         <Route path='/contact' element={<Contact/>}/> 
         <Route path='/support' element={<Support/>}/> 
         <Route path='/projects' element={<Project/>}/>
      </Routes>
      <Footer/>
      
    </div>
  );
}
export default App;

import './App.css';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import Services from './components/Services';
import Contact from './components/Contact';
import Support from './components/Support';
import Footer from './components/Footer';


function App() {
  return (
    <div className="App">
      <Navbar/>
      <Routes>
         <Route path='/' element={<Home/>}/> 
         <Route path='/about' element={<About/>}/> 
         <Route path='/projects' element={<Services/>}/> 
         <Route path='/contact' element={<Contact/>}/> 
         <Route path='/support' element={<Support/>}/> 
      </Routes>
      <Footer/>
      
    </div>
  );
}
export default App;

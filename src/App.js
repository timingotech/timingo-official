import './App.css';
import { Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import ScrollToTop from './components/ScrollToTop';
import Home from './components/Home';
import About from './components/About';
import Services from './components/Services';
import Contact from './components/Contact';
import Support from './components/Support';
import Footer from './components/Footer';
import Project from './components/Project';
import ProjectDetail from './components/ProjectDetail';
import TimingoFlow from './components/TimingoFlow';
import JobFinder from './components/JobFinder';
import Reminders from './components/Reminders';
import CompliCheck from './components/CompliCheck';
import NotFound from './components/NotFound';


function App() {
  const { pathname } = useLocation();
  const isStandaloneTool = pathname.startsWith('/reminders');

  return (
    <div className="App">
      {!isStandaloneTool && <Navbar/>}
      <ScrollToTop />
      <Routes>
         <Route path='/' element={<Home/>}/>
         <Route path='/about' element={<About/>}/>
         <Route path='/services' element={<Services/>}/>
         <Route path='/contact' element={<Contact/>}/>
         <Route path='/support' element={<Support/>}/>
         <Route path='/projects' element={<Project/>}/>
         <Route path='/projects/:id' element={<ProjectDetail/>} />
         <Route path='/timingoflow' element={<TimingoFlow/>} />
         <Route path='/complicheck' element={<CompliCheck/>} />
         <Route path='/jobs' element={<JobFinder/>} />
         <Route path='/reminders' element={<Reminders/>} />
        <Route path='*' element={<NotFound/>} />
      </Routes>
      {!isStandaloneTool && <Footer/>}
    </div>
  );
}
export default App;

import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Auth from './pages/Auth';
import Onboarding from './pages/Onboarding';
// import LandingPage from './pages/LandingPage';
import Sidebar from './components/Sidebar';
import TopBar from './components/Topbar';
import Plants from './pages/Plants';
import Plant from './pages/Plant';
import Tasks from './pages/Tasks';
import HealthLogs from './pages/HealthLogs';
import HealthLog from './pages/HealthLog';
import Profile from './pages/Profile';
import Chat from './pages/Chat';
import { useRecoilValue } from 'recoil';
import { Authenticated } from './atom';


const Navigate = () => {

const isAuthenticated  = useRecoilValue(Authenticated)

const navigate = useNavigate();
const location = useLocation();

useEffect(()=>{
  if(!isAuthenticated){
    if(location.pathname === "/"){
      navigate('/auth');
    }
  }
  else{
    if(location.pathname === "/"){
      navigate('/plants');
    }
  }
},[navigate,location,isAuthenticated]);
  

  return(
    <div>
      {isAuthenticated && (
        <div className="flex flex-row bg-gray-200 min-w-screen h-screen">
          <div className="z-10">
            <Sidebar/>
          </div>
          <div className="flex flex-col">
            <TopBar/>
            <Routes>
              <Route path='/plants' element={<Plants/>}/>
              <Route path='/plant/:id' element={<Plant/>} />
              <Route path='/tasks' element={<Tasks/>}/>
              <Route path='/healthlogs' element={<HealthLogs/>}/>
              <Route path='/healthlog/:id' element={<HealthLog/>}/>
              <Route path='/profile' element={<Profile/>}/>
              <Route path='/chat' element={<Chat/>}/>
            </Routes> 
          </div>
        </div>
      )}
      {!isAuthenticated && (
        <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path='/onboarding' element={<Onboarding/>}/>
            {/* <Route path='/' element={<LandingPage/>}/> */}
        </Routes>
      )}
    </div>
  );
}




const App = () => {
  return(
    <Router>
      <Navigate/>
    </Router>
  );
}

export default App

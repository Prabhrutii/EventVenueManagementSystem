import React from "react";
 
// We use Route in order to define the different routes of our application
import { Route, Routes } from "react-router-dom";


import './navbar.css';
import Navbar from './navbar/navbar';
import Edit from './edit';
import Login from './Login';
import Register from './Register';
import VenuesDashboard from './VenuesDashboard';
import ActivityDashboard from './ActivityDashboard';
import Home from "./Home";
import UserProfile from './pages/UserProfile';
import './Login.css';



const App = () => {
 return (
   <div>
     <Navbar />
     <Routes>
      <Route exact path='/' element={<Home/>} />
      <Route exact path='/login' element={<Login/>} />
      <Route exact path='/register' element={<Register/>} />
      <Route path='/VenuesDashboard' element={<VenuesDashboard/>} />
      <Route path='/ActivityDashboard' element={<ActivityDashboard/>} />
      <Route path='/UserProfile' element={<UserProfile/>} />
     </Routes>

   </div>
 );
};
 
export default App;
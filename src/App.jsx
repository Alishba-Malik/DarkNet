import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Sidebar from './Components/Sidebar';
import Dashboard from './pages/Dashboard.jsx';
import  DdosAttackmodules from './pages/DdosAttackmodules.jsx';
import Webcam from './pages/Webcam.jsx'
import Historylogs from './pages/Historylogs.jsx';
import ReverseShellattack from './pages/ReverseShellattack.jsx';
import Keylogger from './pages/Keylogger.jsx';
import FileManipulation from './pages/FileManipulation.jsx';
import BotnetManagement from './pages/BotnetManagement.jsx';
const App = () => {
    return (
      <BrowserRouter>
        <Sidebar>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/ddosattackmodules" element={< DdosAttackmodules/>} /> 
            <Route path="/keylogger" element={< Keylogger/>} />  
            <Route path="/filemanipulation" element={< FileManipulation/>} />
            <Route path="/historylogs" element={<Historylogs/>} />
            <Route path="/webcam" element={<Webcam/>} /> 
            <Route path="/reverseshellattack" element ={<ReverseShellattack/>}/>
            <Route path="/botnetmanagement" element ={<BotnetManagement/>}/>
          </Routes>
        </Sidebar>
      </BrowserRouter>
    );
  };
  
  export default App;
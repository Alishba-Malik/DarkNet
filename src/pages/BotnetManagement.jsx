import React, { useState } from 'react';
import axios from 'axios';
import { AppBar, Toolbar, Typography, Button, Container, TextField, Paper, List, ListItem } from '@mui/material';

const BotnetManagement = () => {
  const [currentView, setCurrentView] = useState('add');
  const [id, setId] = useState('');
  const [info, setInfo] = useState('');
  const [command, setCommand] = useState('');
  const [message, setMessage] = useState('');
  const [bots, setBots] = useState({});
  const [status, setStatus] = useState('');

  const handleAddBot = async () => {
    try {
      const response = await axios.post('http://localhost:5000/add_bot', { id, info });
      setMessage(response.data.message);
      fetchBots();
    } catch (error) {
      console.error('There was an error adding the bot!', error);
    }
  };

  const handleRemoveBot = async () => {
    try {
      const response = await axios.post('http://localhost:5000/remove_bot', { id });
      setMessage(response.data.message);
      fetchBots();
    } catch (error) {
      console.error('There was an error removing the bot!', error);
    }
  };

  const fetchBots = async () => {
    try {
      const response = await axios.get('http://localhost:5000/list_bots');
      setBots(response.data);
    } catch (error) {
      console.error('There was an error fetching the bots!', error);
    }
  };

  const handleSendCommand = async () => {
    try {
      const response = await axios.post('http://localhost:5000/send_command', { id, command });
      setMessage(response.data.message);
    } catch (error) {
      console.error('There was an error sending the command!', error);
    }
  };

  const fetchStatus = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/get_status?id=${id}`);
      setStatus(response.data.status);
    } catch (error) {
      console.error('There was an error fetching the status!', error);
    }
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>Botnet Manager</Typography>
          <Button color="inherit" onClick={() => setCurrentView('add')}>Add Bot</Button>
          <Button color="inherit" onClick={() => setCurrentView('remove')}>Remove Bot</Button>
          <Button color="inherit" onClick={() => setCurrentView('list')}>List Bots</Button>
          <Button color="inherit" onClick={() => setCurrentView('command')}>Send Command</Button>
          <Button color="inherit" onClick={() => setCurrentView('status')}>Get Status</Button>
        </Toolbar>
      </AppBar>
      <Container style={{ marginTop: '20px' }}>
        {currentView === 'add' && (
          <Paper style={{ padding: '20px' }}>
            <Typography variant="h4" gutterBottom>Add Bot</Typography>
            <TextField label="Bot ID" value={id} onChange={(e) => setId(e.target.value)} fullWidth margin="normal" />
            <TextField label="Bot Info" value={info} onChange={(e) => setInfo(e.target.value)} fullWidth margin="normal" />
            <Button variant="contained" color="primary" onClick={handleAddBot}>Add</Button>
            {message && <Typography variant="body1" color="textSecondary">{message}</Typography>}
          </Paper>
        )}
        {currentView === 'remove' && (
          <Paper style={{ padding: '20px' }}>
            <Typography variant="h4" gutterBottom>Remove Bot</Typography>
            <TextField label="Bot ID" value={id} onChange={(e) => setId(e.target.value)} fullWidth margin="normal" />
            <Button variant="contained" color="primary" onClick={handleRemoveBot}>Remove</Button>
            {message && <Typography variant="body1" color="textSecondary">{message}</Typography>}
          </Paper>
        )}
        {currentView === 'list' && (
          <Paper style={{ padding: '20px' }}>
            <Typography variant="h4" gutterBottom>List Bots</Typography>
            <Button variant="contained" color="primary" onClick={fetchBots}>List</Button>
            <List>
              {Object.entries(bots).map(([botId, botInfo]) => (
                <ListItem key={botId}>
                  {botId}: {JSON.stringify(botInfo)}
                </ListItem>
              ))}
            </List>
          </Paper>
        )}
        {currentView === 'command' && (
          <Paper style={{ padding: '20px' }}>
            <Typography variant="h4" gutterBottom>Send Command</Typography>
            <TextField label="Bot ID" value={id} onChange={(e) => setId(e.target.value)} fullWidth margin="normal" />
            <TextField label="Command" value={command} onChange={(e) => setCommand(e.target.value)} fullWidth margin="normal" />
            <Button variant="contained" color="primary" onClick={handleSendCommand}>Send</Button>
            {message && <Typography variant="body1" color="textSecondary">{message}</Typography>}
          </Paper>
        )}
        {currentView === 'status' && (
          <Paper style={{ padding: '20px' }}>
            <Typography variant="h4" gutterBottom>Get Status</Typography>
            <TextField label="Bot ID" value={id} onChange={(e) => setId(e.target.value)} fullWidth margin="normal" />
            <Button variant="contained" color="primary" onClick={fetchStatus}>Get Status</Button>
            {status && <Typography variant="body1" color="textSecondary">{status}</Typography>}
          </Paper>
        )}
      </Container>
    </div>
  );
}

export default BotnetManagement;

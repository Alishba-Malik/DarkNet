import React, { useState } from 'react';
import axios from 'axios';
import { AppBar, Toolbar, Typography, Button, Container, TextField, Paper, List, ListItem } from '@mui/material';

const FileManipulation = () => {
  const [currentView, setCurrentView] = useState('create');
  const [path, setPath] = useState('');
  const [name, setName] = useState('');
  const [oldName, setOldName] = useState('');
  const [newName, setNewName] = useState('');
  const [sourcePath, setSourcePath] = useState('');
  const [destinationPath, setDestinationPath] = useState('');
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState([]);

  const handleCreateDirectory = async () => {
    try {
      const response = await axios.post('http://localhost:5000/create_directory', { path, name });
      setMessage(response.data.message);
    } catch (error) {
      console.error('There was an error creating the directory!', error);
    }
  };

  const handleDeleteDirectory = async () => {
    try {
      const response = await axios.post('http://localhost:5000/delete_directory', { path, name });
      setMessage(response.data.message);
    } catch (error) {
      console.error('There was an error deleting the directory!', error);
    }
  };

  const handleListFiles = async () => {
    try {
      const response = await axios.post('http://localhost:5000/list_files', { path, name });
      if (response.data.files) {
        setFiles(response.data.files);
        setMessage('');
      } else {
        setMessage(response.data);
        setFiles([]);
      }
    } catch (error) {
      console.error('There was an error listing the files!', error);
    }
  };

  const handleRenameDirectory = async () => {
    try {
      const response = await axios.post('http://localhost:5000/rename_directory', { path, old_name: oldName, new_name: newName });
      setMessage(response.data.message);
    } catch (error) {
      console.error('There was an error renaming the directory!', error);
    }
  };

  const handleMoveFiles = async () => {
    try {
      const response = await axios.post('http://localhost:5000/move_files', { source_path: sourcePath, destination_path: destinationPath });
      setMessage(response.data.message);
    } catch (error) {
      console.error('There was an error moving the files!', error);
    }
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>Directory Manager</Typography>
          <Button color="inherit" onClick={() => setCurrentView('create')}>Create Directory</Button>
          <Button color="inherit" onClick={() => setCurrentView('delete')}>Delete Directory</Button>
          <Button color="inherit" onClick={() => setCurrentView('list')}>List Files</Button>
          <Button color="inherit" onClick={() => setCurrentView('rename')}>Rename Directory</Button>
          <Button color="inherit" onClick={() => setCurrentView('move')}>Move Files</Button>
        </Toolbar>
      </AppBar>
      <Container style={{ marginTop: '20px' }}>
        {currentView === 'create' && (
          <Paper style={{ padding: '20px' }}>
            <Typography variant="h4" gutterBottom>Create Directory</Typography>
            <TextField label="Path" value={path} onChange={(e) => setPath(e.target.value)} fullWidth margin="normal" />
            <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth margin="normal" />
            <Button variant="contained" color="primary" onClick={handleCreateDirectory}>Create</Button>
            {message && <Typography variant="body1" color="textSecondary">{message}</Typography>}
          </Paper>
        )}
        {currentView === 'delete' && (
          <Paper style={{ padding: '20px' }}>
            <Typography variant="h4" gutterBottom>Delete Directory</Typography>
            <TextField label="Path" value={path} onChange={(e) => setPath(e.target.value)} fullWidth margin="normal" />
            <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth margin="normal" />
            <Button variant="contained" color="primary" onClick={handleDeleteDirectory}>Delete</Button>
            {message && <Typography variant="body1" color="textSecondary">{message}</Typography>}
          </Paper>
        )}
        {currentView === 'list' && (
          <Paper style={{ padding: '20px' }}>
            <Typography variant="h4" gutterBottom>List Files</Typography>
            <TextField label="Path" value={path} onChange={(e) => setPath(e.target.value)} fullWidth margin="normal" />
            <TextField label="Directory Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth margin="normal" />
            <Button variant="contained" color="primary" onClick={handleListFiles}>List</Button>
            {message && <Typography variant="body1" color="textSecondary">{message}</Typography>}
            {files.length > 0 && (
              <List>
                {files.map((file, index) => (
                  <ListItem key={index}>{file}</ListItem>
                ))}
              </List>
            )}
          </Paper>
        )}
        {currentView === 'rename' && (
          <Paper style={{ padding: '20px' }}>
            <Typography variant="h4" gutterBottom>Rename Directory</Typography>
            <TextField label="Path" value={path} onChange={(e) => setPath(e.target.value)} fullWidth margin="normal" />
            <TextField label="Old Name" value={oldName} onChange={(e) => setOldName(e.target.value)} fullWidth margin="normal" />
            <TextField label="New Name" value={newName} onChange={(e) => setNewName(e.target.value)} fullWidth margin="normal" />
            <Button variant="contained" color="primary" onClick={handleRenameDirectory}>Rename</Button>
            {message && <Typography variant="body1" color="textSecondary">{message}</Typography>}
          </Paper>
        )}
        {currentView === 'move' && (
          <Paper style={{ padding: '20px' }}>
            <Typography variant="h4" gutterBottom>Move Files</Typography>
            <TextField label="Source Path" value={sourcePath} onChange={(e) => setSourcePath(e.target.value)} fullWidth margin="normal" />
            <TextField label="Destination Path" value={destinationPath} onChange={(e) => setDestinationPath(e.target.value)} fullWidth margin="normal" />
            <Button variant="contained" color="primary" onClick={handleMoveFiles}>Move</Button>
            {message && <Typography variant="body1" color="textSecondary">{message}</Typography>}
          </Paper>
        )}
      </Container>
    </div>
  );
}

export default FileManipulation;

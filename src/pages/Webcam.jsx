import React, { useState } from 'react';
import axios from 'axios';
import { CircularProgress, Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const ControlPanel = () => {
  const [loading, setLoading] = useState({
    screenshot: false,
    microphone: false,
    webcam: false,
    email: false,
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleCaptureScreenshot = async () => {
    setLoading({ ...loading, screenshot: true });
    try {
      const response = await axios.post('http://localhost:5000/screenshot');
      setSnackbar({ open: true, message: response.data.message, severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Error capturing screenshot', severity: 'error' });
    }
    setLoading({ ...loading, screenshot: false });
  };

  const handleCaptureMicrophone = async () => {
    setLoading({ ...loading, microphone: true });
    try {
      const response = await axios.post('http://localhost:5000/microphone');
      setSnackbar({ open: true, message: response.data.message, severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Error recording microphone', severity: 'error' });
    }
    setLoading({ ...loading, microphone: false });
  };

  const handleCaptureWebcam = async () => {
    setLoading({ ...loading, webcam: true });
    try {
      const response = await axios.post('http://localhost:5000/webcam');
      setSnackbar({ open: true, message: response.data.message, severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Error capturing webcam snapshot', severity: 'error' });
    }
    setLoading({ ...loading, webcam: false });
  };

  const handleSendEmail = async () => {
    setLoading({ ...loading, email: true });
    try {
      const response = await axios.post('http://localhost:5000/send_email');
      setSnackbar({ open: true, message: response.data.message, severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Error sending email', severity: 'error' });
    }
    setLoading({ ...loading, email: false });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <div className="control-panel">
      <h1 className="heading">Control Panel</h1>
      <div className="button-group">
        <button onClick={handleCaptureScreenshot} disabled={loading.screenshot}>
          {loading.screenshot ? <CircularProgress size={24} /> : 'Capture Screenshot'}
        </button>
        <button onClick={handleCaptureMicrophone} disabled={loading.microphone}>
          {loading.microphone ? <CircularProgress size={24} /> : 'Record Microphone'}
        </button>
        <button onClick={handleCaptureWebcam} disabled={loading.webcam}>
          {loading.webcam ? <CircularProgress size={24} /> : 'Capture Webcam'}
        </button>
        <button onClick={handleSendEmail} disabled={loading.email}>
          {loading.email ? <CircularProgress size={24} /> : 'Send Logs via Email'}
        </button>
      </div>
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ControlPanel;

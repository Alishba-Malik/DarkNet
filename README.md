# Darknet Project

## Overview

Welcome to the **Darknet Project**. This repository is under construction, with the frontend already in place and ongoing work on the backend. The project aims to create a comprehensive dashboard for managing various cybersecurity tasks, including botnet management, DDoS attack modules, file manipulation, reverse shell attacks, keylogging, and more.

## Project Structure

- **pages/components**: Contains frontend code for all sidebar items including:
    - Dashboard
    - Botnet Management
    - DDoS Attack Modules
    - File Manipulation
    - Reverse Shell Attack
    - Keylogger
    - Webcam
    - History
- **scripts**: Contains Python scripts for various functionalities.
- **flask**: Contains backend files (currently under development).

## Features

### Dashboard

- **Status Monitoring**: Dynamically shows the server status (online/offline) and the number of connected clients.
- **Attack Launching**: Static title for launching attacks.
- **Dynamic Graphing**: Shows a dynamic graph of all packets sent.

### Botnet Management

- **Bot Operations**: Add, remove, list, get status, and send commands to bots.
- **DDoS Attack Modules**: Fully integrated with backend to launch attacks.

### File Manipulation

- **File Operations**: Remove, delete, list, rename, and move files when the reverse shell is connected.

### Reverse Shell

- **Server and Multi-client Scripts**: Manages connections and interactions with multiple clients.
- **Payload Execution**: Reverse client script for executing commands from the server.
- **File Encryption/Decryption**: Encrypt files using `malware.py` and decrypt using `decrypt.py`.

### Keylogger

- **Activity Recording**: Records keystrokes and saves logs for future access.

### Webcam

- **Media Capture**: Records screenshots, webcam footage, and audio from the client.

### History

- **Data Storage**: Stores keylogging data, screenshots, webcam footage, and audio in respective folders accessible via the history sidebar item.

## Getting Started

### Prerequisites

- Python 3.x
- Flask
- Additional Python packages as listed in `requirements.txt`

### Installation

1. **Clone the repository**:
    
    ```
    git clone <https://github.com/your-username/darknet-project.git>
    
    ```
    
2. **Navigate to the project directory**:
    
    ```
    cd darknet-project
    
    ```
    
3. **Install dependencies**:
    
    ```
    pip install -r requirements.txt
    
    ```
    

### Running the Application

1. **Start the backend server**:
    
    ```
    cd flask
    python app.py
    
    ```
    
2. **Run the frontend**:
Ensure the frontend is correctly set up to interact with the backend.

## Contributing

Contributions are welcome! Please submit a pull request or open an issue to discuss any changes or improvements.

### TODO

- Integrate backend functionalities with the frontend.
- Complete the implementation of all modules.
- Ensure seamless interaction between frontend and backend.
- Test the application thoroughly for any glitches or bugs.

## Acknowledgements

- [Flask](https://flask.palletsprojects.com/)
- [Scapy](https://scapy.net/)
- [Requests](https://docs.python-requests.org/en/latest/)

---

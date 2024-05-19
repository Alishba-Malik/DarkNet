from flask import Flask, jsonify, request
from flask_socketio import SocketIO, emit

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

# Sample endpoint for the dashboard
@app.route('/api/dashboard', methods=['GET'])
def get_dashboard_data():
    # Replace with your actual logic
    return jsonify({
        'packetData': {
            'labels': [],
            'datasets': [
                {
                    'label': 'Packets Sent',
                    'data': [],
                    'borderColor': 'rgba(75, 192, 192, 1)',
                    'backgroundColor': 'rgba(75, 192, 192, 0.2)',
                },
            ],
        },
        'moduleData': {
            'labels': ['HTTP', 'ICMP', 'UDP', 'DNS', 'TCP'],
            'datasets': [
                {
                    'label': 'Packet Distribution',
                    'data': [0, 0, 0, 0, 0],
                    'backgroundColor': [
                        'rgba(255, 99, 132, 0.6)',
                        'rgba(54, 162, 235, 0.6)',
                        'rgba(255, 206, 86, 0.6)',
                        'rgba(75, 192, 192, 0.6)',
                        'rgba(153, 102, 255, 0.6)',
                    ],
                },
            ],
        }
    })

# Sample WebSocket event for real-time data
@socketio.on('connect')
def handle_connect():
    print('Client connected')

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

@socketio.on('packetUpdate')
def handle_packet_update(data):
    emit('packetUpdate', data, broadcast=True)

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000)

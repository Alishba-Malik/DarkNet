from flask import Flask, request, jsonify
import os
import shutil

from flask_cors import CORS
app = Flask(__name__)
CORS(app)

# Create directory
@app.route('/create_directory', methods=['POST'])
def create_directory():
    data = request.get_json()
    path = data['path']
    name = data['name']
    full_path = os.path.join(path, name)
    
    try:
        if os.path.exists(full_path):
            return jsonify({"message": f"Directory '{name}' already exists."})
        os.makedirs(full_path)
        return jsonify({"message": f"Directory '{name}' has been successfully created."})
    except Exception as e:
        return jsonify({"message": str(e)})

# Delete directory
@app.route('/delete_directory', methods=['POST'])
def delete_directory():
    data = request.get_json()
    path = data['path']
    name = data['name']
    full_path = os.path.join(path, name)
    
    try:
        if not os.path.exists(full_path):
            return jsonify({"message": f"Directory '{name}' does not exist."})
        shutil.rmtree(full_path)
        return jsonify({"message": f"Directory '{name}' has been deleted successfully."})
    except Exception as e:
        return jsonify({"message": str(e)})

# List files
@app.route('/list_files', methods=['POST'])
def list_files_in_directory():
    data = request.get_json()
    path = data['path']
    name = data['name']
    full_path = os.path.join(path, name)
    
    try:
        if not os.path.exists(full_path):
            return jsonify({"message": f"Directory '{name}' does not exist."})
        files = [f for f in os.listdir(full_path) if os.path.isfile(os.path.join(full_path, f))]
        return jsonify({"files": files})
    except Exception as e:
        return jsonify({"message": str(e)})

# Rename directory
@app.route('/rename_directory', methods=['POST'])
def rename_directory():
    data = request.get_json()
    path = data['path']
    old_name = data['old_name']
    new_name = data['new_name']
    old_path = os.path.join(path, old_name)
    new_path = os.path.join(path, new_name)
    
    try:
        if not os.path.exists(old_path):
            return jsonify({"message": f"Directory '{old_name}' does not exist."})
        if os.path.exists(new_path):
            return jsonify({"message": f"Directory '{new_name}' already exists."})
        os.rename(old_path, new_path)
        return jsonify({"message": f"Directory '{old_name}' has been renamed to '{new_name}'."})
    except Exception as e:
        return jsonify({"message": str(e)})

# Move files
@app.route('/move_files', methods=['POST'])
def move_files():
    data = request.get_json()
    source_path = data['source_path']
    destination_path = data['destination_path']
    
    try:
        if not os.path.exists(source_path):
            return jsonify({"message": f"Source directory '{source_path}' does not exist."})
        if not os.path.exists(destination_path):
            return jsonify({"message": f"Destination directory '{destination_path}' does not exist."})
        
        for filename in os.listdir(source_path):
            shutil.move(os.path.join(source_path, filename), os.path.join(destination_path, filename))
        
        return jsonify({"message": "All files have been moved successfully."})
    except Exception as e:
        return jsonify({"message": str(e)})

if __name__ == '__main__':
    app.run(port=5000, debug=True)

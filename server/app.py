from flask import Flask, request, jsonify
from flask_socketio import SocketIO, send, emit

# Declare Flask app and SocketIO encapsulation
app = Flask(__name__)
socket = SocketIO(app)

@socket.on("add_model")
def handle_add_model(json):
  print(json)

@socket.on('connect')
def handle_connect():
  print("Client connected")

@socket.on('disconnect')
def test_disconnect():
  print('Client disconnected')



if __name__ == '__main__':
  socket.run(app, debug=True, host='localhost', port=5000)
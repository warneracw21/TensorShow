from flask import Flask, request, jsonify
from flask_socketio import SocketIO, send, emit
from build_model import build_model
from pprint import pprint

# Declare Flask app and SocketIO encapsulation
app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socket = SocketIO(app, cors_allowed_origins='*')

# Set up data structure that will hold all of the models
saved_model_store = {}
training_model_store = {}

@socket.on('add_new_model')
def handle_add_new_model(json):
  model_data = json['data']
  model = build_model(model_data['layer_params'])
  model.summary()

  saved_model_store[model_data["model_key"]] = model
  pprint(saved_model_store)


@socket.on('connect')
def handle_connect():
  print("\n==============\nClient connected\n==============\n")

@socket.on('disconnect')
def handle_disconnect():
  print("\n==============\nClient disconnected\n==============\n")



if __name__ == '__main__':
  socket.run(app, debug=True, host='127.0.0.1', port=5000)
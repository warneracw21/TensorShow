from flask import Flask, request, jsonify
from flask_socketio import SocketIO, send, emit
from build_model import build_model
from callback import TensorShowCallback
from pprint import pprint
import tensorflow as tf
import numpy as np

# Declare Flask app and SocketIO encapsulation
app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socket = SocketIO(app, cors_allowed_origins='*')

# Set up data structure that will hold all of the models
saved_model_store = {}

# Load dataset
(x_train, y_train), (x_test, y_test) = tf.keras.datasets.mnist.load_data()
x_val = np.expand_dims(x_train[-10000:], -1)
y_val = y_train[-10000:]
x_train = np.expand_dims(x_train[:-10000], -1)
y_train = y_train[:-10000]

@socket.on('add_new_model')
def handle_add_new_model(json):
  model_data = json['data']
  model = build_model(model_data['layer_params'])
  model.summary()

  saved_model_store[model_data["model_key"]] = model


@socket.on('train_new_model')
def handle_train_new_model(json):
  train_params = json['data']
  model_key = train_params['model_key']

  def tensorshow_callback(model_key, event, data):
    print(data)
    return socket.emit(
      event,
      {
        "model_key": model_key,
        "data": data
      })

  tensorshow_callback = TensorShowCallback(
    model_key=model_key,
    dispatch=tensorshow_callback
  )

  model_obj = saved_model_store[model_key]
  model_obj.compile(
    optimizer=tf.keras.optimizers.RMSprop(),
    loss=tf.keras.losses.CategoricalCrossentropy(from_logits=True),
    metrics=['sparse_categorical_accuracy'])

  model_obj.fit(x_train, y_train,
    batch_size=256,
    epochs=10,
    validation_data=(x_val, y_val),
    callbacks=[tensorshow_callback])

@socket.on("request_model_file")
def handle_request_model_file(json):
  print(json)
  model_key = json['data']['model_key']

  socket.emit("emit_model_file", {
      "model_key": model_key,
      "model_file": saved_model_store[model_key].to_json()
    })


@socket.on('connect')
def handle_connect():
  print("\n==============\nClient connected\n==============\n")

@socket.on('disconnect')
def handle_disconnect():
  print("\n==============\nClient disconnected\n==============\n")



if __name__ == '__main__':
  socket.run(app, debug=True, host='127.0.0.1', port=5000)
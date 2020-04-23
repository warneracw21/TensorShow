// Set up socket connection
var socket = require('socket.io-client')('http://localhost:5000');

const emitModel = ({ model_key, layer_params }) => {
	socket.emit("add_new_model", {data: {
		model_key: model_key,
		layer_params: layer_params
	}})
}



export { socket, emitModel }
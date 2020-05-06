// Set up socket connection
var socket = require('socket.io-client')('http://localhost:8000');

const emitModel = ({ model_key, layer_params }) => {
	socket.emit("add_new_model", {data: {
		model_key: model_key,
		layer_params: layer_params
	}})
}

const emitTrain = ({ model_key, num_epochs, batch_size, optimizer_type }) => {
	socket.emit("train_new_model", {data: {
		model_key: model_key,
		num_epochs: num_epochs,
		batch_size: batch_size,
		optimizer_type: optimizer_type
	}})
}

const requestModelFile = ({model_key}) => {
	socket.emit("request_model_file", {data: {
		model_key: model_key,
	}})
}



export { socket, emitModel, emitTrain, requestModelFile }
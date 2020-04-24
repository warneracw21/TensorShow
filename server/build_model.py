import tensorflow as tf

dataset_shapes = {
	'CIFAR10': [32, 32, 3],
	'CIFAR100': [32, 32, 3],
	'MNIST Digits': [28, 28, 1],
	'MNIST Fashion': [28, 28, 1]
}

def build_input_layer(params):
	input_shape = dataset_shapes[params['dataset_name']]
	return tf.keras.Input(
		shape=input_shape)


def build_conv_layer(params):
	filters = int(params['window']['channels'])
	print(filters)
	kernel_size = [int(params['window']['width']), int(params['window']['height'])]
	print(kernel_size)
	strides = [params['stride']['x'], params['stride']['y']]
	print(strides)
	activation = params['activation'] if params['activation'] != "None" else None
	kernel_regularizer = params['regularization'] if params['regularization'] != "None" else None

	return tf.keras.layers.Conv2D(
		filters=filters,
		kernel_size=kernel_size,
		strides=strides,
		activation=activation,
		kernel_regularizer=kernel_regularizer)


def build_pool_layer(params):
	if (params['pooling'] == "Maximum Pooling"):
		pool_constructor = tf.keras.layers.MaxPool2D
	else:
		pool_constructor = tf.keras.layers.AveragePooling2D

	pool_size = [params['window']['width'], params['window']['width']]
	strides = [params['stride']['x'], params['stride']['y']]

	return pool_constructor(
		pool_size=pool_size,
		strides=strides)


def build_fully_connected_layer(params):
	units = params['output']['units']
	activation = params['activation'] if params['activation'] != "None" else None
	kernel_regularizer = params['regularization'] if params['regularization'] != "None" else None

	return tf.keras.layers.Dense(
		units=units,
		activation=activation,
		kernel_regularizer=kernel_regularizer)






def build_model(layer_params):

	hit_full = False
	last_layer_index = len(layer_params) - 1

	for ind, layer_param in enumerate(layer_params):
		layer_type = layer_param['layer_type']
		params = layer_param['layer_params']

		if (layer_type == 'input_layer'):
			print("Build Input Layer")
			inputs = build_input_layer(params)
			net = inputs

		elif (layer_type == 'full_layer'):
			if not(hit_full):
				print("Build Flatten Layer")
				net = tf.keras.layers.Flatten()(net)

			if ind == last_layer_index:
				print("Build Fully Connected Layer")
				net = build_fully_connected_layer(params)(net)
				print("End of Model")

			else:
				print("Build Fully Connected Layer")
				net = build_fully_connected_layer(params)(net)


		elif (layer_type == 'conv_layer'):
			print("Build Convolutional Layer")
			net = build_conv_layer(params)(net)

		elif (layer_type == 'pool_layer'):
			print("Build Pooling Layer")
			net = build_pool_layer(params)(net)

	return tf.keras.Model(inputs=inputs, outputs=net, name="Model")


# TensorShow
## Usage
### Clone the repository locally
* `git clone https://github.com/warneracw21/TensorShow.git`

### Install Python Requirements
* `cd server`
* `pip install -r requirements.txt`
* `pip install eventlet`

### Install Node Requirements
* `cd ../tensor-show`
* `yarn global add serve`
* `serve -s build`

### Run Package
* `sh run.sh`




## Project Overview
TensorShow provides a graphical user interface (GUI) for designing, training and evaluating Convolutional Neural Networks (CNNs). CNNs are a useful network design for machine learning tasks such as image classification. CNNs are able to process images by feeding them forward through a deep architecture of computationally intensive layers. Such layers include convolutional layers, pooling layers, and fully connected layers. Convolutional layers filter a kernel over an image in order to extract features by computing the inner product between the kernel and the window of the image. The weight values in the kernels are learned as the network is fed more images. Pooling layers filter a window over an image and return a single value depending on the type of pooling operation specified. Such pooling operations include maximum pooling, where the maximum value in the window of the image is returned, or average pooling, where the average value in the window of the image is returned. Fully connected layers flatten the image into a vector and pass it forward through a Deep Neural Network (DNN). Classification is achieved after passing the output of the last fully connected layer into the SoftMax function where a probability distribution over the class labels is returned. Users are able to easily construct multiple CNNs by branching the different compatible CNN layers. This allows users to try different combinations of hyperparameters (kernel window size, pooling window size, fully connected output units, etc.) and different permutations of CNN layer types. Moreover, users can deploy models to a TensorFlow backend for quick training and receive useful training insights such as loss values and accuracy values of the network on training sets. Users can choose from four different datasets to train and compare the different CNN networks constructed: CIFAR10, CIFAR100, MNIST-Digits, and MNIST Fashion. Each dataset provides tens of thousands of training and test images that are easily fed through CNNs. Users can test their accuracy and loss scores against benchmarks available these commonly used datasets. TensorShow was built using the React framework for the JavaScript frontend and TensorFlow for the machine learning infrastructure in the backend. The two components are connected using socket level TCP transfer for live inference of training models. Altogether, the components are connected to deliver a full stack application.

## Background
Background
TensorShow harnesses cutting edge mathematical and technological advances in machine learning and application development to provide a seamless user experience. Convolutional Neural Networks can be difficult to visualize during construction. TensorShow allows users to understand the flow of their networks as they are constructed. Moreover, in order to train the networks efficiently, TensorFlow is used in the backend for the most computationally expensive operations. The application is developed using the React JavaScript framework because it provides easy to use mechanisms for maintain the state of the application. Moreover, React allows real time Document Object Model (DOM) manipulation and rendering which reduces overhead.  The user-interface is designed using Google’s Material-UI Kit because of the simplicity and functionality of the components. Lastly, Socket.IO is used to provide an interface to the TCP level transmission of data from the TensorFlow backend to the React frontend.


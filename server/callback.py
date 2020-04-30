from __future__ import absolute_import

from keras.callbacks import Callback

class TensorShowCallback(Callback):


    def __init__(self, model_key, dispatch):

      self.dispatch = dispatch
      self.model_key = model_key
      self.current_epoch = 0
      self.batch_ind = 0

    def on_train_begin(self, *args):
      print("\nBegin Training\n")
      self.dispatch(
        self.model_key,
        "begin_training",
        {}
      )

    def on_train_end(self, *args):
      print("\nEnd Training\n")
      self.dispatch(
        self.model_key,
        "training_end",
        {}
        )

    def on_epoch_begin(self, epoch, *args):
      print("Begin Epoch")
      self.current_epoch = epoch
      self.batch_ind = 0

      self.dispatch(
          self.model_key,
          "begin_of_epoch",
          {
            'epoch': epoch,
          }
      )

    def on_epoch_end(self, epoch, *args):
      print("End Epoch")
      self.dispatch(
          self.model_key,
          "end_of_epoch",
          {
            'epoch': epoch,
          }
      )

    def on_train_batch_begin(self, batch, logs=None):
      print("Begin Batch %d" % self.batch_ind)
      self.dispatch(
            self.model_key,
            "begin_of_batch",
            {
                'batch': self.batch_ind,
                'epoch': self.current_epoch,
            }
        )

    def on_train_batch_end(self, batch, logs):
        print(logs)
        self.dispatch(
            self.model_key,
            "end_of_batch",
            {
                'batch': self.batch_ind,
                'epoch': self.current_epoch,
                'loss': str(logs['loss']),
                'accuracy': str(logs['sparse_categorical_accuracy'])
                
            }
        )

        self.batch_ind += 1

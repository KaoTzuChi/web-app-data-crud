from django.db import models

# Create your models here.

class myModel(object):
    def __init__(self, _id, field1, field2, field3, field4):
       self._id =_id
       self.field1 = field1
       self.field2 = field2
       self.field3 = field3
       self.field4 = field4
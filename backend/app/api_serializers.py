from rest_framework import serializers
from datetime import date, time, datetime, tzinfo
import datetime
from . import models

class mySerializer(serializers.Serializer):
    _id = serializers.CharField(required=False)
    field1 = serializers.CharField(required=False)
    field2 = serializers.DictField(serializers.CharField(required=False, default=''))
    field3 = serializers.DateTimeField(required=False,default=datetime.datetime.now())  
    field4 = serializers.DecimalField(max_digits=3, decimal_places=2, required=False, default=0.00)

    def create(self, attrs, instance=None):
        if instance:
            instance._id = attrs.get('_id', instance._id)
            instance.field1 = attrs.get('field1', instance.field1)
            instance.field2 = attrs.get('field2', instance.field2)
            instance.field3 = attrs.get('field3', instance.field3)
            instance.field4 = attrs.get('field4', instance.field4)
            return instance
        return models.myModel(attrs.get('_id'), attrs.get('field1'), attrs.get('field2')
        , attrs.get('field3'), attrs.get('field4'))

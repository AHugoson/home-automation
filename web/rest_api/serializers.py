from rest_framework import serializers
from control.models import Alarm

class AlarmSerializer(serializers.ModelSerializer):
  class Meta:
    model = Alarm
    fields = ('id', 'name', 'active', 'days', 'time', 'command')
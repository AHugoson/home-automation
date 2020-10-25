from django.shortcuts import render
from rest_framework import viewsets
from .serializers import AlarmSerializer
from control.models import Alarm

class AlarmView(viewsets.ModelViewSet):
  serializer_class = AlarmSerializer
  queryset = Alarm.objects.all()
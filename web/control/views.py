from django.shortcuts import render
from .models import Alarm

def home(request):
    context = {
        'alarms': Alarm.objects.all()
    }
    return render(request, 'control/home.html', context)

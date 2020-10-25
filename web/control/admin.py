from django.contrib import admin
from .models import Alarm

class AlarmAdmin(admin.ModelAdmin):
    list_display = ('name', 'time', 'command', 'days', 'active')

admin.site.register(Alarm, AlarmAdmin)

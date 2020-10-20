from django.db import models

class Alarm(models.Model):
    name = models.CharField(max_length=100)
    active = models.BooleanField(default=True)
    days = models.IntegerField(default=0)
    time = models.TimeField()
    command = models.CharField(max_length=100)

    def __str__(self):
        return self.name
from django.db import models

# Create your models here.

class User(models.Model):
	fname = models.CharField(max_length=256, blank=True, default='')
	lname = models.CharField(max_length=256, blank=True, default='')
	email = models.CharField(max_length=256, blank=True, default='')
	passw = models.CharField(max_length=256, blank=True, default='') #md5 thing check later

	user_location = models.TextField() #location = #dictionary field mongoengine
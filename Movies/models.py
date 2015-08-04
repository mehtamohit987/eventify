from django.db import models

# Create your models here.

class Movie(models.Model):
	title = models.CharField(max_length=256, blank=True, default='')
	description = models.TextField()
	image_thumbnail_url = models.TextField()
	image_full_url = models.TextField()



class Theatre(models.model):
	name = models.CharField(max_length=256, blank=True, default='')
	location = models.TextField() #location = #dictionary field mongoengine



class ShowTime(models.Model):
	organizer = models.CharField(max_length=256, blank=True, default='') # check api for data
	theatre = models.ForeignKey(Theatre)
	movie = models.ForeignKey(Movie)

	start_timestamp = models.DateTimeField()
	end_timestamp = models.DateTimeField()
	created = models.DateTimeField(auto_now_add=True)

from mongoengine import *
from datetime import datetime
from django.db import models

class Event(Document):
	title 				= StringField(max_length=256, required=True)	
	start_timestamp 	= DateTimeField(default=datetime(1970,1,1,0,0,0,0))
	end_timestamp 		= DateTimeField(default=datetime(1970,1,1,0,0,0,0))
	description 		= StringField(default='')
	
	organizer 			= StringField(max_length=256, default='')
	event_category 		= StringField(max_length=100, default='')
	

	address			 	= StringField(max_length=512, default='')
	city		 		= StringField(max_length=100, default='')
	country			 	= StringField(max_length=16, default='')
	postal_code 		= StringField(max_length=50, default='')
	coordinates 		= StringField(default='')
		

	source 				= StringField(choices=['eventbrite', 'eventful'], default='eventbrite', max_length=10)
	source_server_id	= StringField(max_length=100)
	image_thumbnail_url = URLField()
	info_url 			= URLField()
	created 			= DateTimeField(default=datetime.now())

	django_id			= IntField(default=1)
	django_ct 			= StringField(max_length=13, default='Events.dummy')


	meta 				= {
							'ordering' : ['start_timestamp'],
							'indexes': [
								('title', 'start_timestamp','coordinates')
							]
						}

	def save(self, *args, **kwargs):
		if not self.created:
			self.created = datetime.now()
		return super(Event, self).save(*args, **kwargs)


class Dummy(models.Model):
	pass
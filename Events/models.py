from mongoengine import *
from datetime import datetime

connect('eventify')


class Location(EmbeddedDocument):
	address 	= StringField(max_length=256, required=True)
	city 		= StringField(max_length=25)
	country 	= StringField(max_length=16)
	postal_code = StringField(max_length=15)
	coordinates = ListField(FloatField())
	

class Event(Document):
	title 				= StringField(max_length=256, required=True)	
	start_timestamp 	= DateTimeField()
	end_timestamp 		= DateTimeField()
	description 		= StringField()
	location 			= EmbeddedDocumentField(Location)
	organizer 			= StringField(max_length=100)
	event_category 		= StringField(max_length=100)
	source 				= StringField(choices=['eventbrite', 'eventfull'], default='eventbrite', max_length=10)
	source_server_id	= StringField(max_length=100)
	image_thumbnail_url = URLField()
	info_url 			= URLField()
	created 			= DateTimeField(default=datetime.now())
	meta 				= {
							'ordering' : ['start_timestamp'],
							'indexes': [
								('title', 'start_timestamp','location.coordinates')
							]
						}

	def save(self, *args, **kwargs):
		if not self.created:
			self.created = datetime.now()
		return super(Event, self).save(*args, **kwargs)
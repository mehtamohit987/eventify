from mongoengine import *
from datetime import datetime

connect('eventify')


class Location(EmbeddedDocument):
	name = StringField(max_length=100, required=True)
	address = StringField(max_length=256)
	city = StringField(max_length=25)
	country = StringField(max_length=16)
	postal_code = StringField(max_length=15)
	coordinates = ListField(FloatField())
	#coordinates = PointField(required=True) # geo location coordinates 2dsphere index
	


class Event(Document):
	#check this uniqueness constraint in code
	title = StringField(max_length=256, required=True) # , unique_with = [str(start_timestamp), location]
	
	start_timestamp = DateTimeField()
	end_timestamp = DateTimeField()
	description = StringField()


	location = EmbeddedDocumentField(Location)
	organizer = StringField(max_length=100)
	event_category = StringField(max_length=100)	# try without choices even # redecide howto  choice=[] or eventbrite string chiice


	source = StringField(choices=['eventbrite', 'eventfull'], default='eventbrite', max_length=10)
	source_server_id = StringField(max_length=100)
	image_thumbnail_url = URLField()
	info_url = URLField()
	created = DateTimeField(default=datetime.now())	# ON OUR SERVER


	meta = {
		'ordering' : ['start_timestamp'],
		'indexes': [
			('title', 'start_timestamp','location.coordinates')
		]
	}

	def save(self, *args, **kwargs):
		if not self.created:
			self.created = datetime.now()
		return super(Event, self).save(*args, **kwargs)

# class Event(models.Model):
# 	title = models.CharField(max_length=256, blank=True, default='')
# 	description = models.TextField()
# 	organizer = models.CharField(max_length=256, blank=True, default='') # check api for data
# 	location = models.TextField() #location = #dictionary field mongoengine
	
# 	start_timestamp = models.DateTimeField()
# 	end_timestamp = models.DateTimeField()
# 	created = models.DateTimeField(auto_now_add=True)

# 	source = models.CharField(choices=['eventbrite', 'eventfull'], default='eventbrite', max_length=100)
# 	source_server_id = models.CharField(max_length=100)

# 	event_category = models.CharField(choices=['music', 'concert', 'sports'], max_length=100)	# try without choices even

# 	image_thumbnail_url = models.TextField()
# 	#image_full_url = models.TextField()



# 	class Meta:
# 		ordering =  ['start_timestamp']
# 		unique_together = (("title", "start_timestamp", "location"), )

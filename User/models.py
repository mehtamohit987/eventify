from mongoengine import *
from Events.models import Event
from datetime import datetime

class User(Document):
	fname 			= StringField(max_length=100, default='')
	lname			= StringField(max_length=100, default='')
	email 			= StringField(max_length=256, required=True, unique=True)
	password		= StringField(max_length=256, required=True)
	
	address			= StringField(max_length=512, default='')
	city		 	= StringField(max_length=100, default='')
	country			= StringField(max_length=16, default='')
	postal_code 	= StringField(max_length=50, default='')
	coordinates 	= StringField(default='')
		
	meta 			= {	'allow_inheritance'	: False, }



class UserFavourite(Document):
	user 			= ReferenceField(User)
	fav_event 		= ReferenceField(Event) #, reverse_delete_rule='CASCADE'
	timestamp 		= DateTimeField(default=datetime.now())
	def save(self, *args, **kwargs):
		if not self.timestamp:
			self.timestamp = datetime.now()
		return super(UserFavourite, self).save(*args, **kwargs)

from mongoengine import *
from Events.models import Event
connect('eventify')

class User(Document):
	fname 			= StringField(max_length=100)
	lname			= StringField(max_length=100)
	email 			= StringField(max_length=256)
	passw 			= StringField(max_length=256)
	
	address			 	= StringField(max_length=256, required=True)
	city		 		= StringField(max_length=25)
	country			 	= StringField(max_length=16)
	postal_code 		= StringField(max_length=15)
	coordinates 		= StringField()
		
	favourites 		= ListField(ReferenceField(Event))


"""

class UserFavourite(Document):
	user = ReferenceField(User)
	favourites = ListField(ReferenceField(Event))

"""
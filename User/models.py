from mongoengine import *
from Events.models import Location, Event
connect('eventify')

class User(Document):
	fname 			= StringField(max_length=100)
	lname			= StringField(max_length=100)
	email 			= StringField(max_length=256)
	passw 			= StringField(max_length=256)
	user_location 	= EmbeddedDocumentField(Location)
	favourites 		= ListField(ReferenceField(Event))
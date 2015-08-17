from mongoengine import *
from Events.models import Event


class UserFavourite(Document):
	fav_event 		= ReferenceField(Event)
	timestamp 		= DateTimeField()


class User(Document):
	fname 			= StringField(max_length=100)
	lname			= StringField(max_length=100)
	email 			= StringField(max_length=256)
	password		= StringField(max_length=256)
	
	address			= StringField(max_length=256, required=True)
	city		 	= StringField(max_length=25)
	country			= StringField(max_length=16)
	postal_code 	= StringField(max_length=15)
	coordinates 	= StringField()
		
	favourites 		= ListField(UserFavourite)

	meta 			= {	'allow_inheritance'	: False, }
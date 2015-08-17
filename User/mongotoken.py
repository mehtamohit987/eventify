import binascii
import os
from django.conf import settings
from datetime import datetime
from django.utils.timezone import now
from mongoengine import Document, StringField, ReferenceField
from mongoengine.fields import DateTimeField
from models import User

class MongoToken(Document):
	key=StringField(max_length=44)
	user=ReferenceField(User,required=True)
	created=DateTimeField(default=datetime.now)

	# def __init__(self,*args,**values):
		# super().__init__(*args, **values)
		# if not self.key=self.generate_key()

	def save(self, *args, **kwargs):
		if not self.key:
			self.key=self.generate_key()
		return super(MongoToken,self).save(*args,**kwargs)

	def generate_key(self):
		return binascii.hexlify(os.urandom(22)).decode()

	def __str__(self):
		return self.key


    	

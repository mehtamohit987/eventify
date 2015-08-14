from rest_framework_mongoengine.serializers import DocumentSerializer
from .models import User

class UserSerializer(DocumentSerializer):
	class Meta:
		# most probably womt wor would bneeef a way ro serialixzee list odf references and return appropriate detailed objects
		model  = User
		fields = ('id', 'fname', 'lname', 'email', 'address', 'city', 'country', 'postal_code', 'coordinates')
		# depth=2
# class UserFavourite(DocumentSerializer):
# 	class Meta
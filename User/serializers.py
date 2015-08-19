from rest_framework_mongoengine.serializers import DocumentSerializer, EmbeddedDocumentSerializer
from .models import User, UserFavourite
from rest_framework.authtoken.serializers import AuthTokenSerializer
from rest_framework.exceptions import ValidationError

class UserFavouriteSerializer(DocumentSerializer):
	class Meta:
		model = UserFavourite
		fields = ('id', 'user','fav_event', 'timestamp')
		read_only_fields=('id',)


class UserSerializer(DocumentSerializer):
	class Meta:
		model = User
		fields = ('id', 'fname', 'lname', 'email', 'password', 'email', 'address', 'city', 'country', 'postal_code', 'coordinates')
		read_only_fields=('id',)
		write_only_fields=('password',)
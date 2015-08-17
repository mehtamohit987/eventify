from rest_framework_mongoengine.serializers import DocumentSerializer
from .models import User
from rest_framework.authtoken.serializers import AuthTokenSerializer
from rest_framework.exceptions import ValidationError


class UserSerializer(DocumentSerializer):
	class Meta:
		model = User
		fields = ('id','fname', 'lname', 'email', 'password', 'email', 'address', 'city', 'country', 'postal_code', 'coordinates')

		read_only_fields=('id',)
		write_only_fields=('password')
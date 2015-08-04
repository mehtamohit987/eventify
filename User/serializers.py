from rest_framework_mongoengine.serializers import DocumentSerializer
from .models import User

class EventSerializer(DocumentSerializer):
	class Meta:
		model = User
		fields = ('fname', 'lname', 'email', 'user_location')
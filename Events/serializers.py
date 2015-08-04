from rest_framework_mongoengine.serializers import DocumentSerializer
from .models import Event

class EventSerializer(DocumentSerializer):
	class Meta:
		model = Event
		fields = ('title', 'description', 'organizer', 'location', 'start_timestamp', 'end_timestamp', 'image_thumbnail_url')
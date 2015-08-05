from rest_framework_mongoengine.serializers import DocumentSerializer, EmbeddedDocumentSerializer
from .models import Event

class EventSerializer(DocumentSerializer):
	class Meta:
		model 	= Event
		# fields 	= ('title', 'start_timestamp', 'end_timestamp', 'description', 'location', 'organizer', 'event_category', 'image_thumbnail_url', 'info_url')
		depth 	= 2 
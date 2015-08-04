from rest_framework_mongoengine.serializers import DocumentSerializer
from .models import Movie, Theatre, ShowTime

class MovieSerializer(DocumentSerializer):
	class Meta:
		model = Movie
		fields = ()


class TheatreSerializer(DocumentSerializer):
	class Meta:
		model = Theatre
		fields = ()
		


class ShowTimeSerializer(DocumentSerializer):
	class Meta:
		model = ShowTime
		fields = ()

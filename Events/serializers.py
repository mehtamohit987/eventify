from rest_framework import serializers
from rest_framework_mongoengine.serializers import DocumentSerializer
from .models import Event
from Events.search_indexes import EventIndex
from drf_haystack.serializers import HaystackSerializer


class CustomModelSerializer(serializers.ModelSerializer):

    def _include_additional_options(self, *args, **kwargs):
        return self.get_extra_kwargs()

    def _get_default_field_names(self, *args, **kwargs):
        return self.get_field_names(*args, **kwargs)

class CustomDocumentSerializer(CustomModelSerializer, DocumentSerializer):
    pass


class EventSerializer(CustomDocumentSerializer):
	class Meta:
		model 	= Event
		fields 	= ('id', 'title', 'start_timestamp', 'end_timestamp', 'description', 'organizer', 'event_category', 'address', 'city', 'country', 'postal_code', 'coordinates', 'image_thumbnail_url', 'info_url') # , 'django_id', 'django_ct')
		# depth = 2

	# def to_naive(self, obj):
	# 	ret = self.__dict_class()


class EventSearchSerializer(HaystackSerializer):

    class Meta:
        # The `index_classes` attribute is a list of which search indexes
        # we want to include in the search.
        index_classes = [EventIndex]

        # The `fields` contains all the fields we want to include.
        # NOTE: Make sure you don't confuse these with model attributes. These
        # fields belong to the search index!
        # fields = [
        #     "title", "start_timestamp", "end_timestamp", "description", "organizer", "event_category", "address", "city"
        # ]


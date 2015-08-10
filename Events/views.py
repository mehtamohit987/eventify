from django.shortcuts import render
from Events.models import Event
from Events.serializers import EventSerializer
from rest_framework_mongoengine import generics as drfme_generics


class EventList(drfme_generics.ListCreateAPIView):
    queryset = Event.objects
    serializer_class = EventSerializer


class EventDetail(drfme_generics.RetrieveUpdateDestroyAPIView):
	queryset = Event.objects
	# lookup_field = 'id'
	serializer_class = EventSerializer

class EventSearch(drfme_generics.ListAPIView):
	return 

	# currently SEARCH FOR EVENT will be a view inside this app only
	# def get(self, request, format=None):
	# 	pass
	# lookup inside request.GET for url args
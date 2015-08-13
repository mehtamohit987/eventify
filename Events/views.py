from django.shortcuts import render
from Events.models import Event, Dummy
import requests
import json
from Events.serializers import EventSerializer, EventSearchSerializer
from Events.search_indexes import EventIndex
from rest_framework_mongoengine import generics as drfme_generics
from rest_framework.views import APIView
from rest_framework.response import Response

from drf_haystack.viewsets import HaystackViewSet


class EventList(drfme_generics.ListCreateAPIView):
    queryset = Event.objects
    serializer_class = EventSerializer


class EventDetail(drfme_generics.RetrieveUpdateDestroyAPIView):
	queryset = Event.objects
	# lookup_field = 'id'
	serializer_class = EventSerializer

class EventSearch(HaystackViewSet):
	index_models = [Dummy]
	serializer_class = EventSearchSerializer

# class EventSearch(APIView):
	
# 	def get(self, request, format=None):
# 		solr_host = '172.16.65.217'
# 		solr_port='8983'

# 		req = request.GET
# 		error = {"responseHeader":{"status":400}}

# 		if 'q' in req and req['q'] != None and req['q'] != '' and req['q'] != '*:*':
# 			# q = req['q'] + "~4" 
# 			q = req['q'] + "*"  
# 			# handle none of q


# 			url_params = {}

# 			url_params['q'] = q


# 			start_date_filter 	= req['start_date_filter'] if 'start_date_filter' in req else None
# 			end_date_filter 	= req['end_date_filter'] if 'end_date_filter' in req else None
# 			city_filter 		= req['city_filter'] if 'city_filter' in req else None
# 			country_filter	 	= req['country_filter'] if 'country_filter' in req else None
# 			category_filter	 	= req['category_filter'] if 'category_filter' in req else None
			
# 			start = req['start'] if 'start' in req else None
# 			limit =	req['end'] if 'limit' in req else None

# 			query_filter =	(('start_timestamp:' + start_date_filter + ' && ') if start_date_filter != None else '') + \
# 							(('end_timestamp:' + end_date_filter + ' && ') if end_date_filter != None else '') + \
# 							(('city:' + city_filter  + ' && ') if city_filter != None else '') + \
# 							(('country:' + country_filter + ' && ') if country_filter != None else '') + \
# 							(('category:' + category_filter + ' && ') if category_filter != None else '')



# 			if query_filter != '':
# 				query_filter_mod = query_filter[0:-2]
# 				url_params['fq'] = query_filter_mod

# 			if start != None:
# 				url_params['start'] = start
# 			else:
# 				url_params['start'] = '0'

# 			if limit != None:
# 				url_params['rows'] = limit
# 			else:
# 				url_params['rows'] = '10'

# 			url_params['sort'] = 'start_timestamp asc'
# 			url_params['wt'] = 'json'
			

# 			url = "http://" + solr_host + ":" + solr_port + "/solr/event/select"
			
			
# 			response = requests.get(url, params = url_params)
# 			response_json = response.json()

# 			if response.status_code == 200:
# 				return Response(response_json)
# 			else:
# 				return Response(error)


# 		else:
# 			return Response(error)
# 		
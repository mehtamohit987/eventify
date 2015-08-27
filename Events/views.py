from django.shortcuts import render
from Events.models import Event, Dummy
import requests
import json
from rest_framework.decorators import api_view
from Events.serializers import EventSerializer, EventSearchSerializer
from Events.search_indexes import EventIndex
from rest_framework_mongoengine import generics as drfme_generics
from rest_framework.views import APIView
from rest_framework import generics, status
from rest_framework.response import Response

from haystack.query import SearchQuerySet
from haystack.inputs import AutoQuery, Exact, Clean
from datetime import datetime
from haystack.utils.geo import Point, D as Distance
from django.conf import settings
from rest_framework.renderers import JSONRenderer

from django.http import HttpResponse

from Events.tasks import reload_celery
# bring in auth in post, put , delete on events

class EventList(generics.ListCreateAPIView): # Create
	paginate_by = 10

	def get_serializer_class(self):
		if self.request.method == 'GET':
			return EventSearchSerializer
		return EventSerializer


	def get_queryset(self):
		D = self.request.GET
		K = self.request.GET.viewkeys()

		q = D.get('q','')

		results = SearchQuerySet().filter(content=AutoQuery(q))

		if 'time_start' in K and 'time_end' in K:
			results = results.filter( start_timestamp__range=( datetime.strptime(D.get('time_start'), "%Y-%m-%dT%H:%M:%S"), datetime.strptime(D.get('time_end'), "%Y-%m-%dT%H:%M:%S") ) )
				
		if 'city' in K:
			results = results.narrow('city:'+ str(D.get('city'))) # (city= Exact(D.get('city')))
		if 'country' in K:
		 	results = results.narrow('country:'+str(D.get('country'))) # (country = Exact(D.get('country')))

		if 'latitude' in K and 'longitude' in K:
		  	latitude = float(D.get('latitude'))
		  	longitude = float(D.get('longitude'))
		  	P = Point(longitude, latitude) 	# (latitude, longitude)
		  	results = results.dwithin('coordinates', P, Distance(mi=250))

	  	if 'sort' in K and D.get('sort')=='true':
	  		results =  results.order_by('-num_fav')
	  		pass
	  		
  		return results


  	def perform_create(self, serializer):
  		serializer.save()
  		json_data = JSONRenderer().render([serializer.data])
		# print json_data
		r = requests.post(
			settings.HAYSTACK_CONNECTIONS['default']['URL'] + "/update",
			headers = {	"Content-Type": "application/json",	},
			data = json_data,
			)
		reload_celery.delay()

		# print r.status_code
  		

	def create(self, request, *args, **kwargs):
		serializer = self.get_serializer(data=request.data)
		serializer.is_valid(raise_exception=True)
		self.perform_create(serializer)
		headers = self.get_success_headers(serializer.data)
		return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)



class EventDetail(drfme_generics.RetrieveUpdateDestroyAPIView):
	queryset = Event.objects
	serializer_class = EventSerializer

	def perform_update(self, serializer):
		serializer.save()
		# print serializer.data
		json_data = JSONRenderer().render([serializer.data])
		print json_data
		r = requests.post(
			settings.HAYSTACK_CONNECTIONS['default']['URL'] + "/update",
			headers = {	"Content-Type": "application/json",	},
			data = json_data,
			)
		print r.status_code
		reload_celery.delay()

	def perform_destroy(self, instance):
		instance.delete()
		print str(instance.id)

		x = {}
		x['delete'] = {'id': str(instance.id)}
		print x
		json_data = JSONRenderer().render(x)
		print json_data
		r = requests.post(
			settings.HAYSTACK_CONNECTIONS['default']['URL'] + "/update",
			headers = {	"Content-Type": "application/json",	},
			data = json_data,
			)
		print r.status_code
		reload_celery.delay()

	def update(self, request, *args, **kwargs):
		partial = kwargs.pop('partial', False)
		instance = self.get_object()
		serializer = self.get_serializer(instance, data=request.data, partial=partial)
		serializer.is_valid(raise_exception=True)
		self.perform_update(serializer)
		return Response(serializer.data)

	def destroy(self, request, *args, **kwargs):
		instance = self.get_object()
		print instance
		self.perform_destroy(instance)
		return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
def autocomplete(request):
	if request.method == 'GET':
		sys = SearchQuerySet().autocomplete(title_ngram = request.GET.get('q',''))

		suggestions = [result.title for result in sys]

		suggestions_set = set(suggestions)

		suggestions_final = list(suggestions_set)[:15]

		the_data = {
			'results': suggestions
		}
		json_data = JSONRenderer().render(the_data)
		return HttpResponse(json_data, content_type="application/json")




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
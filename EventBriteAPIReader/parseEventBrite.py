import requests
from Events.models import Event
from Events.serializers import EventSerializer
from mongoengine import *
from datetime import datetime
from rest_framework.renderers import JSONRenderer
from django.conf import settings

# connect('eventify', host='127.0.0.1', port=27017, username="eventifyUser", password="eventifyPassword")


start = 18
start_date = '2015-08-'+str(start)+'T00:00:00Z'
end_date = '2015-08-'+str(start+1)+'T00:00:00Z'
# future : automated do by current timestamp + 10 days after date crawl

count = 0
count_saved = 0
count_skipped = 0

for page_num in xrange(1,7):

	print "\n\nOn page" + str(page_num)
	url_parms = {
					'start_date.range_start':start_date,
					'start_date.range_end':end_date,
					'page': page_num
		}	

	url_header = {
			"Authorization": "Bearer NS4IMTEUWVQA552VVJPZ",
		}

	

	response = requests.get(
		"https://www.eventbriteapi.com/v3/events/search/",
		headers = url_header,
		verify = True,
		params = url_parms 
		)


	if response.status_code == 200:

		for i in response.json()['events']:

			count+=1

			if 'name' in i and i['name']!=None and 'text' in i['name'] and i['name']['text']!=None and \
			'start' in i and i['start']!=None and 'utc' in i['start'] and i['start']['utc']!=None and \
 			'end' in i and i['end']!=None and 'utc' in i['end'] and i['end']['utc']!=None and \
			 'organizer_id' in i and 'venue_id' in i and 'category_id' in i:
				org_response = requests.get(
					"https://www.eventbriteapi.com/v3/organizers/"+str(i['organizer_id']) +"/",
					headers = url_header,
					verify = True,
					)
				loc_response = requests.get(
					"https://www.eventbriteapi.com/v3/venues/"+str(i['venue_id']) +"/",
					headers = url_header,
					verify = True,
					)
				cat_response =  requests.get(
					"https://www.eventbriteapi.com/v3/categories/"+str(i['category_id']) +"/",
					headers = url_header,
					verify = True,
					)

				if org_response.status_code == 200 and loc_response.status_code == 200 and cat_response.status_code == 200 :

					org_res = org_response.json()
					loc_res = loc_response.json()
					cat_res = cat_response.json()
				

					print i['id'] if 'id' in i else 'no id for current event'

					O = org_res['name'] if 'name' in i else None

					A = None
					
					if 'name' in loc_res:
						A = loc_res['name']


					if 'address' in loc_res and loc_res['address']!=None:
						if 'address_1' in loc_res['address'] and loc_res['address']['address_1'] != None:
							A = loc_res['address']['address_1'] if A == None else A + ',' + loc_res['address']['address_1'] 
						if 'address_2' in loc_res['address'] and loc_res['address']['address_2'] != None:
							A = loc_res['address']['address_2'] if A == None else A + ',' + loc_res['address']['address_2'] 

									

					C =  cat_res['name'] if 'name' in cat_res else None


					E = Event (
								title 			= i['name']['text'],
								start_timestamp = datetime.strptime(i['start']['utc'], "%Y-%m-%dT%H:%M:%SZ"),
								end_timestamp 	= datetime.strptime(i['end']['utc'], "%Y-%m-%dT%H:%M:%SZ"),
								description 	= i['description']['text'] if ('description' in i and i['description']!=None) else None,

								organizer 		= O,
								event_category 	= C,

								address 		= A,
								city 			= loc_res['address']['city'] if 'address' in loc_res and loc_res['address']!=None and 'city' in loc_res['address'] else None,
								country 		= loc_res['address']['country']  if 'address' in loc_res and loc_res['address']!=None and 'country' in loc_res['address'] else None,
								coordinates 	= ( loc_res['latitude'] + ", " + loc_res['longitude'] )  if ('latitude' in loc_res and 'longitude' in loc_res and loc_res['latitude']!=None and loc_res['latitude']!=None) else None,
								postal_code 	= loc_res['address']['postal_code'] if 'address' in loc_res and loc_res['address']!=None and 'postal_code' in loc_res['address'] else None,
								
								source 				= 'eventbrite',
								source_server_id 	= i['id'] if 'id' in i else None,
								image_thumbnail_url = i['logo']['url'] if ('logo' in i and i['logo']!=None) else None,
								info_url 			= i['url'] if 'url' in i else None
							)

					Q = Event.objects(title=E.title, start_timestamp=E.start_timestamp, coordinates=E.coordinates)
					
					#print Q
					if len(Q) == 0:
						E.save()
						count_saved+=1

						P = Event.objects(title=E.title, start_timestamp=E.start_timestamp, coordinates=E.coordinates)
						print P
						if len(P) > 0 :
							#print P[0]

							# fields 	= ('id', 'title', 'start_timestamp', 'end_timestamp', 'description', 'organizer', 'event_category', 'address', 'city', 'country', 'postal_code', 'coordinates', 'image_thumbnail_url', 'info_url')
							# D = {}
							# ser = EventSerializer(P[0]).data

							# for x in fields:
							# 	if x in ser  and ser[x]!=None:
							# 		D[x]=ser[x]
							
							# # D['django_id'] = D['id']
							# # D['django_ct'] = 'Events.dummy'
							
							# json_data = JSONRenderer().render([D])

							json_data = JSONRenderer().render(EventSerializer([P[0]], many=True).data) # E.data
							# print json_data, type(json_data)

							post_url_header = {
								"Content-Type": "application/json",
							}

							r = requests.post(
								settings.HAYSTACK_CONNECTIONS['default']['URL'] + "/update",
								headers = post_url_header,
								data = json_data,
								)


							print r.status_code


					else:
						count_skipped+=1

					print str(count) + " :   " + str(count_saved) + " : " + str(count_skipped)
			else:
				print "response doesn't have appropriate fields"

	else:
		print "get list failed"
import eventful
from Events.models import Event
from Events.serializers import EventSerializer
from rest_framework.renderers import JSONRenderer
from datetime import datetime
import requests
from django.conf import settings

api = eventful.API('ZjNBk59GdHJnsGd6')
count = 0
count_saved = 0
count_skipped = 0		
dates = ['01','02','03','04','05','06','07','08','09']
for x in xrange(10,28):
	dates.append(str(x))
months = ['08', '09', '10','11','12']
for month in months:
	for i in xrange(len(dates)-1):
		print dates[i]
		for page_num in xrange(1,3):#250):
			events = api.call('/events/search', t='2015'+str(month)+str(dates[i])+'00-2015'+str(month)+str(dates[i+1])+'00', page_size=30, page_number=page_num)# 100

			if events!=None:
				
				for event in events['events']['event']:
				
					add = None
					if 'venue_name' in event and event['venue_name']!=None:
						add = event['venue_name']

					if 'venue_address' in event and event['venue_address']!=None:
						add = add + ', ' + event['venue_address'] if add!= None else event['venue_address']

					if 'region_name' in event and event['region_name']!=None:
						add = add + ', ' + event['region_name'] if add!=None else event['venue_address']

					on_server_id = event['id'] if 'id' in event and event['id']!=None else None


					event_data = api.call('events/get', id = on_server_id)
					
					event_cat = event_data['categories']['category'][0]['name'] if event_data!=None and 'categories' in event_data and event_data['categories']!=None \
										and 'category' in event_data['categories'] and event_data['categories']['category']!=None \
										and len(event_data['categories']['category'])>0 and event_data['categories']['category'][0]!= None \
										and 'name' in event_data['categories']['category'][0] and event_data['categories']['category'][0]['name']!=None else None

				
					E = Event (
							title 			= event['title'] if 'title' in event and event['title']!=None else None,
							start_timestamp = datetime.strptime(event['start_time'], "%Y-%m-%d %H:%M:%S") if 'start_time' in event and event['start_time']!=None else None,
							end_timestamp 	= datetime.strptime(event['stop_time'], "%Y-%m-%d %H:%M:%S") if 'stop_time' in event and event['stop_time']!=None else None,
							description 	= event['description'] if 'description' in event and event['description']!=None else None,

							organizer 		= event['owner'] if 'owner' in event and event['owner']!=None else None,
							event_category 	= event_cat,

							address 		= add,
							city 			= event['city_name'] if 'city_name' in event and event['city_name']!=None else None,
							country 		= event['country_abbr2'] if 'country_abbr2' in event and event['country_abbr2']!=None else None,
							coordinates 	= ( event['latitude'] + ", " + event['longitude'] )  if ('latitude' in event and 'longitude' in event \
												and event['latitude']!=None and event['longitude']!=None) else None,
							postal_code 	= event['postal_code'] if 'postal_code' in event and event['postal_code']!=None else None,
							
							source 				= 'eventful',
							source_server_id	= on_server_id,
							image_thumbnail_url = event['image']['medium']['url'] if 'image' in event and event['image']!=None and 'medium' in event['image'] \
													and event['image']['medium']!=None and 'url' in event['image']['medium'] and event['image']['medium']['url']!=None else None,
							info_url 			= event['url'] if 'url' in event and event['url']!=None else None,
						)

					Q = Event.objects(title=E.title, start_timestamp=E.start_timestamp, coordinates=E.coordinates)
								
					if len(Q) == 0:
						E.save()
						count_saved+=1

						P = Event.objects(title=E.title, start_timestamp=E.start_timestamp, coordinates=E.coordinates)
						# print P
						if len(P) > 0 :
							#print P[0]

							# fields 	= ('id', 'title', 'start_timestamp', 'end_timestamp', 'description', 'organizer', 'event_category', 'address', 'city', 'country', 'postal_code', 'coordinates', 'image_thumbnail_url', 'info_url')
							# D = {}
							# ser = EventSerializer(P[0]).data

							# for x in fields:
							# 	if x in ser  and ser[x]!=None:
							# 		D[x]=ser[x]
							
							# D['django_id'] = D['id']
							# D['django_ct'] = 'Events.dummy'
							
							# json_data = JSONRenderer().render([D])
							json_data = JSONRenderer().render(EventSerializer([P[0]], many=True).data) # E.data			

							post_url_header = {
								"Content-Type": "application/json",
							}
							# print json_data
							r = requests.post(
								settings.HAYSTACK_CONNECTIONS['default']['URL'] + "/update",
								headers = post_url_header,
								data = json_data,
								)


							if r.status_code != 200: print "post failure"

					else:
						count_skipped+=1

				print str(count) + " :   " + str(count_saved) + " : " + str(count_skipped)


			else:
				break
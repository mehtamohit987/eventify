import requests
from Events.models import Location, Event
from mongoengine import *
from datetime import datetime

connect('eventify')


start = 10
start_date = '2015-08-'+str(start)+'T00:00:00Z'
end_date = '2015-08-'+str(start+1)+'T00:00:00Z'
# future : automated do by current timestamp + 10 days after date crawl



for page_num in xrange(1,7):

	url_parms = {
					'start_date.range_start':'2015-08-10T00:00:00Z',
					'start_date.range_end':'2015-08-11T00:00:00Z',
					'page': page_num
		}

	url_header = {
			"Authorization": "Bearer NS4IMTEUWVQA552VVJPZ",
		}

	count_saved = 0
	count_skipped = 0

	response = requests.get(
		"https://www.eventbriteapi.com/v3/events/search/",
		headers = url_header,
		verify = True,
		params = url_parms 
		)


	if response.status_code == 200:

		for i in response.json()['events']:

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
			

				print i['id']

				O = org_res['name']

				L = Location( 
					name = loc_res['name'],
					address = ( loc_res['address']['address_1'] if (loc_res['address']['address_1'] != None) else '' ) + ( loc_res['address']['address_2'] if (loc_res['address']['address_2'] != None) else '' ) if ('address' in loc_res and loc_res['address']!=None ) else None,
					city = loc_res['address']['city'],
					country = loc_res['address']['country'],
					coordinates = [ loc_res['address']['latitude'], loc_res['address']['longitude'] ],
					# latitude = loc_res['address']['latitude'],
					# longitude = loc_res['address']['longitude'],
					postal_code = loc_res['address']['postal_code']
				 )

				C =  cat_res['name']


				E = Event (
							title = i['name']['text'] if ('name' in i and i['name']!=None) else None,
							start_timestamp = datetime.strptime(i['start']['utc'], "%Y-%m-%dT%H:%M:%SZ"),
							end_timestamp = datetime.strptime(i['end']['utc'], "%Y-%m-%dT%H:%M:%SZ"),
							description = i['description']['text'] if ('description' in i and i['description']!=None) else None,

							location = L,
							organizer = O,
							event_category = C,
							
							source = 'eventbrite',
							source_server_id = i['id'],
							image_thumbnail_url = i['logo']['url'] if ('logo' in i and i['logo']!=None) else None,
							info_url = i['url']
						)

				Q = Event.objects(title=E.title, start_timestamp=E.start_timestamp, location__coordinates__0=L.coordinates[0], location__coordinates__1=L.coordinates[1])
				
				if len(Q) == 0:
					E.save()
					count_saved+=1
				else:
					count_skipped+=1

				print str(count_saved) + " : " + str(count_skipped)
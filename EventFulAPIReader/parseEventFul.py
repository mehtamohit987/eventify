import eventful

api = eventful.API('ZjNBk59GdHJnsGd6')



"""
	title = i['name']['text']
	description = i['description']['text']
	
	
	start_timestamp = i['start']['utc']
	end_timestamp = i['end']['utc']
	
	--------
	use:
	time = '2012-03-01T00:05:55Z'
	datetime.strptime(time, "%Y-%m-%dT%H:%M:%SZ")
	--------

	created = ON OUR SERVER
	
	source = StringField(choices=['eventbrite', 'eventfull'], default='eventbrite', max_length=10)
	source_server_id = i['id']
	
	
	image_thumbnail_url = i['logo']['url']
	info_url = i['url']


	MORE API calls:

		organizer = 
		@	https://www.eventbriteapi.com/v3/organizers/<i['organizer_id']>/

		a['name']



		event_category =
		@	https://www.eventbriteapi.com/v3/categories/<i['category_id']>/

		b['name']



		location = 
		@	https://www.eventbriteapi.com/v3/venues/<i['venue_id']>/
		{
			name = c['name']
			address = (null chjeck)(c['address']['address_1']) + (null chjeck)(c['address']['address_2'])
			city = c['address']['city']
			country = c['address']['country']


			coordinates = PointField(  [ C['address']['latitude'], C['address']['longitude'] ] )

			postal_code = c['address']['postal_code']

		}
	

"""

events = api.call('/events/search', t='2015080500-2015080600')

for event in events['events']['event']:
	print "%s at %s" % (event['title'], event['venue_name'])
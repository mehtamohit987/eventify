import eventful

api = eventful.API('ZjNBk59GdHJnsGd6')

events = api.call('/events/search', q='music', l='San Diego')
for event in events['events']['event']:
	print "%s at %s" % (event['title'], event['venue_name'])
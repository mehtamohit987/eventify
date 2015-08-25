from __future__ import absolute_import

from celery import task
from datetime import datetime
from datetime import timedelta
import requests
from django.conf import settings

from celery import shared_task

@shared_task()
def get_eventbrite():
	'''date to run for =  datetime.now()+timedelta(7 days)'''
	start = datetime.utcnow() + timedelta(days=10)
	end = start + timedelta(days=1)
	start_date = start.strftime("%Y-%m-%dT00:00:00Z")
	end_date = end.strftime("%Y-%m-%dT00:00:00Z")
	execfile('EventBriteAPIReader/parseEventBrite.py')

	

@shared_task()
def get_eventful():
	'''date to run for =  datetime.now()+timedelta(7 days)'''
	start = datetime.utcnow() + timedelta(days=10)
	end = start + timedelta(days=1)
	start_date = start.strftime("%Y%m%d00")
	end_date = end.strftime("%Y%m%d00")
	time_range = start_date + '-' + end_date
	pages = 100
	page_size = 50
	execfile('EventFulAPIReader/parseEventFul.py')

@shared_task()
def reload_celery():
	response = requests.get(
		'http://' + settings.HAYSTACK_URL + ':8983' + '/solr/admin/cores' ,
		verify = True,
		params = {
			'action': 'RELOAD',
			'core': settings.HAYSTACK_CORE
		}
	)
	print response.status_code
"""

from celery import task

@task()
def get_eventbrite():
	'''date to run for =  datetime.now()+datetime.delta(7 days)'''
	# execfile('EventBriteAPIReader/parseEventBrite.py')
	

@task()
def get_eventful():
	'''date to run for =  datetime.now()+datetime.delta(7 days)'''
	# execfile('EventFulAPIReader/parseEventFul.py')
	
"""
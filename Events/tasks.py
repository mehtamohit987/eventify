"""

from celery import task

@task()
def get_eventbrite():
	# execfile('EventBriteAPIReader/parseEventBrite.py')
	pass



@task()
def get_eventful():
	# execfile('EventFulAPIReader/parseEventFul.py')
	pass

"""
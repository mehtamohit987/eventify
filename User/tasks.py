from __future__ import absolute_import
from celery import task
from datetime import datetime
from datetime import timedelta

from celery import shared_task


@shared_task()
def send_an_email():
	pass
@shared_task()
def send_todays_event_mails():
	''' send mails to users for their today's bookmarked events at a specific time '''
	# use send_an_email as an event on celery queue
	pass
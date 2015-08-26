from __future__ import absolute_import
from celery import task
from datetime import datetime
from datetime import timedelta

from celery import shared_task
from User.models import User, UserFavourite

import smtplib

@shared_task()
def send_an_email(to, subject, body):
	SERVER = 'smtp.gmail.com:587'
	username = 'eventifycoder@gmail.com'
	pwd = '!@#$QWER'
	FROM = username
	TO = [username]
	SUBJECT = subject
	TEXT = body
	
	ar_message = [ ( 'From: %s'%FROM ) , ( 'To: %s'%(", ".join(TO)) ) , ( 'Subject: %s'%SUBJECT ) , '' , TEXT ]
	message = "\r\n".join(ar_message)

	server = smtplib.SMTP(SERVER)
	server.ehlo()
	server.starttls()

	server.login(username, pwd)
	server.set_debuglevel(1)
	
	server.sendmail(FROM, TO, message)
	
	server.quit()
	

@shared_task()
def send_todays_event_mails():
	''' send mails to users for their today's bookmarked events at a specific time '''
	# use send_an_email as an event on celery queue
	# targeted_favourites = UserFavourite.objects(fav_event__start_timestamp__range = ( datetime.now(), datetime.now() + timedelta(days=1) ) )
	start = datetime.now()
	end = start + timedelta(days=1)

	for fav in UserFavourite.objects():			# targeted_favourites:
		if start <= fav.fav_event.start_timestamp <= end :
			subject = str('Email Reminder for event ' + unicode(fav.fav_event.title).encode('utf-8') + ' today at ' + fav.fav_event.start_timestamp.strftime("%H:%M"))
			print subject
			body = str('Hi ' + ( 'User' if(fav.user.fname==None or fav.user.fname=='') else unicode(fav.user.fname).encode('utf-8') ) + ',\n This mail is to notify you about the event <b>' + unicode(fav.fav_event.title).encode('utf-8') + \
					'</b> that you had bookmarked on eventify is scheduled today and is about to start at <b>' +  fav.fav_event.start_timestamp.strftime("%H:%M") + " UTC</b>. Thanks for using eventify.")
			print body
			send_an_email.delay(fav.user.email, subject, body)
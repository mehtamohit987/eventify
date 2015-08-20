from __future__ import unicode_literals
from rest_framework.authentication import TokenAuthentication
from rest_framework.authentication import BasicAuthentication 
from rest_framework import exceptions
from models import User
from django.contrib.auth.hashers import check_password
import base64
from mongotoken import MongoToken
from django.utils.timezone import utc
from rest_framework.authentication import get_authorization_header
from django.utils.translation import ugettext as _
import datetime


class MongoAuthentication(TokenAuthentication):
	model= MongoToken
	def authenticate(self,request):
		auth=get_authorization_header(request).split()
		
		if not auth:
			msg=_('No token header.')
			raise exceptions.AuthenticationFailed(msg) 
			# return None	
		

		if auth[0].lower()!= b'token':
			msg=_('Invalid token header. Add keyword "Token" before token string.')
			raise exceptions.AuthenticationFailed(msg) 
			# return None	
			
		if len(auth)==1:
			msg=_('Invalid token header. No credentials provided')
			raise exceptions.AuthenticationFailed(msg)

		elif len(auth) > 2:
			msg=_('Invalid token header.Token string should not contain spaces.')
			raise exceptions.AuthenticationFailed(msg)
		
		try:
			token = auth[1].decode()
			
		except UnicodeError:
			msg = _('Invalid token header. Token string should not contain invalid characters.')
			raise exceptions.AuthenticationFailed(msg)
		

		return self.authenticate_credentials(token)

			

	def authenticate_details(self,email_id,password):
		users=User.object.filter(email=email_id)
		if not users:return None
		user=users[0]
		if str(User.password)!=str(password):
			return None		
		
	def authenticate_credentials(self,key):
		try:
			token=self.model.objects.get(key=key)
			
		except self.model.DoesNotExist:
			raise exceptions.AuthenticationFailed(_('Invalid token.'))
		# if not token.user.is_active:
		# 	raise exceptions.AuthenticationFailed(_('User inactive or deleted'))
		utc_now=datetime.datetime.utcnow()
		if token.created < utc_now - datetime.timedelta(hours=24):
			raise exceptions.AuthenticationFailed(_('Token has expired'))

		return (token.user,token)
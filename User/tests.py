





# Create your tests here.
import unittest
from django.test import TestCase,SimpleTestCase
from mongotoken import MongoToken
from models import User,UserFavourite
from Events.models import Event
from django.core.urlresolvers import reverse,reverse_lazy

from rest_framework import status
from rest_framework.test import APIRequestFactory,APIClient,force_authenticate,APITestCase
from . import views
import json
from mongotoken import MongoToken


class URLTests(TestCase):
	def test_homepage(self):
		response=self.client.get('/')
		self.assertEqual(response.status_code,200)


class APITestClient(SimpleTestCase):
	client_class = APIClient

class UserTests(APITestCase,APITestClient):

  	def setUp(self):

 	 	self.user=User.objects.create(email='aditi@ht.com',password='aditi',fname='aditi',lname='gupta')
 		self.token,created=MongoToken.objects.get_or_create(user=self.user)
 		self.token.save()
		self.user.save()
		self.event=Event.objects.create(title='myevent',description='drama')
		self.event.save()
		self.userfavourite=UserFavourite.objects.create(user=self.user.id,fav_event=self.event.id)
		self.userfavourite.save()	
		
		

	
	def test_event_favourite(self):
		header = {'HTTP_AUTHORIZATION': 'Token {}'.format(self.token.key)} 
		response = self.client.get('/api/user/'+str(self.user.id)+'/favourite/'+str(self.userfavourite.id),**header)
		self.assertIn(self.event.title,response.content)
		
	        

	def test_user_list(self):
		res=self.client.get('/api/user/')
		content=json.loads(res.content)
		self.assertEqual(res.status_code,200)
		self.assertIn(self.user.email,res.content)
		
	
	def test_user_post(self):
		data={
			'email':'test1@test.com','password':'test','fname':'test','lname':'test'

		}	
		response=self.client.post('/api/user/',json.dumps(data),content_type='application/json')
		self.assertEqual(response.status_code,201)
		self.assertEqual(str(json.loads(response.content)['lname']),data['lname'])
		User.objects(id__iexact = str(json.loads(response.content)['id']) ).delete()
		
	def test_user_put(self):
		header={'HTTP_AUTHORIZATION':'Token {}' .format(str(self.token.key))}
		data={'email':'aditi1@ht.com','password':'aditi','fname':'aditi','lname':'gupta'}
		response=self.client.put('/api/user/'+str(self.user.id)+'/',json.dumps(data),content_type='application/json',**header)
		
		




	
	def test_user_patch(self):
		header = {'HTTP_AUTHORIZATION': 'Token {}'.format(str(self.token.key))} 
		data={'lname':'goel'}
		response=self.client.patch('/api/user/'+str(self.user.id)+'/',json.dumps(data),content_type='application/json',**header)
		self.assertEqual(response.status_code,200)
		self.assertEqual(str(json.loads(response.content)['lname']),data['lname'])


	
	

	def test_user_delete(self):
		header={'HTTP_AUTHORIZATION': 'Token {}'.format(str(self.token.key))}
		response=self.client.delete('/api/user/'+str(self.user.id)+'/',**header)
 		self.assertEqual(response.status_code,204)
 		

 	
 	def test_user_authorization(self):
		response=self.client.get('/api/user/'+str(self.user.id)+'/')
		self.assertEqual(response.status_code,401,"Rest-auth-failed")		


	def test_token_generation(self):
		
		
		res=self.client.get('/api/user/auth-token/?email='+str(self.user.email)+'&'+
			'password='+str(self.user.password),content_type='application/json')
		
		self.assertIsNotNone(json.loads(res.content)['token'])
	

	def tearDown(self):
		self.user.delete()
		self.event.delete()
		self.userfavourite.delete()
		self.token.delete()
	

	


	








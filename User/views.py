from .models import User, UserFavourite
from Events.models import Event
from .serializers import UserSerializer, UserFavouriteSerializer
from rest_framework_mongoengine import generics as drfme_generics
from rest_framework.response import Response
from rest_framework.renderers import JSONRenderer
from rest_framework.views import APIView
from django.contrib.auth import login,logout
# from rest_framework.permissions import IsAuthenticated,AllowAny
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from mongotoken import MongoToken
from authentication import MongoAuthentication
from django.http import Http404
from rest_framework import status
from django.shortcuts import get_object_or_404
from .permissions import IsTheSameUser
import datetime
from django.utils.timezone import utc
from Events.views import EventDetail
import requests
import json
from django.http import HttpResponse


class UserDetail(drfme_generics.RetrieveUpdateDestroyAPIView):
	queryset=User.objects.all()
	lookup_field = 'id'
	lookup_url_kwarg = 'user_id'
	serializer_class=UserSerializer

	authentication_classes = [MongoAuthentication,]
	# permission_classes = (IsAuthenticated, )
	

	def update(self, request, *args, **kwargs):
		partial = kwargs.pop('partial', False)
		instance = self.get_object()
		serializer = self.get_serializer(instance, data=request.data, partial=partial)
		serializer.is_valid(raise_exception=True)
		self.perform_update(serializer)
		return Response(serializer.data)

class UserList(drfme_generics.ListCreateAPIView):
	queryset=User.objects.all()
	
	lookup_field = 'id'
	lookup_url_kwarg = 'user_id'
	serializer_class=UserSerializer

class ObtainAuthToken(APIView):
	serializer_class=UserSerializer

	def get(self,request,*args,**kwargs):
		email=request.GET.get('email')
		password=request.GET.get('password')
		if email and password:
			users=User.objects.filter(email=email)
			if not users:
				return Response({'token': None})
			user=users[0]
			if str(user.password)!=str(password):
				return Response({'token': None})
			else:

				token, created = MongoToken.objects.get_or_create(user=user, created__gt= datetime.datetime.utcnow() - datetime.timedelta(hours=24))
				return Response({'token':token.key})
		else:
			return Response({'token': None})
		

class FavouriteList(drfme_generics.ListCreateAPIView):
	serializer_class = UserFavouriteSerializer
	paginate_by = 10

	authentication_classes = [MongoAuthentication,]
	permission_classes = (IsTheSameUser, )
	
	def create(self, request, *args, **kwargs):
		if request.auth != None and request.user != None:
			if 'user_id' not in  self.kwargs or str(request.user.id) != self.kwargs['user_id']:
				return Response(status=status.HTTP_403_FORBIDDEN)	

			data = { 'fav_event': request.data['fav_event'], 'user': request.user.id }
			serializer = self.get_serializer(data=data)
			serializer.is_valid(raise_exception=True)
			self.perform_create(serializer)

			r = requests.get('http://localhost:8000/api/events/' + request.data['fav_event'])
			n = json.loads(r.text)['num_fav']
			x = {'num_fav': n+1}
			json_data = JSONRenderer().render(x)
			r = requests.patch(
				'http://localhost:8000/api/events/' + request.data['fav_event'] + '/',
				headers = {	"Content-Type": "application/json",	},
				data = json_data,
				)

			headers = self.get_success_headers(serializer.data)
			return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
		else:
			return Response(status=status.HTTP_404_NOT_FOUND)

	def get(self, request, *args, **kwargs):
		if request.auth != None and request.user != None and ('user_id' not in  self.kwargs or str(request.user.id) != self.kwargs['user_id']):
			return Response(status=status.HTTP_403_FORBIDDEN)
		return self.list(request, *args, **kwargs)

	def get_queryset(self):
		if 'user_id' in self.kwargs and len(self.kwargs['user_id']) == 24:
			return UserFavourite.objects(user=self.kwargs['user_id'])
		else:
			return UserFavourite.objects.none()



class FavouriteDetail(drfme_generics.RetrieveDestroyAPIView):
	queryset = UserFavourite.objects.all()
	serializer_class = UserFavouriteSerializer
	lookup_field = 'id'
	lookup_url_kwarg = 'id'
	authentication_classes = [MongoAuthentication,]
	permission_classes = (IsTheSameUser, )

	def destroy(self, request, *args, **kwargs):
		instance = self.get_object()
		self.perform_destroy(instance)

		r = requests.get('http://localhost:8000/api/events/' + str(instance.fav_event.id))
		n = json.loads(r.text)['num_fav']
		x = {'num_fav': n-1}
		json_data = JSONRenderer().render(x)
		r = requests.patch(
			'http://localhost:8000/api/events/' + request.data['fav_event'] + '/',
			headers = {	"Content-Type": "application/json",	},
			data = json_data,
			)
		return Response(status=status.HTTP_204_NO_CONTENT)



@api_view(['GET'])
def get_email_availability(request):
	print User.objects(email__iexact=request.GET['q'])
	the_data = {
		'result': True if( User.objects(email__iexact=request.GET['q']).count() == 0 ) else False
	}
	json_data = JSONRenderer().render(the_data)
	return HttpResponse(json_data, content_type="application/json")

	

@api_view(['GET'])
@authentication_classes((MongoAuthentication,))
@permission_classes((IsTheSameUser,))
def favouritearraylist(request, user_id):
	if User.objects(id__iexact=user_id).count() == 0:
		return HttpResponse(status=404)

	if request.auth != None and request.user != None and str(request.user.id) != user_id:
			return Response(status=status.HTTP_403_FORBIDDEN)
	
	favList = []

	for fav in UserFavourite.objects():
		if str(fav.user.id) == user_id:
			favList.append({
				'event_id': str(fav.fav_event.id),
				'fav_id': str(fav.id)
			})
	

	the_data = {
		'results': favList
	}
	json_data = JSONRenderer().render(the_data)
	return HttpResponse(json_data, content_type="application/json")



@api_view(['GET'])
@authentication_classes((MongoAuthentication,))
@permission_classes((IsTheSameUser,))
def getuserid(request):
	the_data = {
		'results': str(request.user.id)
	}
	json_data = JSONRenderer().render(the_data)
	return HttpResponse(json_data, content_type="application/json")





	# def get_queryset(self):
	# 	print IsTheSameUser
	# 	print self.kwargs
	# 	if 'user_id' in self.kwargs and len(self.kwargs['user_id']) == 24:
	# 		print "here"
	# 		return UserFavourite.objects(user=self.kwargs['user_id'])
	# 	else:
	# 		return UserFavourite.objects.none()


	# def get_object():
	# 	pass
	
	# def get_queryset(self):
	# 	print self.request.user, self.request.auth
	# 	# if 'HTTP_AUTHORIZATION' in self.request.META:
	# 	# 	current_user_token = MongoToken.objects.filter(key=self.request.META['HTTP_AUTHORIZATION'])
	# 	# 	if current_user_token != None:
	# 	# 		user_reference = current_user_token[0].user
	# 	# 		if user_reference != None:
	# 	# 			#return self.list(UserFavourite.objects.filter(user__id__iexact=user_reference.id))		
	# 	# 			return self.list(UserFavourite.objects(user=user_reference))		
	# 	# return []
	# 	return self.list(UserFavourite.objects.all())



	# def list(self, request, *args, **kwargs):
 #        instance = self.filter_queryset(self.get_queryset())
 #        page = self.paginate_queryset(instance)
 #        if page is not None:
 #            serializer = self.get_pagination_serializer(page)
 #        else:
 #            serializer = self.get_serializer(instance, many=True)
 #        return Response(serializer.data)



	# def perform_create(self, serializer):
	# 	if 'HTTP_AUTHORIZATION' in self.request.META:
	# 		current_user_token = MongoToken.objects.filter(key=self.request.META['HTTP_AUTHORIZATION'])
	# 		if current_user_token != None:
	# 			user_reference = current_user_token[0].user
	# 			if user_reference != None:
	# 				serializer.save
	# 	return Http404
	# 	serializer.save(user=self.request.)

	# def post(self, request, *args, **kwargs):
	# 	if 'HTTP_AUTHORIZATION' in self.request.META:
	# 		current_user_token = MongoToken.objects.filter(key=self.request.META['HTTP_AUTHORIZATION'])
	# 		if current_user_token != None:
	# 			user_reference = current_user_token[0].user
	# 			if user_reference != None:
	# 				return self.create(request, *args, user=user_reference, **kwargs)
	# 	return Http404
	

	# def get_object(self):
	# 	queryset = self.get_queryset()
	# 	queryset = self.filter_queryset(queryset)
	# 	# filter = {}
	# 	# for field in self.lookup_fields:
	# 	# 	filter[field] = self.kwargs[field]
	# 	return get_document_or_404(queryset, user__id__iexact=self.kwargs['user'], id__iexact=self.kwargs['fav_id'])



		# queryset = self.get_queryset()             # Get the base queryset
  #         # Apply any filter backends
  #       return get_object_or_404(queryset, user__id__iexact=self.kwargs['user'], id__iexact=self.kwargs['fav_id'])	 # **filter)
        

	# def get_queryset(self):
	# 	if 'HTTP_AUTHORIZATION' in self.request.META:
	# 		current_user_token = MongoToken.objects.filter(key=self.request.META['HTTP_AUTHORIZATION'])
	# 		if current_user_token != None:
	# 			user_reference = current_user_token[0].user
	# 			if user_reference != None:
	# 				return self.list(UserFavourite.objects(user=user_reference))		
	# 	return []
	

# class UserLogin(APIView):

# 	def get(self,request,*args,**kwargs):
# 		m=authenticate(request)
# 		if m:
# 			return Response("Welcome to eventify.")
# 		else:
# 			return None

		
		
		
	# obtain_auth_token = UserLogin.as_view()'''






# class UserDetail(drfme_generics.RetrieveUpdateDestroyAPIView):
# 	queryset = User.objects
# 	# lookup_field = 'id'
# 	serializer_class = UserSerializer



# class Login(drfme_generics.APIView):
# 	pass
# class Favourite(drfme_generics.APIView):
# 	pass




# user/favourite/<id>	=	GET, POST, delete


#pseudeocode

# class Favourite(drfme_generics.ListCreateAPIView):
# 	paginate_by = 10
# 	serializer_class = UserFavouriteSerializer

# 	def get_queryset(self):
# 		if 'HTTP_AUTHORIZATION' in self.request.META:
# 			current_user_token = MongoToken.objects.filter(key=self.request.META['HTTP_AUTHORIZATION'])
# 			if current_user_token != None:
# 				user_reference = current_user_token[0].user
# 				current_user = User.objects(_id=user_reference)
# 				if current_user != None:
# 					return self.list(current_user[0].favourites)		
# 		return []



# class Favourite(APIView):
# 	def get(self, request, format=None):
# 		if 'HTTP_AUTHORIZATION' in request.META:
# 			current_user_token = MongoToken.objects.filter(key=request.META['HTTP_AUTHORIZATION'])
# 			if current_user_token != None:
# 				user_reference = currentFUserFavorite_user_token[0].user
# 				if user_reference != None:
# 					return Response(UserFavouriteSerializer(user_reference.favourites, many=True).data)
# 		raise Http404


# 	def post(self, request):
# 		if 'HTTP_AUTHORIZATION' in request.META:
# 			current_user_token = MongoToken.objects.filter(key=request.META['HTTP_AUTHORIZATION'])
# 			if current_user_token != None:
# 				user_reference = current_user_token[0].user
# 				if user_reference != None:
# 					if 'event_id' in request.POST:
# 						ev = Event.objects(id__iexact=request.POST['event_id'])
# 						if len(ev) > 0:
# 							event_to_fav = ev[0]
# 							if event_to_fav not in user_reference.favourites:
# 								u = UserFavourite() 
# 								u.fav_event = event_to_fav
# 								# u.save()
# 								user_reference.favourites.append(u)
# 								user_reference.save()
# 							return Response(UserFavouriteSerializer(user_reference.favourites, many=True).data, status=status.HTTP_201_CREATED)
# 		raise Http404

	# def delete(self, request):
	# 	if 'HTTP_AUTHORIZATION' in request.META:
	# 		current_user_token = MongoToken.objects.filter(key=request.META['HTTP_AUTHORIZATION'])
	# 		if current_user_token != None:
	# 			user_reference = current_user_token[0].user
	# 			if user_reference != None:
	# 				if 'event_id' in request.POST:
	# 					ev = Event.objects(id__iexact=request.POST['event_id'])
	# 					if len(ev) > 0:
	# 						event_to_fav = ev[0]
	# 						if event_to_fav in user_reference.favourites: 
	# 							user_reference.favourites.remove(UserFavourite(fav_event=event_to_fav))
	# 							user_reference.save()
	# 							return Response(UserFavouriteSerializer(user_reference.favourites, many=True).data, status=status.HTTP_201_CREATED)
	# 						else:
	# 							return Response(status=status.HTTP_204_NO_CONTENT)
	# 					else:
	# 						return Response(status=status.HTTP_204_NO_CONTENT)
	# 	raise Http404

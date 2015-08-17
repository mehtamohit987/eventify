from .models import User
from .serializers import UserSerializer
from rest_framework_mongoengine import generics as drfme_generics
from rest_framework.response import Response
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import login,logout
from rest_framework.permissions import IsAuthenticated,AllowAny
from mongotoken import MongoToken
from authentication import MongoAuthentication



class UserDetail(drfme_generics.RetrieveUpdateDestroyAPIView):
	queryset=User.objects.all()
	serializer_class=UserSerializer
	lookup_field = 'pk'
	authentication_classes = [MongoAuthentication,]

class UserList(drfme_generics.ListCreateAPIView):
	queryset=User.objects.all()
	#permission_classes=IsAuthenticated
	# model=UserInfo
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
				token, created = MongoToken.objects.get_or_create(user=user)
				return Response({'token':token.key})
		else:
			return Response({'token': None})
		



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
'''
class Login(drfme_generics.APIView):
	pass
class Favourite(drfme_generics.APIView):
	pass
'''
""""

user/favourite/<id>	=	GET, POST, delete


#pseudeocode
class Favourite(APIView):
	def get(self, request):
		current_user = User.objects.filter(request.SESSION['id'])


		# check specifically for reference fields

	#put??? resource doesnt't exxist yet but more aligned to put
	def post(self, request, id):
		#find 
		q = Event.objects.filter(id__exact=id)
		if len(q) > 0:
			current_user = User.objects.get(id  = request.SESSION['id'])

			# check specifically for reference fields

			if q[0] not in current_user.favourites:
				current_user.favourites.appendd(q[0])
				current_user.save()

		
	def delete(self, request, id):
		q = Event.objects.filter(id__exact=id)
		if len(q) > 0:
			current_user = User.objects.filter(request.SESSION['id'])

			# check specifically for reference fields

			if q[0] in current_user.favourites:
				current_user.favourites.remove(q[0])
				current_user.save()

		
"""
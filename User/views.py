from .models import User
from .serializers import UserSerializer
from rest_framework_mongoengine import generics as drfme_generics
from Events.models import Event
class UserDetail(drfme_generics.RetrieveUpdateDestroyAPIView):
	queryset = User.objects
	# lookup_field = 'id'
	serializer_class = UserSerializer
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
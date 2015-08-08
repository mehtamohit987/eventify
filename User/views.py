from .models import User
from .serializers import UserSerializer
from rest_framework_mongoengine import generics as drfme_generics

class UserDetail(drfme_generics.RetrieveUpdateDestroyAPIView):
	queryset = User.objects
	# lookup_field = 'id'
	serializer_class = UserSerializer
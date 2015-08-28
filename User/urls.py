from django.conf.urls import url
from . import views

urlpatterns = [
    
    url(r'^auth-token/$',views.ObtainAuthToken.as_view()),
    url(r'^getuserid/$', views.getuserid),
    url(r'^getemailavailability/$', views.get_email_availability),
    url(r'^(?P<user_id>[0-9a-zA-Z]+)/$', views.UserDetail.as_view()),
    url(r'^$', views.UserList.as_view()),
    url(r'^(?P<user_id>[0-9a-zA-Z]+)/favourite/(?P<id>[0-9a-zA-Z]+)$', views.FavouriteDetail.as_view()),
    url(r'^(?P<user_id>[0-9a-zA-Z]+)/favourite/$', views.FavouriteList.as_view()),
    url(r'^(?P<user_id>[0-9a-zA-Z]+)/favouritearraylist/$', views.favouritearraylist)
    
]
from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^(?P<pk>[0-9a-zA-Z]+)/$', views.UserDetail.as_view()),
    #url(r'^favourite/(?P<id>[0-9a-zA-Z]+)/$', views.Favourite.as_view()),
    #url(r'^login/(?P<pk>[0-9a-zA-Z]+)/$', views.Login.as_view()),
]
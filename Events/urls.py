from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^autocomplete/$', views.autocomplete),
    url(r'^$', views.EventList.as_view()),
    url(r'^(?P<id>[0-9a-zA-Z]+)/$', views.EventDetail.as_view())
]
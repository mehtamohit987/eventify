from haystack import indexes
from .models import Dummy


class EventIndex(indexes.SearchIndex, indexes.Indexable):
	text				= indexes.CharField(document=True)	
	start_timestamp 	= indexes.DateTimeField()
	end_timestamp 		= indexes.DateTimeField()
	description 		= indexes.CharField()

	organizer 			= indexes.CharField()
	event_category 		= indexes.CharField()
	
	address			 	= indexes.CharField()
	city		 		= indexes.CharField()
	country			 	= indexes.CharField()
	postal_code 		= indexes.CharField()
	coordinates 		= indexes.CharField()

	django_id			= indexes.IntegerField()
	django_ct			= indexes.CharField()

	def get_model(self):
		return Dummy
 	# def index_queryset(self, using=None):
  #       "Used when the entire index for model is updated."
  #       return self.get_model().objects.filter(pub_date__lte=datetime.datetime.now())

	# def index_queryset(self, using=None):
	# 	"""Used when the entire index for model is updated."""
	# 	return self.get_model().objects
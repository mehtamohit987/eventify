from haystack import indexes
from .models import Dummy


class EventIndex(indexes.SearchIndex, indexes.Indexable):
	text				= indexes.EdgeNgramField(document=True, boost=2.5)	
	start_timestamp 	= indexes.DateTimeField()
	end_timestamp 		= indexes.DateTimeField()
	description 		= indexes.CharField(boost=2.0)

	organizer 			= indexes.CharField(boost=1.25)
	event_category 		= indexes.CharField(boost=2.0) #EdgeNgram
	
	address			 	= indexes.CharField()
	city		 		= indexes.CharField(boost=1.5) #EdgeNgram
	country			 	= indexes.CharField(boost=1.25)
	postal_code 		= indexes.CharField()
	coordinates 		= indexes.CharField(boost=1.10) #LocationField

	image_thumbnail_url = indexes.CharField()
	info_url 			= indexes.CharField()
	
	django_id			= indexes.IntegerField()
	django_ct			= indexes.CharField()
	id 					= indexes.CharField()

	def get_model(self):
		return Dummy
 	# def index_queryset(self, using=None):
  #       "Used when the entire index for model is updated."
  #       return self.get_model().objects.filter(pub_date__lte=datetime.datetime.now())

	# def index_queryset(self, using=None):
	# 	"""Used when the entire index for model is updated."""
	# 	return self.get_model().objects
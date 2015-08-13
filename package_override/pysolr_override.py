# -*- coding: utf-8 -*-
import datetime
from pysolr import Solr, force_unicode, DATETIME_REGEX, Results

class CandidateSolr(Solr):

    """
    Overridden to include lists and tuples in the results returned by Solr.
    Discarded changes for qtime and maxscore.
    """

    def _to_python(self, value):
        """
        Converts values from Solr to native Python values.
        """
        if isinstance(value, (int, list, tuple, float, long, complex)):
            return value

        if value == 'true':
            return True
        elif value == 'false':
            return False

        is_string = False

        if isinstance(value, str):
            value = force_unicode(value)

        if isinstance(value, basestring):
            is_string = True

        if is_string == True:
            possible_datetime = DATETIME_REGEX.search(value)

            if possible_datetime:
                date_values = possible_datetime.groupdict()

                for dk, dv in date_values.items():
                    date_values[dk] = int(dv)

                return datetime.datetime(date_values['year'], date_values['month'], date_values['day'], date_values['hour'], date_values['minute'], date_values['second'])

        return value
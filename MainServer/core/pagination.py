"""Custom pagination classes"""
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from collections import OrderedDict


class StandardResultsSetPagination(PageNumberPagination):
    """Standard pagination with 50 items per page"""
    page_size = 50
    page_size_query_param = 'page_size'
    max_page_size = 1000
    
    def get_paginated_response(self, data):
        """Return paginated response with custom format"""
        return Response(OrderedDict([
            ('success', True),
            ('count', self.page.paginator.count),
            ('next', self.get_next_link()),
            ('previous', self.get_previous_link()),
            ('page', self.page.number),
            ('page_size', self.get_page_size(self.request)),
            ('total_pages', self.page.paginator.num_pages),
            ('results', data)
        ]))


class LargeResultsSetPagination(PageNumberPagination):
    """Pagination for large datasets with 100 items per page"""
    page_size = 100
    page_size_query_param = 'page_size'
    max_page_size = 5000
    
    def get_paginated_response(self, data):
        """Return paginated response with custom format"""
        return Response(OrderedDict([
            ('success', True),
            ('count', self.page.paginator.count),
            ('next', self.get_next_link()),
            ('previous', self.get_previous_link()),
            ('page', self.page.number),
            ('page_size', self.get_page_size(self.request)),
            ('total_pages', self.page.paginator.num_pages),
            ('results', data)
        ]))


class SmallResultsSetPagination(PageNumberPagination):
    """Pagination for small datasets with 10 items per page"""
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100
    
    def get_paginated_response(self, data):
        """Return paginated response with custom format"""
        return Response(OrderedDict([
            ('success', True),
            ('count', self.page.paginator.count),
            ('next', self.get_next_link()),
            ('previous', self.get_previous_link()),
            ('page', self.page.number),
            ('page_size', self.get_page_size(self.request)),
            ('total_pages', self.page.paginator.num_pages),
            ('results', data)
        ]))
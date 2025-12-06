"""Reusable mixins for views and services"""
from typing import Optional, Dict, Any
from django.db.models import QuerySet, Model, Q
from django.core.exceptions import ValidationError


class AccountFilterMixin:
    """Mixin to filter queryset by account_id"""
    
    def get_account_queryset(
        self,
        queryset: QuerySet,
        account_id: Optional[str] = None,
        field_name: str = 'account_id'
    ) -> QuerySet:
        """
        Filter queryset by account_id if provided.
        
        Args:
            queryset: Base queryset to filter
            account_id: Account ID to filter by
            field_name: Name of the account ID field
            
        Returns:
            Filtered queryset
        """
        if account_id:
            filter_kwargs = {field_name: account_id}
            return queryset.filter(**filter_kwargs)
        return queryset
    
    def get_account_id_from_request(self, request) -> Optional[str]:
        """
        Extract account_id from request data or query params.
        
        Args:
            request: HTTP request object
            
        Returns:
            Account ID if found, None otherwise
        """
        return (
            request.data.get('account_id') or
            request.GET.get('account_id') or
            request.query_params.get('account_id')
        )


class SoftDeleteMixin:
    """Mixin for soft delete functionality"""
    
    def soft_delete(self, instance: Model) -> None:
        """
        Soft delete an instance by setting is_deleted flag.
        Falls back to hard delete if field doesn't exist.
        
        Args:
            instance: Model instance to delete
        """
        if hasattr(instance, 'is_deleted'):
            instance.is_deleted = True
            instance.save(update_fields=['is_deleted'])
        else:
            instance.delete()
    
    def get_active_queryset(self, queryset: QuerySet) -> QuerySet:
        """
        Filter queryset to exclude soft-deleted items.
        
        Args:
            queryset: Base queryset
            
        Returns:
            Filtered queryset
        """
        if hasattr(queryset.model, 'is_deleted'):
            return queryset.filter(is_deleted=False)
        return queryset


class TimestampMixin:
    """Mixin for handling timestamp fields"""
    
    def get_created_after(
        self,
        queryset: QuerySet,
        date,
        field_name: str = 'created_at'
    ) -> QuerySet:
        """Filter items created after a specific date"""
        filter_kwargs = {f'{field_name}__gte': date}
        return queryset.filter(**filter_kwargs)
    
    def get_created_before(
        self,
        queryset: QuerySet,
        date,
        field_name: str = 'created_at'
    ) -> QuerySet:
        """Filter items created before a specific date"""
        filter_kwargs = {f'{field_name}__lte': date}
        return queryset.filter(**filter_kwargs)


class SearchMixin:
    """Mixin for implementing search functionality"""
    
    def search_queryset(
        self,
        queryset: QuerySet,
        search_term: str,
        search_fields: list
    ) -> QuerySet:
        """
        Search across multiple fields using OR logic.
        
        Args:
            queryset: Base queryset
            search_term: Search term to look for
            search_fields: List of field names to search
            
        Returns:
            Filtered queryset
        """
        if not search_term or not search_fields:
            return queryset
        
        # Build Q objects for OR search
        q_objects = Q()
        for field in search_fields:
            q_objects |= Q(**{f'{field}__icontains': search_term})
        
        return queryset.filter(q_objects)


class BulkOperationMixin:
    """Mixin for bulk operations"""
    
    def bulk_create_with_validation(
        self,
        model_class: type,
        data_list: list,
        batch_size: int = 100
    ) -> list:
        """
        Bulk create with validation.
        
        Args:
            model_class: Model class to create instances of
            data_list: List of dictionaries with instance data
            batch_size: Number of instances per batch
            
        Returns:
            List of created instances
        """
        instances = []
        for data in data_list:
            instance = model_class(**data)
            instance.full_clean()  # Validate
            instances.append(instance)
        
        return model_class.objects.bulk_create(
            instances,
            batch_size=batch_size
        )
    
    def bulk_update_with_validation(
        self,
        instances: list,
        fields: list,
        batch_size: int = 100
    ) -> None:
        """
        Bulk update with validation.
        
        Args:
            instances: List of model instances to update
            fields: List of field names to update
            batch_size: Number of instances per batch
        """
        # Validate all instances first
        for instance in instances:
            instance.full_clean()
        
        # Perform bulk update
        model_class = instances[0].__class__
        model_class.objects.bulk_update(
            instances,
            fields,
            batch_size=batch_size
        )
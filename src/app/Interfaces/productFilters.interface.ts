export interface ProductFilters {
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    isActive?: string;
    sortBy?: string;
    order?: 'asc' | 'desc';
    searchTerm?: string;
  }
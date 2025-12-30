export interface filterQuery{
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    isActive?: string;
    sortBy?: string;
    order?: 'asc' | 'desc';
    searchTerm?: string;
}

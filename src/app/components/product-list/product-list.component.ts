import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../Services/product.service';
import { ToastrService } from 'ngx-toastr';
import { Product } from '../../Interfaces/product.interface';
import { CartItem } from '../../Interfaces/cartItems.interface';
import { SearchService } from '../../Services/search.service';
import { categoryList } from 'src/app/constants/productCategories';
import { filterQuery } from 'src/app/Interfaces/filterQuery.interface';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  wishlist: Product[] = [];  
  p: number = 1;
  itemsPerPage: number = 12;
  totalProduct: number = 0;
  filters: filterQuery = {};
  categories = categoryList;
  isLoading: boolean = false; // Loading state

  constructor(
    private productService: ProductService,
    private toastr: ToastrService,
    private searchService: SearchService
  ) { }

ngOnInit(): void {
  // Initialize default filter values
  this.filters = {
    category: '',
    sortBy: '',
    order: 'asc',
  };

  this.searchService.searchTerm.subscribe((term) => {
    this.filters.searchTerm = term.trim();
    this.loadProducts();
  });

  this.loadProducts();
}
 
  loadProducts(): void {
    this.p = 1;
    this.filters.isActive = this.filters.isActive ? "true" : "";
    this.isLoading = true; // Start loading

    this.productService.getProducts(this.filters).subscribe({
      next: (data) => {
        this.products = data;
        this.totalProduct = data.length;
        this.filteredProducts = data;
        localStorage.setItem('products', JSON.stringify(this.products));

        const storedWishlist = localStorage.getItem('wishlistItems');
        if (storedWishlist) {
          this.wishlist = JSON.parse(storedWishlist);
        }
        this.isLoading = false; // Stop loading
      },
      error: (err) => {
        console.log("Error", err);
        this.isLoading = false; // Stop loading on error
        this.toastr.error('Failed to load products. Please try again.', 'Error');
      },
      complete: () => {
        console.log("Fetched product data");
      }
    });
  }

  // Check if any filters are active
  hasActiveFilters(): boolean {
    return !!(
      this.filters.category ||
      this.filters.minPrice ||
      this.filters.maxPrice ||
      this.filters.sortBy ||
      this.filters.order ||
      this.filters.isActive
    );
  }

  // Reset all filters
  resetFilters(): void {
    this.filters = {};
    this.loadProducts();
  }

  isInWishlist(product: Product): boolean {
    return this.wishlist.some(item => item._id === product._id);
  }

  toggleWishlist(product: Product) {
    const index = this.wishlist.findIndex(item => item._id === product._id);
    if (index > -1) {
      this.wishlist.splice(index, 1);
      this.toastr.info('Removed from wishlist', 'Wishlist');
    } else {
      this.wishlist.push(product);
      this.toastr.success('Added to wishlist', 'Wishlist');
    }
    localStorage.setItem('wishlistItems', JSON.stringify(this.wishlist));
  }

  addToCart(product: Product): void {
    if (product.quantity <= 0) {
      this.toastr.error('Product is out of stock!', 'Error');
      return;
    }
  
    if (!product.isActive) {
      this.toastr.error('This product is inactive and cannot be added to the cart!', 'Error');
      return;
    }

    let cartItems = [];
    const cartItem = {
      ProductId: product._id,
      ProductName: product.productName,
      Quantity: 1
    };

    console.log('Adding to cart:', product);
    const existingCart = localStorage.getItem('cartItems');
    if (existingCart) {
      cartItems = JSON.parse(existingCart);

      const existingItem = cartItems.find((item: CartItem) => item.ProductId === product._id);
      if (existingItem) {
        if (existingItem.Quantity < product.quantity) {
          existingItem.Quantity += 1;
          this.toastr.success('Product quantity updated in cart!', 'Success');
        } else {
          this.toastr.error('Cannot add more than available quantity!', 'Error');
          return;
        }
      } else {
        cartItems.push(cartItem);
        this.toastr.success('Product added to cart successfully!', 'Success');
      }
    } else {
      cartItems = [cartItem];
      this.toastr.success('Product added to cart successfully!', 'Success');
    }
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }
}

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
  filters:filterQuery={}
  categories = categoryList

  constructor(
    private productService: ProductService,
    private toastr: ToastrService,
    private searchService: SearchService
  ) { }

  ngOnInit(): void {
    this.searchService.searchTerm.subscribe((term) => {
      this.filters.searchTerm = term.trim(); // Add searchTerm to filters
      this.loadProducts(); // Reload products whenever search term is applied 
    });
  
    this.loadProducts();
  }
 
  loadProducts():void{
    this.p = 1; 
    this.filters.isActive = this.filters.isActive ? "true" : "";

    this.productService.getProducts(this.filters).subscribe({
      next: (data) => {
        this.products = data;
        this.totalProduct = data.length;
        this.filteredProducts = data;
        localStorage.setItem('products', JSON.stringify(this.products)); //The data stored in localStorage can only be in string format.

        const storedWishlist = localStorage.getItem('wishlistItems');
        if (storedWishlist) {
          this.wishlist = JSON.parse(storedWishlist); //convert again to JSON object notation 
        }
      },
      error: (err) => {
        console.log("Error", err);
      },
      complete: () => {
        console.log("Fetched product data");
      }
    });
  }
  isInWishlist(product: Product): boolean {
    return this.wishlist.some(item => item._id === product._id); //some checks the condition and returns true or false
  }

  toggleWishlist(product: Product) {
    //if the product is already there remove else add
    const index = this.wishlist.findIndex(item => item._id === product._id); //findIndex returns the item index if true returns 1, false -1
    if (index > -1) {
      this.wishlist.splice(index,1); //splice removes (index,1) (product index, no of items to be deleted)
      this.toastr.info('Removed from wishlist', 'Wishlist');
    } else {
      this.wishlist.push(product);
      this.toastr.success('Added to wishlist', 'Wishlist');
    }
    localStorage.setItem('wishlistItems', JSON.stringify(this.wishlist));
  }

  //product comes from product-list component
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

      const existingItem = cartItems.find((item: CartItem) => item.ProductId === product._id); // find() returns that item if found else undefined
      if (existingItem) {
        if (existingItem.Quantity < product.quantity){
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

import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Product } from '../../Interfaces/product.interface';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent implements OnInit {
  wishlist: Product[] = [];

  constructor(private toastr: ToastrService) {}
  displayedColumns: string[] = ['productName', 'actions'];
  ngOnInit(): void {
    this.loadWishlist();
  }

  loadWishlist() {
    const storedWishlist = localStorage.getItem('wishlistItems');
    if (storedWishlist) {
      this.wishlist = JSON.parse(storedWishlist);
    }
  }

  removeFromWishlist(product: Product) {
    this.wishlist = this.wishlist.filter(item => item._id !== product._id);
    localStorage.setItem('wishlistItems', JSON.stringify(this.wishlist));
    this.toastr.info('Removed from wishlist', 'Wishlist');
  }

  addToCart(product: Product) {
    if (product.quantity <= 0) {
      this.toastr.error('Product is out of stock!', 'Error');
      return;
    }
  
    if (!product.isActive) {
      this.toastr.error('This product is inactive and cannot be added to the cart!', 'Error');
      return;
    }
    let cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');

    const existingItem = cartItems.find((item: any) => item.ProductId === product._id);
    if (existingItem) {
      this.toastr.success('Product already in the cart!');
    } else {
      cartItems.push({ ProductId: product._id, ProductName: product.productName, Quantity: 1 });
      this.toastr.success('Product added to cart!', 'Success');
    }
    localStorage.setItem('cartItems', JSON.stringify(cartItems));

  }
}

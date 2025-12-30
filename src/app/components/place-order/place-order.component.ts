import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../Services/order.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CartItem } from 'src/app/Interfaces/cartItems.interface';
import { Product } from 'src/app/Interfaces/product.interface';

@Component({
  selector: 'app-place-order',
  templateUrl: './place-order.component.html',
  styleUrls: ['./place-order.component.scss']
})

export class PlaceOrderComponent implements OnInit {
  cartItems: CartItem[] = [];

  constructor(
    private orderService: OrderService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadCartItems();
  }

  loadCartItems() {
    const storedItems = localStorage.getItem('cartItems');
    if (storedItems) {
      this.cartItems = JSON.parse(storedItems);
    }
  }

  increaseQuantity(item: CartItem) {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    console.log("inc",products)
    const product = products.find((p: Product) => p._id === item.ProductId); 
    //product && item.Quantity if both true allow
    if (product && item.Quantity < product.quantity) {
      item.Quantity++;
      this.updateCart();
    } else {
      this.toastr.error('Cannot increase quantity beyond available stock!', 'Error');
    }
  }

  decreaseQuantity(item: CartItem) {
    if (item.Quantity > 1) {
      item.Quantity--;
      this.updateCart();
    }
  }

  removeItem(item: CartItem) {
    this.cartItems = this.cartItems.filter(i => i.ProductId !== item.ProductId); 
    this.updateCart();
  }

  updateCart() {
    localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
  }

  placeOrder() {
    this.cartItems.forEach(item => {
      const orderRequest = {
        userId: '67b845f9d8192f270f10cd70',
        productId: item.ProductId,  
        quantity: item.Quantity     
      };
      console.log()
      this.orderService.addOrder(orderRequest).subscribe({
        next: (response) => {
          this.toastr.success(`Order placed successfully for product:`);
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Error placing order:', error);
          if (error.error?.errors) {
            const errorMessages = Object.values(error.error.errors).flat();
            alert(`Failed to place order: ${errorMessages.join(', ')}`);
          } else {
            alert('Failed to place order. Please try again.');
          }
        },
      });
    });

    //clear the cart items
    localStorage.removeItem('cartItems');
    this.cartItems = [];
  }

}

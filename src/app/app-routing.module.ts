import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductListComponent } from '../app/components/product-list/product-list.component';
import { AddProductComponent } from '../app/components/add-product/add-product.component';
import { PlaceOrderComponent } from '../app/components/place-order/place-order.component';
import { WishlistComponent } from '../app/components/wishlist/wishlist.component';

const routes: Routes = [
  { path: '', component: ProductListComponent },
  { path: 'add-product', component: AddProductComponent },
  { path: 'wishlist', component: WishlistComponent },
  { path: 'place-order', component: PlaceOrderComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],//we can connect the components using routes arr
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductListComponent } from '../app/components/product-list/product-list.component';
import { AddProductComponent } from '../app/components/add-product/add-product.component';
import { PlaceOrderComponent } from '../app/components/place-order/place-order.component';
import { ChatAssistantComponent } from './components/chat-assistant/chat-assistant.component';
import { WishlistComponent } from '../app/components/wishlist/wishlist.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import {NgxPaginationModule} from 'ngx-pagination';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { NavbarComponent } from './components/navbar/navbar.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ProductListComponent,
    AddProductComponent,
    PlaceOrderComponent,
    WishlistComponent,
    ChatAssistantComponent,
  ],
  imports: [
    BrowserModule, // module that Angular needs to run the app in the browser
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    NgxPaginationModule,
    ReactiveFormsModule,

    ToastrModule.forRoot({
      timeOut: 1000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,//If you click rapidly(or trigger the same toast notification)it will show the toast notification only once.
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

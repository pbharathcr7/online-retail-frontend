import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { apiUrl } from 'config/apiUrl';
import { OrderRequest } from 'src/app/Interfaces/order.interface';
@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${apiUrl}/orders`;

  constructor(private http: HttpClient) { }
  addOrder(orderRequest: OrderRequest): Observable<any> {
    console.log(localStorage.getItem('cartItems'));

    console.log('Sending order request:', orderRequest);
    return this.http.post(this.apiUrl, orderRequest).pipe(
      tap(response => {
        console.log('Received response:', response);
      })
    );
  }
}
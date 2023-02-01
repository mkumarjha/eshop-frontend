import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { Order } from '../models/order';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  apiUrlOrders = environment.apiURL+'orders';
  apiUrlProducts = environment.apiURL+'products';

  constructor(private http: HttpClient) { }

  getOrders(): Observable<Order[]>{
    return this.http.get<Order[]>(this.apiUrlOrders);
  }

  getOrder(orderId: string): Observable<Order>{
    return this.http.get<Order>(`${this.apiUrlOrders}/${orderId}`);
  }

  getOrdersCount(): Observable<number> {
    return this.http
      .get<number>(`${this.apiUrlOrders}/get/count`)
      .pipe(map((objectValue: any) => objectValue.orderCount));
  }

  getTotalSales(): Observable<number> {
    return this.http
      .get<number>(`${this.apiUrlOrders}/get/totalsales`)
      .pipe(map((objectValue: any) => objectValue.totalSales));
  }

  createOrder(Order: Order): Observable<Order>{
    return this.http.post<Order>(this.apiUrlOrders,Order);
  }

  updateOrder(orderStatus: {status: string}, orderId: string): Observable<Order>{
    return this.http.put<Order>(`${this.apiUrlOrders}/${orderId}`, orderStatus);
  }

  deleteOrder(orderId: string): Observable<string>{
    return this.http.delete<string>(`${this.apiUrlOrders}/${orderId}`);
  }

  getProduct(productId: string): Observable<any>{
    return this.http.get<any>(`${this.apiUrlProducts}/${productId}`);
  }

}

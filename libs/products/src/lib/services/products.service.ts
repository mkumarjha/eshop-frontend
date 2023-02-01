import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { Product } from '../models/product';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  apiUrlProducts = environment.apiURL + 'products';

  constructor(private http: HttpClient) { }

  getProducts(categoriesFilter?: string[]): Observable<Product[]>{
    let params = new HttpParams();
    if(categoriesFilter){
      params = params.append('categories',categoriesFilter.join(','));
    }
    return this.http.get<Product[]>(this.apiUrlProducts,{params: params});
  }

  getProduct(productId: string): Observable<Product>{
    return this.http.get<Product>(`${this.apiUrlProducts}/${productId}`);
  }

  getProductsCount(): Observable<number> {
    return this.http
      .get<number>(`${this.apiUrlProducts}/get/count`)
      .pipe(map((objectValue: any) => objectValue.productCount));
  }

  createProduct(productData: FormData): Observable<Product>{
    return this.http.post<Product>(this.apiUrlProducts, productData);
  }

  updateProduct(productData: FormData, productid: string): Observable<Product>{
    return this.http.put<Product>(`${this.apiUrlProducts}/${productid}`,productData);
  }

  deleteProduct(productId: string): Observable<string>{
    return this.http.delete<string>(`${this.apiUrlProducts}/${productId}`);
  }

  getFeaturedProducts(count: number): Observable<Product[]>{
    return this.http.get<Product[]>(`${this.apiUrlProducts}/get/featured/${count}`);
  }

}

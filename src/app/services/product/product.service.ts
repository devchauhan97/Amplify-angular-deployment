import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { BACKEND_API_URL } from '../../config/api.config';

export type ProductRecord = {
  product_id: number;
  product_name: string;
  price: number;
};

export type ProductInput = {
  product_name: string;
  price: number;
};

@Injectable({
  providedIn: 'root',
})
export class Product {
  private http = inject(HttpClient);

  private normalizeProduct(product: ProductRecord): ProductRecord {
    return {
      ...product,
      price: Number(product.price),
    };
  }

  getProducts(): Observable<ProductRecord[]> {
    return this.http.get<ProductRecord[]>(`${BACKEND_API_URL}/products`, {
      withCredentials: true,
    }).pipe(
      map((products) => products.map((product) => this.normalizeProduct(product))),
    );
  }

  getProduct(productId: number): Observable<ProductRecord> {
    return this.http.get<ProductRecord>(`${BACKEND_API_URL}/products/${productId}`, {
      withCredentials: true,
    }).pipe(
      map((product) => this.normalizeProduct(product)),
    );
  }

  addProduct(product: ProductInput): Observable<ProductRecord> {
    return this.http.post<ProductRecord>(
      `${BACKEND_API_URL}/products`,
      product,
      { withCredentials: true },
    ).pipe(
      map((createdProduct) => this.normalizeProduct(createdProduct)),
    );
  }

  updateProduct(product: ProductRecord): Observable<ProductRecord> {
    return this.http.put<ProductRecord>(
      `${BACKEND_API_URL}/products/${product.product_id}`,
      { product_name: product.product_name, price: product.price },
      { withCredentials: true },
    ).pipe(
      map((updatedProduct) => this.normalizeProduct(updatedProduct)),
    );
  }

  deleteProduct(productId: number): Observable<void> {
    return this.http.delete<void>(`${BACKEND_API_URL}/product/${productId}`, {
      withCredentials: true,
    });
  }
}

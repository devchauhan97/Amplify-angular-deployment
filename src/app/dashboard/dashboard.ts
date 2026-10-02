import { Component } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs';
import { Product, ProductInput, ProductRecord } from '../services/product/product.service';

@Component({
  selector: 'app-dashboard',
  imports: [FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  public products: ProductRecord[] = [];
  public selectedProduct: ProductRecord | null = null;
  public editingProduct: ProductRecord | null = null;
  public newProduct: ProductInput = this.createEmptyProduct();
  public isLoading = false;
  public errorMessage = '';

  constructor(
    private product: Product,
    private changeDetector: ChangeDetectorRef,
  ) {}
  




  
  ngOnInit() {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.product.getProducts().pipe(
      finalize(() => {
        this.isLoading = false;
        this.changeDetector.markForCheck();
      }),
    ).subscribe({
      next: (products) => { 
        this.products = products;
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = error.status === 401
          ? 'Your session has expired. Please log in again.'
          : 'Unable to load products.';
      },
    });
  }

  viewProduct(product: ProductRecord): void {
    this.product.getProduct(product.product_id).subscribe({
      next: (productDetails) => {
        this.selectedProduct = productDetails;
        this.editingProduct = null;
      },
      error: () => this.errorMessage = 'Unable to load product details.',
    });
  }

  startEditing(product: ProductRecord): void {
    this.editingProduct = { ...product };
    this.selectedProduct = null;
  }

  cancelEditing(): void {
    this.editingProduct = null;
  }

  addProduct(): void {
    this.product.addProduct(this.newProduct).subscribe({
      next: (createdProduct) => {
        this.products = [...this.products, createdProduct];
        this.newProduct = this.createEmptyProduct();
        this.errorMessage = '';
      },
      error: () => this.errorMessage = 'Unable to add product.',
    });
  }

  saveProduct(): void {
    console.log('saveProduct called', this.editingProduct);
    if (!this.editingProduct) {
      return;
    }

    this.product.updateProduct(this.editingProduct).subscribe({
      next: (updatedProduct) => {
        this.products = this.products.map((product) =>
          product.product_id === updatedProduct.product_id ? updatedProduct : product,
        );
        this.selectedProduct = updatedProduct;
        this.editingProduct = null;
        this.errorMessage = '';
      },
      error: () => this.errorMessage = 'Unable to update product.',
    });
  }

  deleteProduct(product: ProductRecord): void {
    if (!confirm(`Delete ${product.product_name}?`)) {
      return;
    }

    this.product.deleteProduct(product.product_id).subscribe({
      next: () => {
        this.products = this.products.filter((item) => item.product_id !== product.product_id);
        if (this.selectedProduct?.product_id === product.product_id) {
          this.selectedProduct = null;
        }
        if (this.editingProduct?.product_id === product.product_id) {
          this.editingProduct = null;
        }
        this.errorMessage = '';
      },
      error: () => this.errorMessage = 'Unable to delete product.',
    });
  }

  private createEmptyProduct(): ProductInput {
    return { product_name: '', price: 0 };
  }
}

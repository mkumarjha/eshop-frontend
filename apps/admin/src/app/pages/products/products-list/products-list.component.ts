import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product, ProductsService } from '@bluebits/products';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'admin-products-list',
  templateUrl: './products-list.component.html',
  styles: [
  ]
})
export class ProductsListComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  endsubs$: Subject<any> = new Subject();

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private productsService: ProductsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this._getProducts();
  }

  ngOnDestroy() {
    //this.endsubs$.next();
    this.endsubs$.complete();
  }


  private _getProducts(){
    this.productsService.getProducts()
    .pipe(takeUntil(this.endsubs$))
    .subscribe(products=>{
      this.products= products;
    })
  }
  deleteProduct(productId: string){
    this.confirmationService.confirm({
      message: 'Do you want to delete this category?',
      header: 'Delete Category',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.productsService.deleteProduct(productId)
        .pipe(takeUntil(this.endsubs$))
        .subscribe(()=>{
          this._getProducts();
          this.messageService.add({
            severity:'success', 
            summary:'Success', 
            detail:'Product is deleted !'
          });
        },()=>{
          this.messageService.add({
            severity:'error', 
            summary:'Error', 
            detail:'Product not deleted !'
          });       
        })
      },
      reject:()=> {
      }
    }); 
  }

  updateProduct(productId: string){
    this.router.navigateByUrl(`products/form/${productId}`)
  }
}

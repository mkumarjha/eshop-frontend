import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Category } from '../../models/category';
import { Product } from '../../models/product';
import { CategoriesService } from '../../services/categories.service';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'products-list',
  templateUrl: './products-list.component.html',
  styles: [
  ]
})
export class ProductsListComponent implements OnInit, OnDestroy {

  products : Product[] = [];
  categories: Category[] = [];
  isCategoryPage: boolean;
  endSubs$: Subject<any> = new Subject();
  
  constructor(private productsService: ProductsService, private categoryService: CategoriesService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe((params)=>{
      params.categoryid ? this._getProducts([params.categoryid]) : this._getProducts();
      params.categoryid ? (this.isCategoryPage = true) : (this.isCategoryPage = false);
    })
    this._getCategories();
  }

  ngOnDestroy(): void {
    //this.endSubs$.next();
    this.endSubs$.complete();
  }

  private _getProducts(categoriesFilter?: string[]){
    this.productsService.getProducts(categoriesFilter).pipe(takeUntil(this.endSubs$)).subscribe(resProducts=>{
      this.products = resProducts;
    })
  }

  private _getCategories(){
    this.categoryService.getCategories().pipe(takeUntil(this.endSubs$)).subscribe(resCats=>{
      this.categories = resCats;
    })
  }

  categoryFilter(){
    const selectedCats = this.categories.filter(category=>category.checked).map(category=>category.id);
    this._getProducts(selectedCats);
  }

}

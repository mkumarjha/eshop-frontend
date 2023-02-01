import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoriesService, Category } from '@bluebits/products';
import {ConfirmationService, MessageService} from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';


@Component({
  selector: 'admin-categories-list',
  templateUrl: './categories-list.component.html',
  styles: [
  ]
})
export class CategoriesListComponent implements OnInit, OnDestroy {
  endsubs$: Subject<any> = new Subject();
  categories: Category[] = [];

  constructor(
    private messageService: MessageService, 
    private confirmationService: ConfirmationService,
    private categoriesService: CategoriesService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this._getCategories();
  }

  ngOnDestroy() {
    //this.endsubs$.next();
    this.endsubs$.complete();
  }

  deleteCategory(categoryId: string){
    this.confirmationService.confirm({
      message: 'Do you want to delete this category?',
      header: 'Delete Category',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.categoriesService.deleteCategory(categoryId)
        .pipe(takeUntil(this.endsubs$))  
        .subscribe(()=>{
          this._getCategories();
          this.messageService.add({
            severity:'success', 
            summary:'Success', 
            detail:'Category is deleted !'
          });
        },()=>{
          this.messageService.add({
            severity:'error', 
            summary:'Error', 
            detail:'Category not deleted !'
          });       
        })
      },
      reject:()=> {
      }
    });    
  }

  updateCategory(categoryId: string){
    this.router.navigateByUrl(`categories/form/${categoryId}`)
  }

  private _getCategories(){
    this.categoriesService.getCategories()
    .pipe(takeUntil(this.endsubs$))
    .subscribe((cats)=>{
      this.categories = cats;
    })
  }
}

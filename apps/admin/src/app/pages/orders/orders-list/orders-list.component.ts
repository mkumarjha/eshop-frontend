import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Order, OrdersService } from '@bluebits/orders';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { ORDER_STATUS } from '../order.constants';

@Component({
  selector: 'admin-orders-list',
  templateUrl: './orders-list.component.html',
  styles: [
  ]
})
export class OrdersListComponent implements OnInit, OnDestroy {

  orders: Order[] = [];
  orderStatus = ORDER_STATUS;
  endsubs$: Subject<any> = new Subject();

  constructor(
    private ordersService: OrdersService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this._getOrders();
  }

  ngOnDestroy() {
    //this.endsubs$.next();
    this.endsubs$.complete();
  }

  showOrder(orderId: string){
    this.router.navigateByUrl(`orders/${orderId}`);
  }

  deleteOrder(orderId: string){
    this.confirmationService.confirm({
      message: 'Do you want to delete this category?',
      header: 'Delete Category',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.ordersService.deleteOrder(orderId)
        .pipe(takeUntil(this.endsubs$))
        .subscribe(()=>{
          this._getOrders();
          this.messageService.add({
            severity:'success', 
            summary:'Success', 
            detail:'Order deleted !'
          });
        },()=>{
          this.messageService.add({
            severity:'error', 
            summary:'Error', 
            detail:'Order has not deleted !'
          });       
        })
      },
      reject:()=> {
      }
    });
  }

  private _getOrders(){
    this.ordersService.getOrders()
    .pipe(takeUntil(this.endsubs$))
    .subscribe((orders)=>{
      this.orders = orders;
    })
  }
}

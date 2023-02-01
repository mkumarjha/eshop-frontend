import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Order, OrdersService } from '@bluebits/orders';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { ORDER_STATUS } from '../order.constants';

@Component({
  selector: 'admin-orders-detail',
  templateUrl: './orders-detail.component.html',
  styles: [
  ]
})
export class OrdersDetailComponent implements OnInit, OnDestroy {
  order: Order;
  orderStatuses =[]; 
  selectedStatus: any;
  endsubs$: Subject<any> = new Subject();

  constructor(
    private ordersService: OrdersService,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this._mapOrderStatus();
    this._getOrder();    
  }

  ngOnDestroy() {
    //this.endsubs$.next();
    this.endsubs$.complete();
  }

  private _getOrder(){
    this.route.params.subscribe((params)=>{
      if(params.id){
        this.ordersService.getOrder(params.id)
        .pipe(takeUntil(this.endsubs$))
        .subscribe(order=>{
          this.order = order;
          this.selectedStatus = order.status.toString();
        })
      }
    })    
  }

  private _mapOrderStatus(){
    this.orderStatuses = Object.keys(ORDER_STATUS).map(key=>{
      return {
        id: key,
        name: ORDER_STATUS[key].label        
      }  
    });
    
  }

  onStatusChange(event){
    this.ordersService.updateOrder({status: event.value}, this.order.id)
    .pipe(takeUntil(this.endsubs$))
    .subscribe((order)=>{
      this.messageService.add({
        severity:'success', 
        summary:'Success', 
        detail:`Order status has been updated !`
      });
    },()=> {
      this.messageService.add({
        severity:'error', 
        summary:'Error', 
        detail:'Order has not updated !'
      });       
    })
  }

  deleteOrder(orderId: string){

  }

}

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'orders-order-summary',
  templateUrl: './order-summary.component.html',
  styles: [
  ]
})
export class OrderSummaryComponent implements OnInit {
  totalPrice = 0;
  constructor() { }

  ngOnInit(): void {
  }

}

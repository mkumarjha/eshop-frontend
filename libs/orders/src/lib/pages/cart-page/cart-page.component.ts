import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CartItemDetailed } from '../../models/cart';
import { CartService } from '../../services/cart.service';
import { OrdersService } from '../../services/orders.service';

@Component({
  selector: 'orders-cart-page',
  templateUrl: './cart-page.component.html',
  styles: [
  ]
})
export class CartPageComponent implements OnInit, OnDestroy {
  cartItemsDetailed : CartItemDetailed[] = []; 
  cartCount = 0;
  endSubs$: Subject<any> = new Subject();

  constructor(
    private router: Router, 
    private cartService: CartService, 
    private ordersService: OrdersService
    ) {}

  ngOnInit(): void {
    this._getCartDetails();
  }

  ngOnDestroy(): void {
    this.endSubs$.next(true);
    this.endSubs$.complete();
  }
  private _getCartDetails(){
    this.cartService.cart$.pipe(takeUntil(this.endSubs$)).subscribe(respCart=>{
      respCart.items.forEach(cartItem=>{
        this.cartItemsDetailed = [];
        this.cartCount = respCart?.items.length ?? 0;
        this.ordersService.getProduct(cartItem.productId).subscribe((respProducts)=>{
          this.cartItemsDetailed.push({
            product: respProducts,
            quantity: cartItem.quantity
          })

        });
      })
    })
  }

  backToShop(){
    this.router.navigate(['products']);
  }
  deleteCartItem(cartItem: CartItemDetailed){
    this.cartService.deleteCartItem(cartItem.product.id);
  }

}

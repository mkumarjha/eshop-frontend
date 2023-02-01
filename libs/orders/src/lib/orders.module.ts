import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CartService } from './services/cart.service';
import { CartIconComponent } from './components/cart-icon/cart-icon.component';
import { BadgeModule } from 'primeng/badge';
import { CartPageComponent } from './pages/cart-page/cart-page.component';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { OrderSummaryComponent } from './components/order-summary/order-summary.component';


//export const ordersRoutes: Route[] = [];
const routes: Routes = [
  {
    path: 'cart',
    component: CartPageComponent
  }
];

@NgModule({
    imports: [CommonModule, BadgeModule, RouterModule.forChild(routes), ButtonModule, InputNumberModule],
    declarations: [
      CartIconComponent,
      CartPageComponent,
      OrderSummaryComponent
    ],
    exports: [
      CartIconComponent,
      CartPageComponent
    ]
})
export class OrdersModule {
    constructor(cartService: CartService){
        cartService.initCartLocalStorage();
    }
}

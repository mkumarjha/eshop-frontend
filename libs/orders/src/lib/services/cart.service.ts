import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Cart, CartItem } from '../models/cart';

export const CART_KEY = "cart" ;

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cart$ : BehaviorSubject<Cart> = new BehaviorSubject(this.getCart()); 
  constructor() { }

  initCartLocalStorage(){
    const cart = this.getCart();
    if(!cart){
      const initialCart = {
        items: []
      }
      const initialCartJsonString = JSON.stringify(initialCart)
      localStorage.setItem(CART_KEY, initialCartJsonString);
    }
    
  }

  getCart(){
    const cartJsonString: string =localStorage.getItem(CART_KEY);
    const cart: Cart= JSON.parse(cartJsonString);
    return cart;
  }

  setCartItem(cartItem: CartItem): Cart {
    const cart: Cart = this.getCart();
    const cartItemExist = cart.items.find((item)=> item.productId==cartItem.productId);

    if(cartItemExist){
      cart.items && cart.items.map((item) => {
        if(item.productId==cartItem.productId){
          item.quantity = item.quantity + cartItem.quantity;
          
        }
        return item;
      });
    }else{
      cart.items.push(cartItem);
    }
    const cartJsonString = JSON.stringify(cart)
    localStorage.setItem(CART_KEY, cartJsonString);
    this.cart$.next(cart);
    return cart;
  }

  deleteCartItem(productId: string){
    const cart: Cart = this.getCart();
    const newCart = cart.items.filter(item=> item.productId != productId);
    cart.items = newCart;    
    
    const cartJsonString = JSON.stringify(cart)
    localStorage.setItem(CART_KEY, cartJsonString);

    this.cart$.next(cart);
  }

}

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { NxWelcomeComponent } from './nx-welcome.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { UiModule } from '@bluebits/ui';
import {AccordionModule} from 'primeng/accordion';
import { NavComponent } from './shared/nav/nav.component';
import { ProductsModule } from '@bluebits/products';
import { HttpClientModule } from '@angular/common/http';
import { OrdersModule } from '@bluebits/orders';
import { MessagesComponent } from './shared/messages/messages.component';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

const routes: Routes = [
  {path: '', component: HomePageComponent},
];

@NgModule({
  declarations: [
    AppComponent, 
    NxWelcomeComponent, 
    HomePageComponent, 
    HeaderComponent, 
    FooterComponent, 
    NavComponent, 
    MessagesComponent
  ],
  imports: [
    BrowserModule, 
    BrowserAnimationsModule, 
    RouterModule.forRoot(routes), 
    AccordionModule,
    ProductsModule,
    UiModule,
    HttpClientModule,
    OrdersModule,
    ToastModule

  ],
  providers: [MessageService],
  bootstrap: [AppComponent],
})

export class AppModule {}
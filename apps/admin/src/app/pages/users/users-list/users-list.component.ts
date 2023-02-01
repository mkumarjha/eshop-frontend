import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User, UsersService } from '@bluebits/users';
import { ConfirmationService, MessageService } from 'primeng/api';
import * as countriesLib from 'i18n-iso-countries';
import { Subject, takeUntil } from 'rxjs';

declare const require;
@Component({
  selector: 'admin-users-list',
  templateUrl: './users-list.component.html',
  styles: [
  ]
})
export class UsersListComponent implements OnInit, OnDestroy {

  users: User[] = [];
  endsubs$: Subject<any> = new Subject();

  constructor(
    private messageService: MessageService, 
    private confirmationService: ConfirmationService,
    private usersService: UsersService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this._getUsers();
  }

  ngOnDestroy() {
    //this.endsubs$.next();
    this.endsubs$.complete();
  }

  deleteUser(userId: string){
    this.confirmationService.confirm({
      message: 'Do you want to delete this user?',
      header: 'Delete User',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.usersService.deleteUser(userId)
        .pipe(takeUntil(this.endsubs$))  
        .subscribe(()=>{
          this._getUsers();
          this.messageService.add({
            severity:'success', 
            summary:'Success', 
            detail:'User is deleted !'
          });
        },()=>{
          this.messageService.add({
            severity:'error', 
            summary:'Error', 
            detail:'User not deleted !'
          });       
        })
      },
      reject:()=> {
      }
    });    
  }

  updateUser(userId: string){
    this.router.navigateByUrl(`users/form/${userId}`)
  }

  private _getUsers(){    
    this.usersService.getUsers()
    .pipe(takeUntil(this.endsubs$))  
    .subscribe((users)=>{
      console.log(users);
      this.users = users;
    })
  }

  getCountryName(countryCode: string){
    countriesLib.registerLocale(require("i18n-iso-countries/langs/en.json"));
    const countryName = countriesLib.getName(countryCode, "en", {select: "official"});
    return countryName;
  }

}

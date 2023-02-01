import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { User, UsersService } from '@bluebits/users';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil, timer } from 'rxjs';
import * as countriesLib from 'i18n-iso-countries';

declare const require;

@Component({
  selector: 'admin-users-form',
  templateUrl: './users-form.component.html',
  styles: [
  ]
})
export class UsersFormComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  isSubmitted = false;
  editMode = false;
  currentUserId = '';
  countries = [];
  endsubs$: Subject<any> = new Subject();

  constructor(
    private messageService: MessageService, 
    private formBuilder: FormBuilder, 
    private usersService: UsersService,
    private location: Location,
    private route: ActivatedRoute 

  ) { }

  ngOnInit(): void {
    this._initUserForm();
    this._getCountries();
    this._checkEditMode();
  }

  ngOnDestroy() {
    //this.endsubs$.next();
    this.endsubs$.complete();
  }

  private _initUserForm(){
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      phone: ['', Validators.required],
      isAdmin: [false],
      street: [''],
      apartment: [''],
      zip: [''],
      city: [''],
      country: ['']
    })
  }

  private _getCountries(){
    countriesLib.registerLocale(require("i18n-iso-countries/langs/en.json"));
    console.log(countriesLib.getNames('en',{select: "official"}));
    this.countries = Object.entries(countriesLib.getNames('en',{select: "official"})).map(
      (entry)=>{
        return {
          id: entry[0],
          name: entry[1]
        }
      }
    )
  }

  onSubmit(){
    this.isSubmitted = true;
    if(this.form.invalid){
      return;
    }
    const user: User = {
      name: this.userForm.name.value,
      email: this.userForm.email.value,
      password: this.userForm.password.value,
      phone: this.userForm.phone.value,
      isAdmin: this.userForm.isAdmin.value,
      street: this.userForm.street.value,
      apartment: this.userForm.apartment.value,
      zip: this.userForm.zip.value,
      city: this.userForm.city.value,
      country: this.userForm.country.value,  
    }

    if(this.editMode){
      // update user
      user.id = this.currentUserId;
      this._updateUser(user)
    }else{
      // create category
      this._addUser(user)
    }
  }

  goToUsersList(){
    this.location.back();
  }

  private _addUser(user: User){
    this.usersService.createUser(user)
    .pipe(takeUntil(this.endsubs$))  
    .subscribe((user: User) =>{
      this.messageService.add({
        severity:'success', 
        summary:'Success', 
        detail:`User ${user.name} is created !`
      });
      timer(2000)
      .toPromise()
      .then(() =>{
        this.location.back();
      });
    },()=> {
      this.messageService.add({
        severity:'error', 
        summary:'Error', 
        detail:'User is not created !'
      });       
    });
  }

  private _updateUser(user: User){
    this.usersService.updateUser(user)
    .pipe(takeUntil(this.endsubs$))  
    .subscribe(() =>{
      this.messageService.add({
        severity:'success', 
        summary:'Success', 
        detail:'User updated !'
      });
      timer(2000)
      .toPromise()
      .then(() =>{
        this.location.back();
      });
    },()=> {
      this.messageService.add({
        severity:'error', 
        summary:'Error', 
        detail:'User has not updated !'
      });       
    });

  }

  private _checkEditMode(){
    this.route.params
    .pipe(takeUntil(this.endsubs$))  
    .subscribe(params=>{
      if(params.id){
        this.editMode = true;
        this.currentUserId = params.id;
        this.usersService.getUser(params.id).subscribe(user=>{
          this.userForm.name.setValue(user.name);
          this.userForm.email.setValue(user.email);
          this.userForm.isAdmin.setValue(user.isAdmin);
          this.userForm.street.setValue(user.street);
          this.userForm.phone.setValue(user.phone),
          this.userForm.apartment.setValue(user.apartment);
          this.userForm.zip.setValue(user.zip);
          this.userForm.city.setValue(user.city);
          this.userForm.country.setValue(user.country);
          this.userForm.password.setValidators([]);
          this.userForm.password.updateValueAndValidity();
        })
      }
    })
  }

  get userForm(){
    return this.form.controls;
  }

}

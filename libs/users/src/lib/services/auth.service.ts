import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { LocalstorageService } from './localstorage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiUrlUsers = environment.apiURL+'users';
  
  constructor(
    private http: HttpClient, 
    private localstorageService: LocalstorageService,
    private router: Router
  ) { }

  login(email: string, password: string): Observable<User>{
    return this.http.post<User>(`${this.apiUrlUsers}/login`,{email, password});
  }

  logout(){
    this.localstorageService.removeToken();
    this.router.navigate(['/login']);
  }
}

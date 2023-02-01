import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  apiUrlUsers = environment.apiURL+'users';

  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]>{
    return this.http.get<User[]>(this.apiUrlUsers);
  }

  getUser(userId: string): Observable<User>{
    return this.http.get<User>(`${this.apiUrlUsers}/${userId}`);
  }

  getUsersCount(): Observable<number> {
    return this.http
      .get<number>(`${this.apiUrlUsers}/get/count`)
      .pipe(map((objectValue: any) => objectValue.userCount));
  }

  createUser(user: User): Observable<User>{
    return this.http.post<User>(this.apiUrlUsers,user);
  }

  updateUser(user: User): Observable<User>{
    return this.http.put<User>(`${this.apiUrlUsers}/${user.id}`, user);
  }

  deleteUser(userId: string): Observable<string>{
    return this.http.delete<string>(`${this.apiUrlUsers}/${userId}`);
  }
  
}

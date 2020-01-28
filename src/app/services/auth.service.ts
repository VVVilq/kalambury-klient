import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../model/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;
    
    constructor(private http: HttpClient) {
  
      this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
      this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
}

httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

login(username: string, password: string) {
  return this.http.post<any>(`http://localhost:8080/login`, { username, password })
      .pipe(map(user => {
          console.log(user)
          // login successful if there's a jwt token in the response
          if (user && user.token) {
              console.log("ss")
              // store user details and jwt token in local storage to keep user logged in between page refreshes
              localStorage.setItem('currentUser', JSON.stringify(user));
              console.log(user);
              this.currentUserSubject.next(user);
          }

          return user;
      }));
}

signUp(signUpForm:any){
  return this.http.post<any>("http://localhost:8080/signup", signUpForm, this.httpOptions)
}

logout() {
  // remove user from local storage to log user out
  localStorage.removeItem('currentUser');
  this.currentUserSubject.next(null);
}
}

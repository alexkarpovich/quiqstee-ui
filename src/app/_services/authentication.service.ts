import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';

import { environment, TOKEN_KEY, CURRENT_USER_KEY } from '../../environments/environment';
import { User } from '../_models';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    private tokenSubject: BehaviorSubject<string>;
    private jwt: JwtHelperService;
    public currentUser: Observable<User>;
    public token: Observable<string>;

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem(CURRENT_USER_KEY)));
        this.tokenSubject = new BehaviorSubject<string>(localStorage.getItem(TOKEN_KEY));
        this.currentUser = this.currentUserSubject.asObservable();
        this.token = this.tokenSubject.asObservable();
        this.jwt = new JwtHelperService();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    public get tokenValue(): string {
        return this.tokenSubject.value;
    }

    login(email: string, password: string) {
        return this.http.post<any>(`${environment.apiUrl}/login`, { email, password })
            .pipe(map(res => {
                console.log(res)
                // login successful if there's a jwt token in the response
                if (res.data && res.data.token) {
                    const decodedToken = this.jwt.decodeToken(res.data.token);
                    console.log(decodedToken)
                    const currentUser = {...decodedToken, id: decodedToken.uid};

                    localStorage.setItem(TOKEN_KEY, res.data.token);
                    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
                    this.currentUserSubject.next(currentUser);
                }

                return res;
            }));
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem(CURRENT_USER_KEY);
        localStorage.removeItem(TOKEN_KEY);
        this.currentUserSubject.next(null);
        this.tokenSubject.next(null);
    }
}

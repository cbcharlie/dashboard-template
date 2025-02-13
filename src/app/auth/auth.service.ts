import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import * as jwt_decode from "jwt-decode";

import dayjs from "dayjs";
interface User {
    success: boolean;
    user: any;
    token: string;
}

@Injectable()


export class AuthService {

    constructor(private http: HttpClient) {

    }

    login(email:string, password:string ) {
        return this.http.post<User>('/api/v1/auth/login', {email, password})
            .subscribe((data) => {
                console.log(data)
                if (data.success) {
                    this.setSession(data)
                }
         
            }) 

    }
          
    private setSession(authResult:any) {
        const decoded:any = jwt_decode.jwtDecode(authResult.token)

        const expiresAt = dayjs(new Date(decoded.exp * 1000))
        localStorage.setItem('id_token', authResult.token);
        localStorage.setItem("expires_at", JSON.stringify(expiresAt) );
    }          

    logout() {
        localStorage.removeItem("id_token");
        localStorage.removeItem("expires_at");
    }

    public isLoggedIn() {
        return dayjs().isBefore(this.getExpiration());
    }

    isLoggedOut() {
        return !this.isLoggedIn();
    }

    getExpiration() {
        const expiration:any = localStorage.getItem("expires_at");
        return dayjs(JSON.parse(expiration));
    }    
}
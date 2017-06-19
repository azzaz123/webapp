import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { CookieService } from "angular2-cookie/core";
import { LoginService } from "./login.service";

@Injectable()
export class AlreadyLoggedGuard implements CanActivate {

    constructor(private router: Router,
                private cookieService: CookieService,
                private loginService: LoginService) {
    }

    public canActivate() {
        let token: string = this.cookieService.get('token');
        let username: string = this.cookieService.get('username');
        if (token && username) {
            this.initApp(token);
            this.deleteCookies();
            this.router.navigate(['/overview']);
            return false;
        }
        return true;
    }

    private initApp(token: string): void {
        this.loginService.token = token;
    }

    private deleteCookies(): void {
        this.cookieService.remove('token');
        this.cookieService.remove('username');
    }
}

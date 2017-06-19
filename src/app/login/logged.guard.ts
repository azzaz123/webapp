import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LoginService } from "./login.service";
@Injectable()
export class LoggedGuard implements CanActivate {

    constructor(private router: Router,
                private loginService: LoginService) {
    }

    public canActivate() {
        this.checkToken();
        return true;
    }

    private checkToken(): void {
        this.loginService.checkToken().subscribe(() => {},
            () => {
                this.loginService.logout();
                this.router.navigate(['/login']);
            });
    }
}


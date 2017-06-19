import { Component, OnInit } from '@angular/core';
import { LoginService } from "../login.service";
import { Router } from "@angular/router";

@Component({
    selector:    'vsn-login',
    templateUrl: 'login.component.html'
})
export class LoginComponent implements OnInit {

    constructor(private loginService: LoginService,
                private router: Router) {
    }

    ngOnInit() {
    }

    private setLocalStorageVariables(token: string, username: string): void {
        this.loginService.token = token;
        localStorage.setItem('token', token);
        localStorage.setItem('username', username);
    }

}

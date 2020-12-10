import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccessTokenService } from '@core/http/access-token.service';
import { LoginResponse } from './core/login-response.interface';
import { LoginService } from './core/services/login.service';

const TEST_INSTALLATION_TYPE = 'WEB';

@Component({
  selector: 'tsl-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;
  public loading: boolean;

  constructor(
    fb: FormBuilder,
    private accessTokenService: AccessTokenService,
    private loginService: LoginService,
    private router: Router
  ) {
    this.loginForm = fb.group({
      emailAddress: ['', [Validators.required]],
      installationType: [TEST_INSTALLATION_TYPE],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    if (this.accessTokenService.accessToken) {
      this.router.navigate(['/chat']);
    }
  }

  public onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true;
      this.loginService.login(this.loginForm.value).subscribe(
        (r: LoginResponse) => {
          this.router.navigate(['/chat']);
        },
        (res) => {
          this.loading = false;
          console.error(res);
        }
      );
    }
  }
}

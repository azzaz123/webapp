import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '@core/user/user.service';
import { LoginResponse } from './core/login-response.interface';

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
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.loginForm = fb.group({
      emailAddress: ['', [Validators.required]],
      installationType: [TEST_INSTALLATION_TYPE],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    if (this.userService.isLogged) {
      this.router.navigate(['/chat']);
    }
  }

  public onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true;
      this.userService.login(this.loginForm.value).subscribe(
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

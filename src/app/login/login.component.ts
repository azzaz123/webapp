import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginResponse } from 'shield';
import { Router } from '@angular/router';
import { UserService } from 'shield/lib/shield/user/user.service';

const TEST_INSTALLATION_TYPE: string = 'WEB';

@Component({
  selector: 'tsl-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent {

  public loginForm: FormGroup;
  public loading: boolean;

  constructor(private fb: FormBuilder,
              private userService: UserService,
              private router: Router) {
    this.loginForm = fb.group({
      emailAddress: ['', [Validators.required]],
      installationType: [TEST_INSTALLATION_TYPE],
      password: ['', [Validators.required]]
    });
  }

  public onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true;
      this.userService.login(this.loginForm.value).subscribe((r: LoginResponse) => {
        this.router.navigate(['/chat']);
      }, (res) => {
        this.loading = false;
        console.error(res);
      });
    }
  }

}

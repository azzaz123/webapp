import { Component, OnInit } from '@angular/core';
import { MotorPlan } from '../../core/user/user-response.interface';
import { UserService } from '../../core/user/user.service';

@Component({
  selector: 'tsl-profile-subscription',
  templateUrl: './profile-subscription.component.html',
  styleUrls: ['./profile-subscription.component.scss']
})
export class ProfileSubscriptionComponent implements OnInit {

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userService.getMotorPlan().subscribe((motorPlan: MotorPlan) => {
      console.log(motorPlan);
    });
  }

}

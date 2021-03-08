import { Injectable } from '@angular/core';
import { TutorialService } from '@core/tutorial/tutorial.service';
import { UserService } from '@core/user/user.service';

@Injectable()
export class BumpTutorialService extends TutorialService {
  public maxSteps: number;

  constructor(userService: UserService) {
    super(userService);
    this.maxSteps = 2;
  }
}

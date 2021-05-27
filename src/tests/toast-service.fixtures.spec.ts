import { Injectable } from '@angular/core';
import { Toast } from '@layout/toast/core/interfaces/toast.interface';

@Injectable()
export class MockToastService {
  public show(toast: Toast): void {}
  public remove(toast: Toast): void {}
}

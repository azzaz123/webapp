import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UnblockUserComponent } from './unblock-user.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

describe('UnblockUserComponent', () => {
  let component: UnblockUserComponent;
  let fixture: ComponentFixture<UnblockUserComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        providers: [NgbActiveModal],
        declarations: [UnblockUserComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(UnblockUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';

import { StatusIconComponent } from './status-icon.component';

describe('StatusIconComponent', () => {
  let component: StatusIconComponent;
  let fixture: ComponentFixture<StatusIconComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SvgIconModule],
        declarations: [StatusIconComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

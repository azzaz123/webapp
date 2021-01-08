import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ErrorBoxComponent } from './error-box.component';

describe('ErrorBoxComponent', () => {
  let component: ErrorBoxComponent;
  let fixture: ComponentFixture<ErrorBoxComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [],
        declarations: [ErrorBoxComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

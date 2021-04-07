import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MOCK_ERROR_BOX_EXIT_BUTTON, MOCK_ERROR_BOX_EXIT_LINK } from '@fixtures/error-box.fixtures.spec';
import { ButtonModule } from '@shared/button/button.module';
import { ErrorBoxComponent } from './error-box.component';

describe('ErrorBoxComponent', () => {
  let component: ErrorBoxComponent;
  let fixture: ComponentFixture<ErrorBoxComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [ButtonModule],
        declarations: [ErrorBoxComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorBoxComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

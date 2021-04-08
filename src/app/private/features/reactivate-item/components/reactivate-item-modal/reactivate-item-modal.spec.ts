import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactivateItemModalComponent } from './reactivate-item-modal.component';
import { HttpClientModule } from '@angular/common/http';
import { SvgIconModule } from '@core/svg-icon/svg-icon.module';
import { ComponentFixture, waitForAsync, TestBed } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

describe('ReactivateItemModalComponent', () => {
  let component: ReactivateItemModalComponent;
  let fixture: ComponentFixture<ReactivateItemModalComponent>;
  let element: HTMLElement;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientModule, SvgIconModule],
        declarations: [ReactivateItemModalComponent],
        providers: [NgbActiveModal],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ReactivateItemModalComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });
  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

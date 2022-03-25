import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SvgIconStubComponent } from '@fixtures/shared/components/svg-icon.component.stub';

import { WebViewModalComponent } from './web-view-modal.component';

describe('WebViewModalComponent', () => {
  let component: WebViewModalComponent;
  let fixture: ComponentFixture<WebViewModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WebViewModalComponent, SvgIconStubComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WebViewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

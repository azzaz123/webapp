import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AdComponent } from './ad.component';
import { By } from '@angular/platform-browser';

describe('AdComponent', () => {
  let component: AdComponent;
  let fixture: ComponentFixture<AdComponent>;
  const slotid = 'div-gpt-ad-1508490196308-0';
  const height = 200;
  const width = 400;
  let elementRef: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdComponent);
    component = fixture.componentInstance;
    component.slotid = slotid;
    component.height = height;
    component.width = width;
    fixture.detectChanges();

    elementRef = fixture.debugElement.query(By.css(`#${slotid}`)).nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should set div element id', () => {
    expect(elementRef).toBeTruthy();
  });

  it('should set div element height', () => {
    expect(elementRef.style.height).toEqual(`${height}px`);
  });

  it('should set div element width', () => {
    expect(elementRef.style.width).toEqual(`${width}px`);
  });
});

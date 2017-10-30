import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';

import { AdComponent } from './ad.component';

describe('AdComponent', () => {
  let component:  AdComponent;
  let fixture:    ComponentFixture<AdComponent>;
  let de:         DebugElement;
  let el:         HTMLElement;
  let slodid      = 'div-gpt-ad-1508490196308-0';
  let height      = 200;
  let width       = 400;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture     = TestBed.createComponent(AdComponent);
    component   = fixture.componentInstance;
    de          = fixture.debugElement;
    el          = de.nativeElement;

    slodid = 'div-gpt-ad-1508490196308-0';
    height = 400;
    width = 200;

    component.slotid = slodid;
    component.height = height;
    component.width = width;

    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should set div element id', () => {
    expect(el.querySelector(`#${slodid}`)).toBeTruthy();
  });

  it('should set div element height', () => {
    expect(el.querySelector(`#${slodid}`).clientHeight).toEqual(height);
  });

  it('should set div element width', () => {
    expect(el.querySelector(`#${slodid}`).clientWidth).toEqual(width);
  });
});

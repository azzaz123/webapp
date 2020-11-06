import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ScrollingMessageComponent } from './scrolling-message.component';

describe('ScrollingMessageComponent', () => {
  let component: ScrollingMessageComponent;
  let fixture: ComponentFixture<ScrollingMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [ScrollingMessageComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScrollingMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check if number of messages is null, undefinied or empty', () => {
    component.noMessages = null;
    expect(component.isNullOrUndefinedOrEmpty()).toEqual(true);

    component.noMessages = undefined;
    expect(component.isNullOrUndefinedOrEmpty()).toEqual(true);

    component.noMessages = 0;
    expect(component.isNullOrUndefinedOrEmpty()).toEqual(true);

    component.noMessages = 1;
    expect(component.isNullOrUndefinedOrEmpty()).toEqual(false);

    component.noMessages = 5;
    expect(component.isNullOrUndefinedOrEmpty()).toEqual(false);
  });

  it('should check if number of messages is equal one', () => {
    component.noMessages = null;
    expect(component.hasEqOneMessage()).toEqual(false);

    component.noMessages = undefined;
    expect(component.hasEqOneMessage()).toEqual(false);

    component.noMessages = 0;
    expect(component.hasEqOneMessage()).toEqual(false);

    component.noMessages = 1;
    expect(component.hasEqOneMessage()).toEqual(true);

    component.noMessages = 5;
    expect(component.hasEqOneMessage()).toEqual(false);
  });

  it('should check if number of messages is grater than one', () => {
    component.noMessages = null;
    expect(component.hasGtThanOneMessage()).toEqual(false);

    component.noMessages = undefined;
    expect(component.hasGtThanOneMessage()).toEqual(false);

    component.noMessages = 0;
    expect(component.hasGtThanOneMessage()).toEqual(false);

    component.noMessages = 1;
    expect(component.hasGtThanOneMessage()).toEqual(false);

    component.noMessages = 5;
    expect(component.hasGtThanOneMessage()).toEqual(true);
  });
});

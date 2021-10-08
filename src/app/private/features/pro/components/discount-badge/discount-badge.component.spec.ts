import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DiscountBadgeComponent } from './discount-badge.component';

@Component({
  template: `<tsl-discount-badge>Test</tsl-discount-badge>`,
})
class TestHostComponent {}

describe('DiscountBadgeComponent', () => {
  let component: DiscountBadgeComponent;
  let fixture: ComponentFixture<DiscountBadgeComponent>;
  let hostFixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DiscountBadgeComponent, TestHostComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscountBadgeComponent);
    hostFixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show text', () => {
    const childElement = hostFixture.debugElement.query(By.directive(DiscountBadgeComponent)).nativeElement;

    expect(childElement.textContent).toEqual('Test');
  });
});

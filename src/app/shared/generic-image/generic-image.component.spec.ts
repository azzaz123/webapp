import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GenericImageComponent } from './generic-image.component';

describe('GenericImageComponent', () => {
  let component: GenericImageComponent;
  let fixture: ComponentFixture<GenericImageComponent>;
  let element: HTMLElement;

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericImageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });
});

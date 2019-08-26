
import { Component, NO_ERRORS_SCHEMA, HostListener } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PreventDoubleClickDirective } from './prevent-double-click.directive'
import { ButtonComponent } from '../button/button.component'

@Component({
  template: `<button preventDoubleClick></button>`
})
class TestComponent {
  alreadyClicked: boolean;
  
  constructor() { }

  @HostListener('click', ['$event'])
  clickEvent(event) {
    if (this.alreadyClicked) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      this.alreadyClicked = true;
      setTimeout( () => this.alreadyClicked = false, 500);
    }
  }
}

describe('PreventDoubleClickDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreventDoubleClickDirective, ButtonComponent, TestComponent ],
      providers: [],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });

  describe('a click is fired', () => {
    it('should stop the event if button is already clicked', () => {
      component.alreadyClicked = true;
      const event = new Event('click', { bubbles: true });
      spyOn(event, 'preventDefault');
      spyOn(event, 'stopPropagation');

      component.clickEvent(event);
      fixture.detectChanges();
      
      expect(event.preventDefault).toHaveBeenCalled();
      expect(event.stopPropagation).toHaveBeenCalled();
    });

    it('should allow the event if button is not already clicked', () => {
      component.alreadyClicked = false;
      const event = new Event('click', { bubbles: true });
      spyOn(event, 'preventDefault');
      spyOn(event, 'stopPropagation');

      fixture.detectChanges();
      component.clickEvent(event);

      expect(event.preventDefault).not.toHaveBeenCalled();
      expect(event.stopPropagation).not.toHaveBeenCalled();
    });

    it('should set already clicked to true if button is not already clicked', () => {
      component.alreadyClicked = false;
      const event = new Event('click', { bubbles: true });
      spyOn(event, 'preventDefault');
      spyOn(event, 'stopPropagation');

      fixture.detectChanges();
      component.clickEvent(event);

      expect(component.alreadyClicked).toBe(true);
    });
  });
});
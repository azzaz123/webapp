import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconGridCheckFormComponent } from './icon-grid-check-form.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('IconGridCheckFormComponent', () => {
  let component: IconGridCheckFormComponent;
  let fixture: ComponentFixture<IconGridCheckFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IconGridCheckFormComponent],
      imports: [HttpClientTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IconGridCheckFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when value changes', () => {
    it('should call value change', () => {
      spyOn(component, 'onChange');

      component.writeValue(['test']);

      expect(component.onChange).toHaveBeenCalledWith(['test']);
    });
  });
});

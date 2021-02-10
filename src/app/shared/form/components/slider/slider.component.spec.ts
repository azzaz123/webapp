import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SliderComponent } from './slider.component';

describe('SliderComponent', () => {
  let component: SliderComponent;
  let fixture: ComponentFixture<SliderComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({}).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SliderComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovableMapComponent } from './movable-map.component';

describe('MovableMapComponent', () => {
  let component: MovableMapComponent;
  let fixture: ComponentFixture<MovableMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MovableMapComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MovableMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

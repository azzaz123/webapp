import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideSkyComponent } from './side-sky.component';

describe('SideSkyComponent', () => {
  let component: SideSkyComponent;
  let fixture: ComponentFixture<SideSkyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SideSkyComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SideSkyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopSkyComponent } from './top-sky.component';

describe('TopSkyComponent', () => {
  let component: TopSkyComponent;
  let fixture: ComponentFixture<TopSkyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TopSkyComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopSkyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

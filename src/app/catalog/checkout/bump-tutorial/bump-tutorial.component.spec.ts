import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BumpTutorialComponent } from './bump-tutorial.component';

describe('BumpTutorialComponent', () => {
  let component: BumpTutorialComponent;
  let fixture: ComponentFixture<BumpTutorialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BumpTutorialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BumpTutorialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

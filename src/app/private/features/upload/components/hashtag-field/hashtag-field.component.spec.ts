import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HashtagFieldComponent } from './hashtag-field.component';

describe('HashtagFieldComponent', () => {
  let component: HashtagFieldComponent;
  let fixture: ComponentFixture<HashtagFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HashtagFieldComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HashtagFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

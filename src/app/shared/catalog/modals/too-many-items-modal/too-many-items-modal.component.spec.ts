import { TestBed, ComponentFixture } from '@angular/core/testing';
import { MatIconModule } from '@angular/material';

import { TooManyItemsModalComponent } from './too-many-items-modal.component';

describe('ItemAvatarComponent', () => {
  let component: TooManyItemsModalComponent;
  let fixture: ComponentFixture<TooManyItemsModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        MatIconModule
      ],
      declarations: [
        TooManyItemsModalComponent
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TooManyItemsModalComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

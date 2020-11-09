import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockUserComponent } from './block-user.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

describe('BlockUserComponent', () => {
  let component: BlockUserComponent;
  let fixture: ComponentFixture<BlockUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [NgbActiveModal],
      declarations: [BlockUserComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

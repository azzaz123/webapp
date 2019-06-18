import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockSendLinkComponent } from './block-send-link.component';

describe('BlockSendLinkComponent', () => {
  let component: BlockSendLinkComponent;
  let fixture: ComponentFixture<BlockSendLinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlockSendLinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockSendLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

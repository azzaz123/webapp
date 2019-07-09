import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageComponent } from './message.component';
import { LinkTransformPipe } from '../../../shared/pipes/link-transform';

class MessageComponentMock extends MessageComponent {
}

describe('MessageComponent', () => {
  let component: MessageComponent;

  beforeEach(() => {
    component = new MessageComponentMock();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it('should clear current conversation if has no phone request', () => {
  //   expect(component).toBeTruthy();
  // });
});

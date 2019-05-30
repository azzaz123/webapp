/* tslint:disable:no-unused-variable */

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { ChatComponent } from './chat.component';
import { InboxService } from '../core/inbox/inbox.service';

describe('Component: Chat', () => {

  let component: ChatComponent;
  let inboxService: InboxService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChatComponent],
      providers: [
        ChatComponent,
        { provide: InboxService, useValue: {
            getInboxFeatureFlag$() {
              return Observable.of(true);
            }
        }}
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
    component = TestBed.createComponent(ChatComponent).componentInstance;
    inboxService = TestBed.get(InboxService);
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call inboxService.inboxFeatureflagValue', () => {
      spyOn(inboxService, 'getInboxFeatureFlag$').and.callThrough();

      component.ngOnInit();

      expect(inboxService.getInboxFeatureFlag$).toHaveBeenCalled();
    });

    it('should set inboxFeatureflagValue to the value returned by inboxService.inboxFeatureflagValue', () => {
      const expectedValue = true;
      spyOn(inboxService, 'getInboxFeatureFlag$').and.returnValue(Observable.of(expectedValue));

      component.ngOnInit();

      expect(component.inboxFeatureflagValue).toBe(expectedValue);
    });
  });
});

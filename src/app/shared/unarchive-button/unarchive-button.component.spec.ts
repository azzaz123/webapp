/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { UnarchiveButtonComponent } from './unarchive-button.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { ConversationService } from '../../core/conversation/conversation.service';

describe('UnarchiveButtonComponent', () => {
  let component: UnarchiveButtonComponent;
  let fixture: ComponentFixture<UnarchiveButtonComponent>;
  let conversationService: ConversationService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NgbModule.forRoot()
      ],
      providers: [
        {
          provide: ConversationService, useValue: {
          unarchive() {
            return Observable.of({});
          }
        }
        }
      ],
      declarations: [ UnarchiveButtonComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnarchiveButtonComponent);
    component = fixture.componentInstance;
    conversationService = TestBed.get(ConversationService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('unarchive', () => {
    beforeEach(() => {
      spyOn(conversationService, 'unarchive').and.callThrough();
    });
  });
});

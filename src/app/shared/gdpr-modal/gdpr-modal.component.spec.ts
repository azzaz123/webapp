import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Response, ResponseOptions } from '@angular/http';
import { GdprModalComponent } from './gdpr-modal.component';
import { HttpService } from '../../core/http/http.service';
import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../environments/environment';

describe('GdprModalComponent', () => {
  let component: GdprModalComponent;
  let fixture: ComponentFixture<GdprModalComponent>;
  let http: HttpService;

  const MOCK_HTTP_SERVICE = {
    getNoBase() {
      return Observable.of(new Response(new ResponseOptions({body: 'text'})));
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GdprModalComponent ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        NgbActiveModal,
        {
          provide: HttpService,
          useValue: MOCK_HTTP_SERVICE
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GdprModalComponent);
    component = fixture.componentInstance;
    http = TestBed.get(HttpService);
    fixture.detectChanges();
  });

  it('ngOnInit', () => {
    spyOn(component, 'getGDPRText')

    component.ngOnInit();

    expect(component.getGDPRText).toHaveBeenCalled();
  });

  describe('getGDPRText', () => {
    beforeEach(() => {
      spyOn(http, 'getNoBase').and.callThrough();
    });

    it('should get spanish text by default ', () => {
      const url = environment.siteUrl + 'rest/gdpr/popup/es';

      component.getGDPRText();

      expect(http.getNoBase).toHaveBeenCalledWith(url);
    });

    it('should get spanish text by default ', () => {
      const url = environment.siteUrl + 'rest/gdpr/popup/gb';
      spyOn(component, 'getSubdomain').and.returnValue('web-en');

      component.getGDPRText();

      expect(http.getNoBase).toHaveBeenCalledWith(url);
    });
  });
});

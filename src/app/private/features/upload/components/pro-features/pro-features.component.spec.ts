import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SwitchComponent } from '@shared/switch/switch.component';

import { ProFeaturesComponent } from './pro-features.component';

describe('ProFeaturesComponent', () => {
  let component: ProFeaturesComponent;
  let fixture: ComponentFixture<ProFeaturesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProFeaturesComponent, SwitchComponent],
      imports: [ReactiveFormsModule, FormsModule],
      providers: [
        {
          provide: NgbModal,
          useValue: {
            open() {
              return {
                componentInstance: {},
                result: Promise.resolve('success'),
              };
            },
          },
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProFeaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('and the user click on intallation', () => {
    it('Should emit event', () => {
      const installationHtml = fixture.debugElement.queryAll(By.directive(SwitchComponent));

      expect(installationHtml).toEqual('asdasd');
    });
  });
});

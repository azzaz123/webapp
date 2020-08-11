import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { InvoiceItemComponent } from './invoice-item.component';
import { MOCK_INVOICE_HISTORY } from '../../../../tests/invoice.fixtures.spec';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('InvoiceItemComponent', () => {
  let component: InvoiceItemComponent;
  let fixture: ComponentFixture<InvoiceItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InvoiceItemComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceItemComponent);
    component = fixture.componentInstance;
  });
  
  describe('downloadInvoice', () => {
    it('should download the invoice on click', () => {
      const event = new Event('MouseEvent');
      spyOn(event, 'stopPropagation');

      component.downloadInvoice(event, MOCK_INVOICE_HISTORY[0]);

      expect(event.stopPropagation).toHaveBeenCalled();
    });
  });

});

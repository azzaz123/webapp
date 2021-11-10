import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'tsl-transaction-tracking-overview',
  templateUrl: './transaction-tracking-overview.component.html',
  styleUrls: ['./transaction-tracking-overview.component.scss'],
})
export class TransactionTrackingOverviewComponent implements OnInit {
  public trackingInfo$: Observable<any> = of({
    analytics: { buyer: { country: 'IT' }, seller: { country: 'ES' } },
    header: {
      action: {
        analytics: {
          requestId: '3d5d9154-1e52-4a99-87ee-bdedd7b1eb70',
          source: 'Help General Doubts',
          userId: '81497033',
        },
        isCarrierTrackingWebview: false,
        isDeeplink: true,
        isDialog: false,
        isDismiss: false,
        isReload: false,
        isUserAction: false,
        payload: {
          linkUrl: 'https://ayuda.wallapop.com/hc/en-us/articles/360017172677',
        },
      },
      state: { isDisabled: false },
      style: { className: 'btn btn-link' },
      title: '¿Dudas?',
    },
    shippingStatus: {
      actions: [
        {
          action: {
            isCarrierTrackingWebview: false,
            isDeeplink: false,
            isDialog: true,
            isDismiss: false,
            isReload: false,
            isUserAction: false,
            payload: {
              description: 'El envío ha ido más rápido de lo esperado... ¡a veces ocurre!',
              negative: { title: 'Cancelar' },
              positive: {
                action: {
                  isCarrierTrackingWebview: false,
                  isDeeplink: false,
                  isDialog: false,
                  isDismiss: false,
                  isReload: false,
                  isUserAction: true,
                  payload: {
                    name: 'PACKAGE_ARRIVED',
                    parameters: {
                      transactionId: '21b4ab82-320f-4c93-bdfe-15f3970494b9',
                    },
                    success: {
                      isCarrierTrackingWebview: false,
                      isDeeplink: false,
                      isDialog: false,
                      isDismiss: true,
                      isReload: false,
                      isUserAction: false,
                      payload: {},
                    },
                  },
                },
                title: 'Confirmar',
              },
              title: '¿Confirmas que ya has recogido el producto?',
            },
          },
          state: { isDisabled: false },
          style: { className: 'btn btn-primary' },
          title: 'Ya lo he recogido',
        },
      ],
      animation: {
        isLoop: true,
        isLoopReverse: false,
        isNormal: false,
        url: 'https://prod-delivery-resources.wallapop.com/transaction-tracking-screen/shipping_status_available_for_the_recipient_carrier_office_delivery_buyer_animation.json',
      },
      description:
        'Tu compra te espera en el punto de recogida situado en <strong>Via XXIV Maggio 76, 03037, Pontecorvo</strong>.<br><br>La fecha límite de recogida es el <strong>04/09/2021</strong>. Superado el plazo, será devuelto al vendedor y la transacción se cancelará.',
      title: '¡Paquete listo para recoger!',
    },
    statusInfo: [
      {
        action: {
          isCarrierTrackingWebview: true,
          isDeeplink: false,
          isDialog: false,
          isDismiss: false,
          isReload: false,
          isUserAction: false,
          payload: {
            banner: {
              title: 'Código de envío',
              trackingCode: 'WALLA82U5I7Z',
            },
            linkUrl:
              'https://www.seur.com/livetracking/pages/seguimiento-online-busqueda.do?faces-redirect=true&includeViewParams=true&&segOnlineIdentificador=WALLA82U5I7Z',
            title: 'Sigue tu envío',
          },
        },
        description: 'Código de envío<br><strong>WALLA82U5I7Z</strong><br><span style="color: #13C1AC">Hacer seguimiento</span>',
        icon: {
          url: 'https://prod-delivery-resources.wallapop.com/transaction-tracking-screen/carrier_icon%402x.png',
          thumbnailUrl: 'https://prod-delivery-resources.wallapop.com/transaction-tracking-screen/carrier_icon%402x.png',
          style: { className: 'rounded' },
        },
        showCaret: false,
      },
      {
        action: {
          isCarrierTrackingWebview: false,
          isDeeplink: true,
          isDialog: false,
          isDismiss: false,
          isReload: false,
          isUserAction: false,
          payload: {
            linkUrl: 'wallapop://customerSupport/faq/article?z=360001796618',
          },
        },
        description:
          '<strong>Tu compra está protegida</strong> por Wallapop Protect, nuestra política de protección.<br><span style="color: #13C1AC">¿Quieres saber más?</span>',
        icon: {
          url: 'https://prod-delivery-resources.wallapop.com/transaction-tracking-screen/payment+status/Icons/Delivery/Bank+Account+Warranty%402x.png',
          thumbnailUrl:
            'https://prod-delivery-resources.wallapop.com/transaction-tracking-screen/payment+status/Icons/Delivery/Bank+Account+Warranty%402x.png',
          style: { className: 'circle' },
        },
        showCaret: false,
      },
    ],
    title: 'Estado de tu compra',
  });

  constructor(private location: Location) {}

  ngOnInit(): void {}

  public goBack(): void {
    this.location.back();
  }

  public manageAction(action: any): void {
    if (action.isDeeplink) {
      this.navigateToAnExternalPage(action.payload.linkUrl);
    }
  }

  private navigateToAnExternalPage(URL: string): void {
    window.open(URL, '_blank');
  }
}

import { TransactionDetail } from '@private/features/delivery/pages/transaction-tracking-screen/interfaces/transaction-detail.interface';

export const MOCK_TRANSACTION_DETAILS: TransactionDetail[] = [
  {
    description: '<span style="color: #AFB6B6">Producto:</span><br>crayones',
    iconClassName: 'rounded',
    iconSrc: 'https://cdn-beta.wallapop.com/images/10420/35/gw/__/c10420p190584802/i421614104.jpg?pictureSize=W800',
    showCaret: true,
  },
  {
    description: '<span style="color: #AFB6B6">Total:</span><br>5.90€',
    iconClassName: null,
    iconSrc: 'https://prod-delivery-resources.wallapop.com/transaction-tracking-screen/transaction_tracking_details/price_element.png',
    showCaret: false,
  },
  {
    description: '<span style="color: #AFB6B6">Vendido por:</span><br>Coccofresco F.',
    iconClassName: 'circle',
    iconSrc: 'https://cdn-beta.wallapop.com/images/13/19/so/__/c13p76921033/i416234105.jpg?pictureSize=W800',
    showCaret: true,
  },
  {
    description: '<span style="color: #AFB6B6">Dirección de envío:</span><br>1234 No FLoor<br>08018 Barcelona',
    iconClassName: null,
    iconSrc:
      'https://prod-delivery-resources.wallapop.com/transaction-tracking-screen/transaction_tracking_details/shipping_address_element.png',
    showCaret: false,
  },
  {
    description: '<span style="color: #AFB6B6">Método de cobro:</span><br>Monedero',
    iconClassName: null,
    iconSrc:
      'https://prod-delivery-resources.wallapop.com/transaction-tracking-screen/transaction_tracking_details/payment_method_wallet_element.png',
    showCaret: false,
  },
];

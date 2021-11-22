import { TransactionTrackingDetailsDto } from '@api/bff/delivery/transaction-tracking/dtos/responses';

export const MOCK_TRANSACTION_TRACKING_DETAILS_DTO_RESPONSE: TransactionTrackingDetailsDto = {
  item: {
    icon: {
      url: 'https://cdn-beta.wallapop.com/images/10420/35/gw/__/c10420p190584802/i421614104.jpg?pictureSize=W800',
      thumbnail_url: 'https://cdn-beta.wallapop.com/images/10420/35/gw/__/c10420p190584802/i421614104.jpg?size=medium',
      style: 'rounded',
    },
    price: { amount: 5.9, currency: 'EUR' },
    title: 'crayones',
  },
  user: {
    icon: {
      url: 'https://cdn-beta.wallapop.com/images/13/19/so/__/c13p76921033/i416234105.jpg?pictureSize=W800',
      thumbnail_url: 'https://cdn-beta.wallapop.com/images/13/19/so/__/c13p76921033/i416234105.jpg?size=medium',
      style: 'circle',
    },
  },
  title: 'Detalles del pedido',
  details_info: [
    {
      icon: {
        url: 'https://cdn-beta.wallapop.com/images/10420/35/gw/__/c10420p190584802/i421614104.jpg?pictureSize=W800',
        thumbnail_url: 'https://cdn-beta.wallapop.com/images/10420/35/gw/__/c10420p190584802/i421614104.jpg?size=medium',
        style: 'rounded',
      },
      action_icon: 'caret',
      action: {
        action_type: 'deeplink',
        payload: { link_url: 'wallapop://i/190584802' },
        analytics: null,
      },
      description: '<span style="color: #AFB6B6">Producto:</span><br>crayones',
    },
    {
      icon: {
        url: 'https://prod-delivery-resources.wallapop.com/transaction-tracking-screen/transaction_tracking_details/price_element.png',
        thumbnail_url:
          'https://prod-delivery-resources.wallapop.com/transaction-tracking-screen/transaction_tracking_details/price_element.png?size=medium',
        style: 'none',
      },
      action_icon: 'none',
      action: null,
      description: '<span style="color: #AFB6B6">Total:</span><br>5.90€',
    },
    {
      icon: {
        url: 'https://cdn-beta.wallapop.com/images/13/19/so/__/c13p76921033/i416234105.jpg?pictureSize=W800',
        thumbnail_url: 'https://cdn-beta.wallapop.com/images/13/19/so/__/c13p76921033/i416234105.jpg?size=medium',
        style: 'circle',
      },
      action_icon: 'caret',
      action: {
        action_type: 'deeplink',
        payload: { link_url: 'wallapop://p/76921033' },
        analytics: null,
      },
      description: '<span style="color: #AFB6B6">Vendido por:</span><br>Coccofresco F.',
    },
    {
      icon: {
        url: 'https://prod-delivery-resources.wallapop.com/transaction-tracking-screen/transaction_tracking_details/shipping_address_element.png',
        thumbnail_url:
          'https://prod-delivery-resources.wallapop.com/transaction-tracking-screen/transaction_tracking_details/shipping_address_element.png?size=medium',
        style: 'none',
      },
      action_icon: 'none',
      action: null,
      description: '<span style="color: #AFB6B6">Dirección de envío:</span><br>1234 No FLoor<br>08018 Barcelona',
    },
    {
      icon: {
        url: 'https://prod-delivery-resources.wallapop.com/transaction-tracking-screen/transaction_tracking_details/payment_method_wallet_element.png',
        thumbnail_url:
          'https://prod-delivery-resources.wallapop.com/transaction-tracking-screen/transaction_tracking_details/payment_method_wallet_element.png?size=medium',
        style: 'none',
      },
      action_icon: 'none',
      action: null,
      description: '<span style="color: #AFB6B6">Método de cobro:</span><br>Monedero',
    },
  ],
};

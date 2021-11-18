import { TransactionInfo } from '@private/features/delivery/pages/transaction-tracking-screen/interfaces/transaction-info.interface';

export const MOCK_TRANSACTION_INFO: TransactionInfo = {
  user: {
    imageSrc: 'http://localhost:6006/images/item-pc.jpg',
    className: 'circle',
  },
  item: {
    name: 'Connie',
    price: '5.9€',
    imageSrc: 'http://localhost:6006/images/item-camera.jpg',
    className: 'rounded',
  },
};

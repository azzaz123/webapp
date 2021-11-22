export interface TransactionInfo {
  user: TransactionInfoElementProperties;
  item: TransactionItemInfoElementProperties;
}

interface TransactionItemInfoElementProperties extends TransactionInfoElementProperties {
  name: string;
  price: string;
}

interface TransactionInfoElementProperties {
  imageSrc: string;
  className: string;
}

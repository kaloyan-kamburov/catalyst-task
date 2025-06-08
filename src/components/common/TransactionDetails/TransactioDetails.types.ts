// {"id":"tx_666888","amount":11.49,"currency":"EUR","status":"pending","date":"2024-06-01T12:30:00Z","description":"App subscription","merchant":"NotePro","customer":{"name":"Julia Chen","email":"jchen@example.com"},"paymentMethod":"credit_card","cardLast4":"6677","fees":0.4}

export type TransactionDetailsType = {
  id: string;
  amount: number;
  currency: string;
  status: string;
  date: string;
  description: string;
  merchant: string;
  customer: {
    name: string;
    email: string;
  };
  paymentMethod: string;
  cardLast4: string;
  fees: number;
};

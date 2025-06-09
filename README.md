# Catalyst task

Create a React application for a financial transaction dashboard that displays
transaction data with filtering, sorting, and detailed view capabilities.

## Description

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

## Requirements

- Display a list of transactions in a table format
- Implement filtering by date range, amount range, and status
- Add sorting functionality for all columns
- Create a detailed view modal/page for individual transactions
- Implement pagination for the transaction list
- Add a search functionality that works across transaction fields

## Technical Specifications:

- Use React 18+ with functional components and hooks
- Use React Query for data fetching (mock API provided)
- Style with TailwindCSS
- Add loading states and error handling
- Include form validation for filters

## Provided Data:

```js
{
  "id": "tx_123456",
  "amount": 1250.50,
  "currency": "USD",
  "status": "completed",
  "date": "2025-01-15T10:30:00Z",
  "description": "Online purchase",
  "merchant": "Tech Store Inc",
  "customer": {
    "name": "John Doe",
    "email": "john@example.com"
  },
  "paymentMethod": "credit_card",
  "cardLast4": "1234",
  "fees": 25.10
}
```

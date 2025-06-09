# Catalyst Task

A React-based web application for managing transactions with server and client-side table functionality.

### Description

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

## Provided Data (mock response):

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

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- npm (v8 or higher)

### Installation Steps

1. Clone the repository:

```bash
git clone https://github.com/kaloyan-kamburov/catalyst-task.git
cd catalyst-task
```

2. In a separate terminal, set up the backend:

```bash
cd server
npm install
npm start
```

3. Install frontend dependencies:

```bash
npm install
```

4. Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Project Structure

- `/src` - Frontend React application
  - `/components` - Reusable React components
  - `/pages` - Page components
  - `/shared` - Shared utilities and configurations
  - `/context` - Contexts for shared state
- `/server` - Backend Express server
  - `index.js` - Server entry point
  - `mockData.js` - Mock transaction data

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Features

- Table component with server-side and client-side modes
- Transaction data management
- Responsive design with Tailwind CSS
- Real-time search and filtering
- Sortable columns

## Technologies Used

- React
- TypeScript
- Vite
- Tailwind CSS
- Express (Backend)
- React Query
- React Router
- Axios

## Assumptions

- The server folder is dummy and is used only for dev purposes and is using mocked and randomized data in order to simulate real data delivered
- Table component has 2 modes - server/client. When set in server mode, it will add query params to the request url for filtering/sorting/pagination/search. When set in client mode, it will filter/sort/paginate/search the data locally, without sending requests.
- There is no redux state management added (only context api for changing the theme to light/dark). If added, I would prefer RTK Query instead of react-query, since it's more standard approach imho.
- Query params for range and date filtering are assumed to be suffixes (e.g. "{name}\_start")
- Export to CSV functionality is only by adding "&export=true" to the url. Other approaches is to have the params in it (in case the customer wants the data to be filtered/sorted/paginated).

# NOTE: I'll be honest - 50% of the code is vibe coded. During the process I've supervized it. Overall time that this task took me was 5-6h, but I think AI saved a lot of time.

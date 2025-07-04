# Budget Tracker App

A modern, full-stack budget tracking application built with Next.js, React, Supabase, and Tailwind CSS. Easily manage your income, expenses, and categories, visualize your financial data, and customize your experience with a currency selector.

## Features

- **User Authentication**: Secure login and session management.
- **Dashboard**: Overview of your finances, including total income, expenses, balance, and recent transactions.
- **Transactions**: Add, edit, delete, and filter income and expense transactions.
- **Categories**: Organize your spending, set budgets, and track category-wise spending.
- **Category Budgets**: Visual progress bars for each category's budget usage.
- **Currency Selector**: Choose your preferred currency (USD, EUR, GBP, INR, etc.) from the sidebar; all amounts update instantly across the app.
- **Responsive UI**: Clean, modern, and mobile-friendly interface.
- **Dark/Light Mode**: Toggle between dark and light themes.

## Tech Stack

- **Frontend**: Next.js (App Router), React, TypeScript
- **Styling**: Tailwind CSS
- **Icons/UI**: Lucide, custom UI components
- **Backend/Database**: Supabase (PostgreSQL)
- **Authentication**: NextAuth.js

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- Supabase project (get your API keys from [Supabase](https://supabase.com/))

### Installation
1. **Clone the repository:**
   ```bash
   git clone https://github.com/Srighnan-P/budget-tracker.git
   cd budget-tracker
   ```
2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```
3. **Configure environment variables:**
   - Copy `.env.example` to `.env.local` and fill in your Supabase and NextAuth credentials.

4. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   The app will be available at [http://localhost:3000](http://localhost:3000).

## Usage
- **Login/Register**: Authenticate to access your dashboard.
- **Add Transactions**: Click "Add Transaction" to log income or expenses.
- **Manage Categories**: Create, edit, or delete categories and set budget limits.
- **Currency Selector**: Use the dropdown in the sidebar to change the currency symbol across the app.
- **Dark/Light Mode**: Toggle the theme using the button in the sidebar.

## Customization
- **Supported Currencies**: Easily add more currencies in `SideBar.tsx`.
- **Styling**: Modify Tailwind classes or extend UI components for your brand.
- **Database**: Update Supabase schema as needed for more features (e.g., recurring transactions).

## Folder Structure
```
budget/
  app/
    api/           # API routes (Next.js)
    components/    # Reusable UI components
    dashboard/     # Dashboard page
    transactions/  # Transactions page
    categories/    # Categories page
    ...
  utils/           # Utility functions
  lib/             # Library code
  public/          # Static assets
  ...
```

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](LICENSE)

---

**Enjoy tracking your budget!**

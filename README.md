# Credit Card Application Frontend

## Overview

This is a frontend application for handling credit card applications. It is built with Next.js, TypeScript, and ShadCN UI. The application provides a multi-step form for users to submit their credit card application, validate their details, and interact with backend services for verification.

## Features

- Multi-step form for credit card application
- Form validation using Zod and React Hook Form
- Responsive UI components using ShadCN UI
- Integration with backend API for verification
- Error and success notifications
- File upload support for bank statements
- Date selection with a calendar component

## Prerequisites

- Node.js (LTS version recommended)
- npm or yarn (package managers)
- A code editor like Visual Studio Code

## Folder Structure

The project is organized into the following folders:

```bash
/components       # Reusable UI components (e.g., form fields, alerts)
/app              # page.tsx and layout css
/lib              # Utility functions and libraries (e.g., API calls)
/types            # TypeScript types and interfaces
```

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/MastJagirani/credit-card-apply-fe.git
   cd credit-card-apply-fe
   ```

2. **Install dependencies:**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure environment variables:**

 since we have only 2 apis base url is directly configured in lib/api.ts

## Development

To start the development server, run:

```bash
npm run dev
# or
yarn dev
```

Visit `http://localhost:3000` in your browser to view the application.

## Building for Production

To build the application for production, use:

```bash
npm run build
# or
yarn build
```

Start the production server with:

```bash
npm start
# or
yarn start
```
## Configuration

- **Next.js**: Configured in `next.config.js`.
- **TypeScript**: Configured in `tsconfig.json`.
- **ESLint**: Linting rules are in `.eslintrc.js`.

 

 

 
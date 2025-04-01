# Snap Quick Commerce

A modern e-commerce app with a mobile-first design and responsive UI.

## Features

- Mobile app-like interface
- Product browsing and searching
- Shopping cart functionality
- User account management
- Dark mode support

## Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Icons**: React Icons (Feather)
- **Testing**: Jest, React Testing Library

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
cd snap-quick-commerce
npm install
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Testing

Run tests:

```bash
npm test
```

For more details on testing, see [TESTING.md](./TESTING.md).

### Building for Production

Build the application:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## Project Structure

```
src/
├── app/             # Next.js 15 app directory (pages, layouts)
├── components/      # UI components
│   ├── layout/      # Layout components (NavBar, BottomNav)
│   └── product/     # Product-related components
├── store/           # Zustand store definitions
├── types/           # TypeScript type definitions
└── utils/           # Utility functions
```

## Key Components

- **BottomNav**: Mobile app-style bottom navigation bar
- **NavBar**: App header with dynamic page title
- **ProductCard**: Card component for displaying products
- **AccountPage**: User account management interface
- **CartStore**: Zustand store for shopping cart state management

## Future Enhancements

- User authentication
- Payment processing integration
- Push notifications
- Product reviews and ratings
- Wishlist functionality

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Design inspiration from modern e-commerce apps
- Product images from Unsplash

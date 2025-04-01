# Dark Mode Implementation in Snap Quick Commerce

This document outlines the implementation of dark mode in the Snap Quick Commerce application, including key components, styling approaches, and how to maintain consistent dark mode support across the app.

## Overview

The dark mode implementation uses:

- A Zustand store for theme state management
- CSS custom properties (variables) for consistent theming
- React Context for providing theme throughout the app
- Tailwind CSS dark variant for component styling

## Key Components

### 1. Theme Store (`src/store/themeStore.ts`)

The `themeStore` is built with Zustand and handles:

- Storing the current theme preference ('light' or 'dark')
- Persisting theme preferences using local storage
- Providing methods to toggle, get, and set the theme

```typescript
// Core functionality of themeStore
const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: "light",
      setTheme: (theme) => set({ theme }),
      toggleTheme: () =>
        set({ theme: get().theme === "dark" ? "light" : "dark" }),
    }),
    {
      name: "theme-storage",
    }
  )
);
```

### 2. Theme Provider (`src/components/providers/ThemeProvider.tsx`)

A wrapper component that:

- Uses the theme store to access current theme
- Applies the theme by modifying the `dark` class on the document element
- Provides theme state to all child components

```typescript
const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { theme } = useThemeStore();

  useEffect(() => {
    const isDark = theme === "dark";
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return <>{children}</>;
};
```

### 3. Theme Switcher (`src/components/ThemeSwitcher.tsx`)

A reusable component that:

- Displays appropriate icon based on current theme (sun/moon)
- Toggles between light and dark mode
- Can be configured to show text or icon-only

```typescript
export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  className = "",
  iconOnly = false,
}) => {
  const { theme, toggleTheme } = useThemeStore();
  const isDark = theme === "dark";

  return (
    <button onClick={toggleTheme} className="...">
      {isDark ? <FiSun /> : <FiMoon />}
      {!iconOnly && <span>Light/Dark Mode</span>}
    </button>
  );
};
```

## CSS Implementation

### CSS Variables (`src/app/globals.css`)

We use CSS custom properties to define colors that change with the theme:

```css
:root {
  --foreground-rgb: 0, 0, 0;
  --background-rgb: 255, 255, 255;
  --card-bg: 255, 255, 255;
  --primary-color: 79, 70, 229; /* indigo-600 */
  --text-primary: 17, 24, 39; /* gray-900 */
  --text-secondary: 107, 114, 128; /* gray-500 */
  --border-color: 229, 231, 235; /* gray-200 */
}

/* Dark mode variables */
.dark {
  --foreground-rgb: 255, 255, 255;
  --background-rgb: 17, 24, 39; /* gray-900 */
  --card-bg: 31, 41, 55; /* gray-800 */
  --primary-color: 129, 140, 248; /* indigo-400 */
  --text-primary: 243, 244, 246; /* gray-100 */
  --text-secondary: 156, 163, 175; /* gray-400 */
  --border-color: 55, 65, 81; /* gray-700 */
}
```

### Tailwind Dark Mode

We use Tailwind's dark variant to style components based on dark mode:

```jsx
<div className="bg-white dark:bg-gray-900">
  <h1 className="text-gray-900 dark:text-white">Title</h1>
  <p className="text-gray-600 dark:text-gray-400">Content</p>
</div>
```

## App Integration

The dark mode feature is integrated in the main app layout:

```jsx
// src/app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <NavBar />
          <main>{children}</main>
          <BottomNav />
        </ThemeProvider>
      </body>
    </html>
  );
}
```

## Account Page Integration

The account page has a dedicated toggle for dark mode:

```jsx
// Dark mode toggle item
{
  icon: FiMoon,
  label: "Dark Mode",
  href: "#",
  toggle: true
}

// Toggle implementation
<button
  className="..."
  onClick={toggleTheme}
>
  <span className="..." />
</button>
```

## Best Practices for Implementing Dark Mode

1. **Use CSS Variables**: For colors that need to change with the theme.
2. **Use Tailwind Dark Mode**: Leverage the `dark:` variant for component-specific styling.
3. **Test in Both Themes**: Always check how components look in both light and dark modes.
4. **Common Dark Mode Classes**:
   - Text: `dark:text-white`, `dark:text-gray-200`, `dark:text-gray-400`
   - Backgrounds: `dark:bg-gray-900`, `dark:bg-gray-800`, `dark:bg-gray-700`
   - Borders: `dark:border-gray-700`, `dark:border-gray-800`
   - Hover states: `dark:hover:bg-gray-700`

## Pages with Dark Mode Support

The following pages have been updated with dark mode support:

1. Home Page (`src/app/page.tsx`)
2. Product Listing Page (`src/app/products/page.tsx`)
3. Product Detail Page (`src/app/products/[id]/page.tsx`)
4. Cart Page (`src/app/cart/page.tsx`)
5. Checkout Page (`src/app/checkout/page.tsx`)
6. Account Page (`src/app/account/page.tsx`)
7. Search Page (`src/app/search/page.tsx`)
8. Login Page (`src/app/login/page.tsx`)

## Components with Dark Mode Support

1. NavBar (`src/components/layout/NavBar.tsx`)
2. BottomNav (`src/components/layout/BottomNav.tsx`)
3. ProductCard (`src/components/product/ProductCard.tsx`)
4. ThemeSwitcher (`src/components/ThemeSwitcher.tsx`)

## Future Improvements

1. Add system theme detection with a `prefers-color-scheme` media query
2. Add transition animations when switching themes
3. Optimize performance by reducing repaints when switching themes
4. Create a more extensive theme system with multiple color palettes
5. Add theme-specific images and assets for a more polished look

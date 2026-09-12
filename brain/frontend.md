# Frontend

## Styling
- **Methodology**: Vanilla CSS and CSS Modules (`.module.css`). No Tailwind or CSS-in-JS.
- **Design System**: Defined in `src/styles/variables.css` using CSS custom properties (colors, spacing, typography).
- **Globals**: `src/styles/globals.css` provides reset, utility classes, and generic component styles (buttons, forms, cards).

## Component Architecture
- **Server Components by Default**: Most components and pages are RSCs to minimize JS payload.
- **Client Components**: Used only when interactivity or hooks are needed (e.g., `Header.tsx` uses `useSession` and `useState`, marked with `"use client"`).
- **Responsive Design**: Mobile-first approach using standard media queries.

## Key Components
- `Header.tsx`: Responsive nav, auth state integration, mobile drawer.
- `Footer.tsx`: SEO links, legal disclaimers.
- `JobCard.tsx`: Display job listings with status badges and deadline indicators.

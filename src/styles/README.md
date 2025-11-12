# Design System

This directory contains the design system foundation for the application, organized for easier scalability and maintainability.

## Structure

tokens.css - Base design tokens (typography, spacing, etc.)
brands/ - Brand-specific themes
light.css # Light theme variables
dark.css # Dark theme variables

## Files Overview

### `tokens.css`

Contains brand-agnostic design tokens that form the foundation of the design system from Tyupography and Spacing to Component-specific variables:

### `brands/light.css`

Light theme color palette including:

### `brands/dark.css`

Dark theme color palette with the same structure as light theme, but with colors optimized for dark mode readability and contrast.

## Usage

All theme files are imported in `src/global.css`:

```css
@import "./styles/tokens.css";
@import "./styles/brands/light.css";
@import "./styles/brands/dark.css";
```

The theme switches automatically based on the `.dark` class applied to the document root.

## Adding a New Brand

To add a new brand theme (e.g., "beauty"):

1. Create a new file: `src/styles/brands/beauty.css`
2. Define the color variables following the same structure as `light.css` or `dark.css`
3. Use a selector like `.beauty` instead of `.dark`
4. Import the file in `src/global.css`
5. Update `BrandContext.tsx` to include the new brand type
6. Update `BrandProvider.tsx` to handle the new class name

# Project File Explanations

## Root Directory Files

### Configuration Files
- `tsconfig.json`: TypeScript configuration file that defines compiler options, module resolution, and type checking rules for the project. This file is crucial for TypeScript compilation and ensures type safety across the application.
- `tailwind.config.ts`: Configuration file for Tailwind CSS, defining custom theme settings, plugins, and content paths. It includes color schemes, breakpoints, and custom utility classes used throughout the application.
- `postcss.config.mjs`: Configuration for PostCSS, a tool for transforming CSS with JavaScript plugins, used with Tailwind CSS. It processes CSS files and applies transformations defined in the configuration.
- `next.config.ts`: Next.js configuration file that customizes the framework's behavior, including routing and build settings. This file is essential for configuring Next.js features like image optimization, API routes, and environment variables.
- `next-env.d.ts`: TypeScript declaration file for Next.js, providing type definitions for Next.js specific features. It ensures proper type checking for Next.js components and APIs.
- `components.json`: Configuration file for UI components, likely used with a component library or design system. It defines component styles, variants, and default configurations.
- `.eslintrc.json`: ESLint configuration file that defines code style rules and linting settings for JavaScript/TypeScript. It enforces consistent coding standards across the project.

### Package Management
- `package.json`: Defines project dependencies, scripts, and metadata for npm package management. It includes important dependencies like Next.js, React, Tailwind CSS, and Thirdweb for blockchain integration.
- `package-lock.json`: Locks dependency versions to ensure consistent installations across environments. It prevents version conflicts and ensures reproducible builds.

### Documentation and Version Control
- `README.md`: Project documentation containing setup instructions, features, and usage guidelines. It includes information about the prediction market functionality and how to interact with it.
- `LICENSE`: Contains the project's license information and terms of use. It specifies how the code can be used, modified, and distributed.
- `.gitignore`: Specifies files and directories that Git should ignore when tracking changes. It typically includes node_modules, build outputs, and environment files.

## Source Directory (src/)

### Core Application Structure
- `app/`: Contains the main application routes and pages using Next.js App Router.
  - `layout.tsx`: The root layout component that wraps the entire application. It includes:
    - ThirdwebProvider for blockchain integration
    - ThemeProvider for dark/light mode support
    - Custom font configuration (Geist Sans and Geist Mono)
    - Global CSS imports
  - `page.tsx`: The main landing page component
  - `globals.css`: Global styles and Tailwind CSS imports
  - `client.ts`: Client-side initialization code
  - `api/`: Contains API routes for backend functionality
  - `fonts/`: Custom font files for the application

- `components/`: Reusable UI components used throughout the application.
  - Includes components for the prediction market interface
  - UI components for displaying market data
  - Form components for user interactions

- `constants/`: Contains constant values and configuration used across the application.
  - Blockchain contract addresses
  - API endpoints
  - Default configuration values

- `hooks/`: Custom React hooks for shared logic and state management.
  - Blockchain interaction hooks
  - Market data fetching hooks
  - User authentication hooks

- `lib/`: Utility functions and shared libraries.
  - `utils.ts`: Contains essential utility functions:
    - `cn()`: Combines Tailwind CSS classes with clsx and tailwind-merge
    - `toFixed()`: Formats numbers to fixed decimal places
    - `formatDate()`: Converts date strings to readable formats
  - Blockchain interaction utilities
  - Data formatting helpers

- `types/`: TypeScript type definitions and interfaces.
  - Market data types
  - Blockchain transaction types
  - API response types

## Public Directory
Contains static assets and files that are served directly:
- `window.svg`: SVG icon for window-related UI elements, used in the application interface.
- `vercel.svg`: Vercel platform logo or branding asset, used for deployment platform identification.
- `next.svg`: Next.js framework logo or branding asset, representing the framework used.
- `globe.svg`: Globe icon for internationalization or location features, used in UI elements.
- `file.svg`: File icon for document-related UI elements, used in the interface. 
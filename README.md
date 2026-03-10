# Floosly Admin Portal

A modern, feature-rich admin portal for managing clinics and users built with **Nuxt 3**, **Vue 3**, and **Tailwind CSS**. This application provides a comprehensive interface for clinic management, user administration, and data visualization.

## Overview

The Floosly Admin Portal is designed to streamline clinic and user management operations. It offers an intuitive dashboard with powerful data management capabilities including create, read, update, and delete (CRUD) operations for both clinics and users.

## Features

- 👥 **Clinic Management**: Create, view, edit, and delete clinic information
- 👨‍💼 **User Management**: Manage user accounts, roles, and permissions
- 🎨 **Modern UI**: Built with Tailwind CSS for a clean, responsive design
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- 🧩 **Reusable Components**: Pre-built components for common UI patterns
  - DataTable for displaying tabular data
  - ConfirmDialog for user confirmations
  - Toast notifications for user feedback
  - Form components for clinic and user management
- 🔄 **State Management**: Pinia stores for clinic and user state
- 📡 **API Integration**: Server-side API endpoints for data operations

## Technologies

- **Nuxt 3** - Vue 3 framework for building the application
- **TypeScript** - Type-safe development experience
- **Tailwind CSS** - Utility-first CSS framework
- **Pinia** - State management library
- **Vue 3 Components** - Modular, reusable component architecture

## Prerequisites

- Node.js 18+ and npm/pnpm/yarn/bun installed
- Basic knowledge of Vue 3 and Nuxt

## Installation

1. **Clone the repository** (if applicable):
```bash
git clone <repository-url>
cd floosly_admin_portal
```

2. **Install dependencies**:
```bash
# Using npm
npm install

# Or using pnpm
pnpm install

# Or using yarn
yarn install

# Or using bun
bun install
```

## Development

Start the development server on `http://localhost:3000`:

```bash
# Using npm
npm run dev

# Using pnpm
pnpm dev

# Using yarn
yarn dev

# Using bun
bun run dev
```

The application will automatically reload as you make changes to the code.

## Production Build

Build the application for production:

```bash
# Using npm
npm run build

# Using pnpm
pnpm build

# Using yarn
yarn build

# Using bun
bun run build
```

Preview the production build locally:

```bash
# Using npm
npm run preview

# Using pnpm
pnpm preview

# Using yarn
yarn preview

# Using bun
bun run preview
```

## Project Structure

```
floosly_admin_portal/
├── components/           # Reusable Vue components
│   ├── clinics/         # Clinic-specific components
│   ├── users/           # User-specific components
│   └── ui/              # General UI components
├── composables/         # Vue 3 composables (reusable logic)
├── layouts/             # Layout templates
├── pages/               # Page components and routing
│   └── admin/           # Admin dashboard pages
├── server/
│   └── api/             # Server-side API endpoints
├── stores/              # Pinia state management
├── types/               # TypeScript type definitions
├── public/              # Static assets
└── assets/              # Application styles and resources
```

## Key Routes

- `/` - Dashboard
- `/admin` - Admin homepage
- `/admin/clinics` - View all clinics
- `/admin/clinics/create` - Create a new clinic
- `/admin/clinics/[id]` - View clinic details
- `/admin/clinics/[id]/edit` - Edit clinic
- `/admin/users` - View all users
- `/admin/users/create` - Create a new user
- `/admin/users/[id]` - View user details
- `/admin/users/[id]/edit` - Edit user

## API Endpoints

The application includes the following server-side API endpoints:

- **Clinics**
  - `GET /api/clinics` - Get all clinics
  - `GET /api/clinics/[id]` - Get clinic by ID
  - `GET /api/clinics/[name]` - Get clinic by name
  
- **Users**
  - `GET /api/users` - Get all users
  - `GET /api/users/[id]` - Get user by ID
  - `GET /api/users/[name]` - Get user by name

## Configuration

Key configuration files:

- `nuxt.config.ts` - Nuxt configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration
- `package.json` - Project dependencies and scripts

## Contributing

Contributions are welcome! Please ensure code follows the project's style guidelines and includes appropriate tests.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Support

For issues, questions, or suggestions, please open an issue in the repository.

---

For more information on Nuxt, visit the [official Nuxt documentation](https://nuxt.com/docs/getting-started/introduction).

# Smart Park Admin

Smart Park Admin is a Vue 2 management dashboard for a smart industrial park system. It is built on top of Vue Admin Template and customized with Element UI, Vue Router, Vuex, Axios, RBAC-based dynamic routes, and business modules for park, parking, pole, property, and system management.

## Features

- Login flow with token persistence and automatic authentication headers.
- Permission-based dynamic sidebar and routes driven by the current user's permission list.
- Park management, including buildings, enterprises, contracts, file upload, and document preview/download.
- Parking management, including areas, monthly cards, payments, and billing rules.
- Pole management, including device information and warning records.
- Property fee management.
- System management, including roles, permissions, and employees.
- Axios response handling for unified errors and expired-login redirects.

## Tech Stack

- Vue 2.6
- Vue CLI 4
- Vue Router 3
- Vuex 3
- Element UI 2
- Axios
- Sass
- XLSX

## Project Structure

```text
src
├── apis              API modules grouped by business domain
├── assets            Static images and SVG assets
├── components        Reusable Vue components
├── directives        Custom directives
├── icons             SVG icon registration and source icons
├── layout            Main admin layout, navbar, app area, and sidebar
├── router            Static routes, async RBAC routes, and guards
├── store             Vuex modules
├── styles            Global styles and Element UI overrides
├── utils             Request, auth, and validation helpers
└── views             Business pages
```

## Getting Started

### Prerequisites

- Node.js 8.9 or later
- npm 3 or later

For best compatibility with Vue CLI 4 and the current dependency set, use an older LTS version of Node.js if your local environment has dependency installation issues.

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run start
```

The development server runs on:

```text
http://localhost:8081
```

The server opens the browser automatically when started.

### Build for Production

```bash
npm run build
```

The production bundle is generated in `dist/`.

### Build With Report

```bash
npm run report
```

This creates a production build with bundle analysis output.

## API Configuration

The Axios instance is configured in `src/utils/request.js`.

```js
baseURL: "https://api-hmzs.itheima.net/tj"
```

Every authenticated request automatically receives:

```text
Authorization: Bearer <token>
```

When the API returns `401`, the app clears the local token and redirects the user to the login page with the current route as the redirect target.

## Routing and Permissions

Routes are defined in `src/router/index.js`.

- `routes` contains public and always-available routes, such as login, workbench, and standalone form/detail pages.
- `asyncRoutes` contains permission-protected modules.
- After login, the app loads the user's profile and permission list, filters the async routes, stores the resulting routes in Vuex, and adds them to Vue Router dynamically.

Supported top-level permission modules include:

- `park`
- `parking`
- `pole`
- `sys`
- `property`

## Available Scripts

```bash
npm run start
```

Starts the local development server.

```bash
npm run build
```

Builds the app for production.

```bash
npm run report
```

Builds the app and generates a bundle report.

## Notes

- The project uses history mode routing. Production deployments should route unknown paths back to `index.html`.
- The backend API base URL is currently hard-coded rather than read from environment variables.
- The app title is configured as `智慧园区` in `vue.config.js`.

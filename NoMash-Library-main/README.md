# NoMash-Library

This template should help get you started developing with Vue 3 in Vite.

## eFolio 7.2: Firebase roles and logout

- `/FireLogin`: signs in using Firebase email/password and opens `/account`.
- `/account`: shows the authenticated user's email, UID, role and available areas.
- `/librarian`: only the Librarian role can open this page. Members are redirected
  to Access Denied; signed-out visitors are redirected to Firebase Login.
- `/FireLogout`: calls Firebase `signOut()`, clears the earlier Week 5 demo session,
  and displays/logs `Current Firebase user: null` after successful logout.
- `onAuthStateChanged()` restores the Firebase session after a refresh. Route
  guards wait for this initial check before deciding whether to allow access.

Role assignments are in `src/roles.js`. The existing course account UID is assigned
Librarian; other Firebase accounts default to Member. Register a second account
at `/FireRegister` and then sign in at `/FireLogin` for the Member screenshots.
Registration does not offer a staff-role selector.

These UID assignments and route guards demonstrate **client-side page access** for
this course exercise. They do not grant Firebase server permissions or protect
backend data. Before adding real staff data/actions, use server-assigned custom
claims and enforce them with Firebase Security Rules or server-side token checks:
https://firebase.google.com/docs/auth/admin/custom-claims

Screenshot evidence is saved under `screenshots/7.2/`. Capture both accounts'
dashboards, the Member access-denied page, the relevant VS Code source, and the
logout page alongside the browser console showing the actual null user.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.

## Broadcast (WhatsApp) configuration

The **Broadcast** page talks to the FastAPI broadcaster (`lead-broadcaster`) using the same Bearer token the Lead Desk (Go) API issued at login, so there is no second sign-in.

| Variable | Default | Purpose |
| :--- | :--- | :--- |
| `VITE_BROADCAST_API_BASE_URL` | `/broadcast-api` | Base URL of the broadcaster API. In production set it to the broadcaster's public URL. |
| `VITE_BROADCAST_PROXY_TARGET` | `http://127.0.0.1:8000` | Dev only: where Vite forwards `/broadcast-api/*` (prefix stripped). |

Requirements:
- The broadcaster's `JWT_SECRET` must equal the Lead Desk API's `JWT_SECRET`.
- In production, add this app's origin to the broadcaster's `CORS_ALLOWED_ORIGINS`.
- Broadcast needs a real backend login; it is unavailable with `VITE_USE_MOCK_API=true` and with demo personas.

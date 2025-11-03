# 🥢 x402 Sushi API + Web

**x402 Sushi** is a payment-gated API and web dashboard built around the [Sushi](https://sushi.com) stack.
It exposes a suite of REST endpoints (`/quote`, `/swap`, `/price`, `/token`) for aggregated DeFi operations, powered by the **x402** payment facilitator and `x402-hono` middleware.

---

## 🧱 Monorepo Structure

```
.
├── api/               # Hono API server
│   ├── public/        # favicon.ico, og.png, index.html (OG meta)
│   ├── routes/        # Individual route modules
│   ├── middleware/    # Payment middleware wrapper
│   ├── config.ts      # Env + constants
│   └── index.ts       # API entrypoint
├── web/               # Next.js app (API viewer + docs)
│   ├── src/app/
│   ├── components/
│   └── lib/
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
pnpm install
```

### 2. Run the API locally

```bash
cd api
pnpm dev
```

Default port: **[http://localhost:1337](http://localhost:1337)**

### 3. Run the web app

```bash
cd web
pnpm dev
```

Default port: **[http://localhost:3000](http://localhost:3000)**

---

## ⚙️ Environment Variables

| Variable               | Required | Description                                           |
| ---------------------- | -------- | ----------------------------------------------------- |
| `PAYOUT_ADDRESS`       | ✅        | Address to receive x402 payments                      |
| `API_URL`              | ✅        | Upstream Sushi API URL (e.g. `https://api.sushi.com`) |
| `SUSHI_API_URL`        | ✅        | (Legacy) Fallback for Sushi endpoints                 |
| `NEXT_PUBLIC_X402_URL` | ✅        | Used by the webapp for health checks                  |

---

## 🧩 Routes

### Public

| Endpoint       | Method | Description                          |
| -------------- | ------ | ------------------------------------ |
| `/health`      | GET    | Returns API health status            |
| `/favicon.ico` | GET    | Favicon                              |
| `/og.png`      | GET    | Open Graph image                     |
| `/`            | GET    | Static `index.html` with OG metadata |
| `/token/:chainId/:address` | GET / POST | Returns token metadata           |

### Paid (x402-gated)

| Endpoint                   | Method     | Description                      |
| -------------------------- | ---------- | -------------------------------- |
| `/quote/:chainId`          | GET / POST | Generates aggregated swap quote  |
| `/swap/:chainId`           | GET / POST | Generates swap transaction       |
| `/price/:chainId`          | GET / POST | Returns price map for chain      |
| `/price/:chainId/:token`   | GET / POST | Returns price for specific token |

---

## 💳 Payment Middleware

All paid routes use:

```ts
paymentMiddleware(PAYOUT_ADDRESS)
```

Each route is priced via the **x402** protocol and processed by the [`facilitators`](https://www.npmjs.com/package/facilitators) package.

---

## 🖾️ Static Assets

| File                  | Purpose                   |
| --------------------- | ------------------------- |
| `/public/favicon.ico` | Browser favicon           |
| `/public/og.png`      | Open Graph preview        |
| `/public/index.html`  | Landing page with OG meta |

---

## 🧪 Testing

To run the Jest tests for API endpoints:

```bash
cd api
pnpm test
```

The suite validates `/health`, `/quote`, `/swap`, `/price`, and `/token` for both success and structure.

---

## ☁️ Deployment

### Railway (API)

1. Push to GitHub.
2. Connect the `api` directory in [Railway](https://railway.app/).
3. Set environment variables under project settings.
4. Deploy — Railway automatically runs `pnpm --filter api build && pnpm --filter api start`.

### Vercel (Web)

1. Connect the repo to Vercel.
2. Set the root to `web/`.
3. Define environment variables in project settings.
4. Deploy — Vercel auto-detects Next.js and builds via `pnpm build`.

---

## 📜 License

MIT © Masayoshi

# SMB Fitness

Premium, conversion-focused SMB Fitness website with a scroll-driven video hero, authentic community photography, program details, client wins, FAQs, and consultation calls to action.

## Live website

https://smb-fitness-transformation.jayson-casingal001.chatgpt.site/

## Local development

Requirements: Node.js 22.13 or newer and pnpm 10.

```bash
pnpm install
pnpm run dev
```

## Production build

```bash
pnpm run build
pnpm run start
```

The production server reads Render's `PORT` environment variable automatically and binds to `0.0.0.0`.

## Deploy on Render

This repository includes a `render.yaml` Blueprint.

1. In Render, choose **New → Blueprint**.
2. Connect this GitHub repository.
3. Render will detect `render.yaml` and create the `smb-fitness` Node web service.
4. Confirm the free plan or select a paid plan, then deploy.

No application secrets are required for the current build.

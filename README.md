# Dhruvi Shah | Premium Portfolio

This is a high-end, dark-mode-first developer portfolio built with Next.js 14, Tailwind CSS, and Framer Motion.

## 🚀 Features

- **Dark Mode First**: Sleek charcoal and neon cyan/purple aesthetic.
- **Dynamic Content**: Powered by a structured JSON-like resume data file.
- **Micro-interactions**: Custom cursor, 3D tilt cards, and scroll-triggered animations.
- **Performance**: Built with Next.js 14 App Router and optimized for speed.
- **Responsive**: Mobile-first design that looks stunning on all devices.
- **Smooth UX**: Scroll progress bar, glassmorphism, and seamless transitions.

## 🛠️ Tech Stack

- **Framework**: [Next.js 14 (App Router)](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 📂 Project Structure

```text
src/
├── app/            # Next.js App Router files
├── components/     # Reusable UI components
│   ├── ui/         # Shadcn base components
│   └── ...         # Custom functional components
├── data/           # Structured resume source of truth
├── lib/            # Utility functions
└── ...
```

## 🏃 Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```

3. **Build for Production**:
   ```bash
   npm run build
   ```

## 📝 Customization

To update the content, simply edit `src/data/resume.ts`. The UI will automatically reflect the changes.

## 🚢 Deployment

Optimized for **Vercel**. The project includes a CI/CD pipeline using GitHub Actions that deploys automatically to Vercel on every push to the `main` branch.

### CI/CD Setup

To enable automated deployments, you need to add the following secrets to your GitHub repository:

1.  **`VERCEL_TOKEN`**:
    - Go to your [Vercel Account Settings > Tokens](https://vercel.com/account/tokens).
    - Create a new token and copy it.
2.  **`VERCEL_ORG_ID`** & **`VERCEL_PROJECT_ID`**:
    - Install Vercel CLI: `npm i -g vercel`.
    - Run `vercel link` in the root of this project.
    - After following the prompts, a `.vercel/project.json` file will be created.
    - Copy `orgId` (for `VERCEL_ORG_ID`) and `projectId` (for `VERCEL_PROJECT_ID`) from that file.

**GitHub Configuration**:
1. Go to your GitHub repository.
2. Click **Settings** > **Secrets and variables** > **Actions**.
3. Click **New repository secret** for each of the three secrets above.

### Environment Variables

For the contact form to work, ensure the following environment variables are set in your Vercel project:

- `SMTP_HOST`: e.g., `smtp.gmail.com`
- `SMTP_PORT`: e.g., `465`
- `SMTP_SECURE`: `true` or `false`
- `SMTP_USER`: Your email address
- `SMTP_PASS`: Your email app password
- `CONTACT_EMAIL`: (Optional) Receiver email address

---
Built with ⚡ by Antigravity

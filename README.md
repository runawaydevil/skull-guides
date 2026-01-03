# skull-guides

Static site for viewing and navigating Markdown files directly from GitHub repositories.

**Live Site:** https://runawaydevil.github.io/skull-guides/

## Description

skull-guides is a React-based static site that fetches and renders Markdown files from GitHub repositories. It provides navigation between `.md` files within the same repository without requiring local file copies. The application uses GitHub's raw content API to fetch files on-demand with intelligent caching.

## Features

- Markdown rendering with GitHub Flavored Markdown (GFM) support
- Internal navigation between `.md` files in the same repository
- Automatic conversion of relative image paths to raw GitHub URLs
- Auto-generated table of contents from document headings
- Two-layer caching system (memory + localStorage) with 24h TTL
- XSS sanitization via rehype-sanitize
- Syntax highlighting for code blocks
- Responsive layout with fixed sidebar

## Tech Stack

- React 18 + TypeScript
- Vite (build tool)
- React Router v6 (HashRouter for GitHub Pages compatibility)
- react-markdown (Markdown rendering)
- remark-gfm (GFM support)
- rehype-raw + rehype-sanitize (HTML sanitization)
- rehype-highlight (syntax highlighting)

## Installation

### Requirements

- Node.js LTS (v18 or higher)
- npm or yarn

### Setup

```bash
git clone https://github.com/runawaydevil/skull-guides.git
cd skull-guides
npm install
```

## Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Production Build

Build the application:

```bash
npm run build
```

Output will be in the `dist/` directory.

## Deployment

The project is configured for automatic deployment to GitHub Pages via GitHub Actions.

### GitHub Pages Setup

**IMPORTANT:** GitHub Pages must be enabled in the repository settings before the workflow can deploy.

1. Enable GitHub Pages manually:
   - Navigate to your repository on GitHub
   - Go to **Settings** → **Pages** (in the left sidebar)
   - Under **"Source"**, select **"GitHub Actions"**
   - Click **Save**

2. The workflow is already configured:
   - Workflow file: `.github/workflows/pages.yml`
   - Automatic deployment on push to `main` branch
   - The workflow will attempt to enable Pages automatically, but manual setup is recommended

3. Site URL:
   - After first deployment: `https://runawaydevil.github.io/skull-guides/`
   - The site will be available at this URL once the first deployment completes successfully

### Base Path Configuration

The project uses `/skull-guides/` as the base path for GitHub Pages. This is configured in `vite.config.ts`:

```typescript
base: process.env.NODE_ENV === 'production' ? '/skull-guides/' : '/'
```

To change the base path, modify `vite.config.ts` or set the `VITE_BASE` environment variable during build.

## Usage

The application loads modules from the configured repository (`runawaydevil/skull-guides`). Click on any module in the home page to view its content. Internal links to other `.md` files will navigate automatically within the application.

### Supported URL Formats

The system accepts three GitHub URL formats:

1. Blob URL:
   ```
   https://github.com/owner/repo/blob/branch/path/to/file.md
   ```

2. Raw URL:
   ```
   https://raw.githubusercontent.com/owner/repo/branch/path/to/file.md
   ```

3. Short format:
   ```
   owner/repo@branch:path/to/file.md
   ```

## Project Structure

```
skull-guides/
├── .github/
│   └── workflows/
│       └── pages.yml
├── docs/                    # Markdown modules
├── public/                  # Static assets
│   └── sg.png
├── src/
│   ├── components/          # React components
│   │   ├── Footer.tsx
│   │   ├── Layout.tsx
│   │   ├── MarkdownView.tsx
│   │   ├── Toc.tsx
│   │   └── ...
│   ├── lib/                 # Core utilities
│   │   ├── githubUrl.ts    # GitHub URL parser
│   │   ├── fetchers.ts     # Fetch with cache
│   │   ├── cache.ts        # Cache management
│   │   ├── markdownLinks.ts # Link resolution
│   │   └── modules.ts      # Module definitions
│   ├── routes/             # Route components
│   │   ├── Home.tsx
│   │   └── Viewer.tsx
│   ├── styles/             # Global styles
│   │   └── app.css
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## Configuration

### Environment Variables

- `VITE_BASE` - Base path for Vite (default: `/skull-guides/` in production, `/` in development)

### Cache System

The application uses a two-layer caching system:

- **Memory cache**: Runtime cache using Map (cleared on page reload)
- **localStorage cache**: Persistent cache with 24-hour TTL

Cache keys follow the pattern: `skull-guides:v1:<rawUrl>`

To clear cache, clear browser localStorage or use the `clearCache()` function from `cache.ts` if exposed.

## Troubleshooting

### 404 on Page Reload

Ensure HashRouter is being used (already configured). Verify base path in `vite.config.ts` matches your deployment path.

### Images Not Loading

- Verify images use relative paths within the repository
- External images must use full URLs (http/https)

### GitHub Rate Limiting

The cache system helps reduce requests. If rate limited, wait a few minutes before retrying.

### Files Not Found

Ensure the repository exists on GitHub and files are committed to the specified branch. The application fetches files from:
```
https://raw.githubusercontent.com/<owner>/<repo>/<branch>/<path>
```

## License

MIT License

## Author

runawaydevil

---

Copyright (c) 2026 runawaydevil

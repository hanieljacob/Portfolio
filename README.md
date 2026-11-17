# Haniel Thomson Portfolio

A personal portfolio for Haniel Thomson, built with React and Vite.

## Design

Apple inspired, editorial minimalism: system typography with Inter as a fallback,
an off white light theme and a true black dark theme, a restrained blue accent,
generous space, and motion that feels lively without getting in the way. The hero
uses a processed black and white portrait as a full bleed background with a glass
content panel over it.

Projects load from the GitHub API at runtime. Each featured repository is paired
with a purpose built SVG illustration in `public/projects`, with generic artwork
as a fallback.

## Commands

```bash
npm install
npm run dev      # local development
npm run build    # production build into dist
npm run preview  # preview the production build
npm run lint     # ESLint
```

## Notes

- Theme preference is stored in `localStorage` and follows the operating system
  by default.
- Content (bio, links, skills, stats) lives in the components under
  `src/components`.
- The resume PDF is served from `public/HanielThomson_Resume.pdf`.

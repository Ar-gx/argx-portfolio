# Arjun A — Portfolio

A personal portfolio built with React, TypeScript, and Vite. It features a voxel portrait, animated skill portals, three expandable project showcases, and a Llama Beacon contact scene with artwork for both themes.

## Run locally

```sh
npm ci
npm run dev
```

Vite prints the local URL. To create a production build, run `npm run build`. The output is in `dist/`.

## Standalone preview

```sh
npm run build:standalone
npm run preview
```

This generates an HTML, CSS, and JavaScript preview and serves it at `http://127.0.0.1:4174`. Run `npm test` after generating the preview to check the source and local links.

## Edit content

Update `src/data/portfolio.ts` for the bio, skills, projects, and contact links. The fonts and artwork are in `public/`.

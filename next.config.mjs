// Chemin de base : vide en local (npm run dev), "/appli-echecs" sur GitHub Pages (fixé par scripts/deploy.sh).
const basePath = process.env.BASE_PATH ?? "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",            // site statique dans out/
  basePath,
  assetPrefix: basePath || undefined,
  images: { unoptimized: true },
  eslint: { ignoreDuringBuilds: true }, // le lint (variables inutilisées…) ne doit pas bloquer la publication
  trailingSlash: true,         // /academie/ -> out/academie/index.html, nécessaire sur GitHub Pages
  env: { NEXT_PUBLIC_BASE_PATH: basePath }, // pour les chemins construits à la main (worker, manifest…)
};

export default nextConfig;

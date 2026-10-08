#!/bin/sh
# Publie l'appli sur GitHub Pages : build statique, puis envoi du dossier out/ sur la branche gh-pages.
# Au premier lancement, crée aussi le dépôt GitHub (public) et active Pages.
# Usage : npm run deploy
set -e
cd "$(dirname "$0")/.."
PATH="$HOME/.local/bin:$PATH"
compte=otistocr
nom=appli-echecs

# 1. Dépôt GitHub (créé une seule fois)
if ! git remote get-url origin >/dev/null 2>&1; then
  echo "Création du dépôt public github.com/$compte/$nom…"
  gh repo create "$compte/$nom" --public --source=. --remote=origin
fi
depot=$(git remote get-url origin)
version=$(git rev-parse --short HEAD)
git push -q -u origin main

# 2. Build statique avec le sous-chemin de GitHub Pages
rm -rf out
BASE_PATH="/$nom" npm run build

# 3. Envoi de out/ sur la branche gh-pages
tmp=$(mktemp -d)
cp -R out/. "$tmp"
touch "$tmp/.nojekyll"
cd "$tmp"
git init -q -b gh-pages
git -c user.name="$(git -C "$OLDPWD" config user.name)" -c user.email="$(git -C "$OLDPWD" config user.email)" add -A
git -c user.name="$(git -C "$OLDPWD" config user.name)" -c user.email="$(git -C "$OLDPWD" config user.email)" commit -q -m "Déploiement de $version"
git push -q -f "$depot" gh-pages
cd "$OLDPWD"
rm -rf "$tmp"

# 4. Activation de GitHub Pages sur gh-pages (une seule fois)
if ! gh api "repos/$compte/$nom/pages" >/dev/null 2>&1; then
  gh api -X POST "repos/$compte/$nom/pages" -f 'source[branch]=gh-pages' -f 'source[path]=/' >/dev/null
  echo "GitHub Pages activé (la première mise en ligne prend 1 à 2 minutes)."
fi
echo "Publié (version $version) : https://$compte.github.io/$nom/"

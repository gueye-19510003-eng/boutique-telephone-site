# Boutique Téléphone — Prototype

Prototype de boutique en ligne (catalogue, assistant de choix, estimation de reprise, espace gérant). Projet Vite + React, comme `oh-stef-site`.

## Déployer sur GitHub + Vercel

1. **Décompresser** ce dossier sur ton ordinateur (`boutique-telephone-site`).

2. **Ouvrir le Terminal** dans ce dossier, puis :
```bash
cd boutique-telephone-site
npm install
```

3. **Créer un dépôt GitHub** (sur github.com, "New repository", nom au choix, ex. `boutique-telephone-site`, ne pas cocher "Add README").

4. **Pousser le code** (remplace `TON_USERNAME` par ton nom d'utilisateur GitHub) :
```bash
git init
git add .
git commit -m "Prototype boutique téléphone"
git branch -M main
git remote add origin https://github.com/TON_USERNAME/boutique-telephone-site.git
git push -u origin main
```

5. **Déployer sur Vercel** :
   - Va sur vercel.com, connecte-toi avec GitHub
   - "Add New Project" → sélectionne le dépôt `boutique-telephone-site`
   - Laisse les réglages par défaut (Vercel détecte Vite automatiquement)
   - Clique sur "Deploy"

6. Après 1-2 minutes, Vercel te donne un lien du type `boutique-telephone-site.vercel.app` — c'est ce lien que tu envoies sur WhatsApp.

## Développement local (optionnel)
```bash
npm run dev
```
Ouvre ensuite `http://localhost:5173`.

## Note
Les données (produits, valeurs de reprise) sont en mémoire — elles se réinitialisent à chaque rafraîchissement de page. Pour les rendre permanentes, il faudrait connecter une base de données comme Supabase, comme pour Oh'Stef.

# Supabase — schéma `app`

Ce dossier contient les migrations SQL **PostgreSQL** pour Slipstream. Pas de Prisma : le client [`@supabase/supabase-js`](https://supabase.com/docs/reference/javascript/introduction) est utilisé dans l’app.

## Appliquer la migration

### Option A — Dashboard Supabase

1. Ouvre ton projet sur [supabase.com](https://supabase.com/dashboard).
2. **SQL Editor** → **New query**.
3. Copie-colle le contenu de `migrations/20260115120000_app_schema.sql`.
4. **Run**.

### Exposer le schéma `app` pour l’API (obligatoire)

Sans cette étape, le client affiche : `Invalid schema: app` (fetch / upsert).

1. Dashboard Supabase → **Project Settings** (icône engrenage) → **Data API**.
2. Dans **Exposed schemas**, ajoute **`app`** aux schémas déjà listés (souvent `public`, `graphql_public`).
3. Enregistre. Si l’erreur persiste, voir la doc [Using custom schemas](https://supabase.com/docs/guides/api/using-custom-schemas) ou [PGRST106](https://supabase.com/docs/guides/troubleshooting/pgrst106-the-schema-must-be-one-of-the-following-error-when-querying-an-exposed-schema).

### Option B — CLI Supabase

```bash
npx supabase link --project-ref <ton-project-ref>
npx supabase db push
```

## Schéma `app`

| Table | Rôle |
|-------|------|
| `app.user_preferences` | Thème, langue, notifications (1 ligne / utilisateur) |
| `app.user_followed_championships` | Championnats suivis (`championship_id` métier : ELMS, …) |
| `app.saved_articles` | Articles sauvegardés (`article_id` + métadonnées optionnelles) |

- **RLS** activé : chaque utilisateur ne voit que ses lignes (`auth.uid()`).
- **Trigger** : à la création d’un compte (`auth.users`), une ligne `user_preferences` est créée automatiquement.

## Requêtes côté app

```ts
import { supabase } from "@/lib/supabase";

const { data, error } = await supabase
  .schema("app")
  .from("user_preferences")
  .select("*")
  .single();
```

Les noms de colonnes en base utilisent des guillemets (`"user_id"`) pour rester cohérents avec le style PostgreSQL ; Supabase les mappe en `user_id` côté JS.

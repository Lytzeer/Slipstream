-- Slipstream — schéma dédié `app` (préférences utilisateur, favoris, articles sauvegardés)
-- À exécuter dans Supabase : SQL Editor → New query → coller ce fichier → Run
-- Ou : supabase db push (si CLI configurée)

CREATE SCHEMA IF NOT EXISTS app;

COMMENT ON SCHEMA app IS 'Données métier Slipstream liées au compte utilisateur';

-- ---------------------------------------------------------------------------
-- Préférences (thème, langue, notifications) — une ligne par utilisateur
-- ---------------------------------------------------------------------------
CREATE TABLE app.user_preferences (
  "user_id" UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  "theme" TEXT NOT NULL DEFAULT 'dark' CHECK ("theme" IN ('light', 'dark')),
  "locale" TEXT NOT NULL DEFAULT 'fr',
  "notifications_enabled" BOOLEAN NOT NULL DEFAULT true,
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE app.user_preferences IS 'Préférences UI et notifications par compte';

CREATE INDEX idx_user_preferences_updated ON app.user_preferences ("updated_at");

-- ---------------------------------------------------------------------------
-- Championnats suivis (id métier : ELMS, LMC, GTWORLD, …)
-- ---------------------------------------------------------------------------
CREATE TABLE app.user_followed_championships (
  "user_id" UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  "championship_id" TEXT NOT NULL,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY ("user_id", "championship_id")
);

COMMENT ON TABLE app.user_followed_championships IS 'Championnats suivis par utilisateur';

CREATE INDEX idx_followed_championships_user ON app.user_followed_championships ("user_id");

-- ---------------------------------------------------------------------------
-- Articles sauvegardés (référence article côté app + métadonnées optionnelles)
-- ---------------------------------------------------------------------------
CREATE TABLE app.saved_articles (
  "id" UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  "user_id" UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  "article_id" TEXT NOT NULL,
  "title" TEXT,
  "championship_id" TEXT,
  "saved_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE ("user_id", "article_id")
);

COMMENT ON TABLE app.saved_articles IS 'Articles mis en favori par utilisateur';

CREATE INDEX idx_saved_articles_user ON app.saved_articles ("user_id");
CREATE INDEX idx_saved_articles_saved_at ON app.saved_articles ("saved_at" DESC);

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
ALTER TABLE app.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.user_followed_championships ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.saved_articles ENABLE ROW LEVEL SECURITY;

-- user_preferences
CREATE POLICY "Users read own preferences"
  ON app.user_preferences FOR SELECT
  TO authenticated
  USING (auth.uid() = "user_id");

CREATE POLICY "Users insert own preferences"
  ON app.user_preferences FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = "user_id");

CREATE POLICY "Users update own preferences"
  ON app.user_preferences FOR UPDATE
  TO authenticated
  USING (auth.uid() = "user_id")
  WITH CHECK (auth.uid() = "user_id");

CREATE POLICY "Users delete own preferences"
  ON app.user_preferences FOR DELETE
  TO authenticated
  USING (auth.uid() = "user_id");

-- user_followed_championships
CREATE POLICY "Users read own followed championships"
  ON app.user_followed_championships FOR SELECT
  TO authenticated
  USING (auth.uid() = "user_id");

CREATE POLICY "Users insert own followed championships"
  ON app.user_followed_championships FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = "user_id");

CREATE POLICY "Users delete own followed championships"
  ON app.user_followed_championships FOR DELETE
  TO authenticated
  USING (auth.uid() = "user_id");

-- saved_articles
CREATE POLICY "Users read own saved articles"
  ON app.saved_articles FOR SELECT
  TO authenticated
  USING (auth.uid() = "user_id");

CREATE POLICY "Users insert own saved articles"
  ON app.saved_articles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = "user_id");

CREATE POLICY "Users update own saved articles"
  ON app.saved_articles FOR UPDATE
  TO authenticated
  USING (auth.uid() = "user_id")
  WITH CHECK (auth.uid() = "user_id");

CREATE POLICY "Users delete own saved articles"
  ON app.saved_articles FOR DELETE
  TO authenticated
  USING (auth.uid() = "user_id");

-- ---------------------------------------------------------------------------
-- Droits schéma (client Supabase avec JWT utilisateur = rôle authenticated)
-- ---------------------------------------------------------------------------
GRANT USAGE ON SCHEMA app TO authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA app TO authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA app TO authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA app
  GRANT ALL ON TABLES TO authenticated, service_role;

-- ---------------------------------------------------------------------------
-- Ligne de préférences à la création du compte
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION app.handle_new_user_preferences()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = app, public
AS $$
BEGIN
  INSERT INTO app.user_preferences ("user_id")
  VALUES (NEW.id)
  ON CONFLICT ("user_id") DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_app_preferences ON auth.users;
CREATE TRIGGER on_auth_user_created_app_preferences
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE PROCEDURE app.handle_new_user_preferences();

COMMENT ON FUNCTION app.handle_new_user_preferences() IS 'Crée user_preferences à l’inscription';

# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Configuration Supabase Auth

### URLs de redirection

Pour que l'authentification OAuth (Google) et la réinitialisation du mot de passe fonctionnent, ajoutez ces URLs dans le [tableau de bord Supabase](https://supabase.com/dashboard) → Authentication → URL Configuration → Redirect URLs :

- `slipstream://google-auth` (connexion Google)
- `slipstream://auth/callback` (réinitialisation mot de passe)

### Connexion Google

1. Dans Supabase : Authentication → Providers → Google → Enable
2. Dans [Google Cloud Console](https://console.cloud.google.com/) :
   - Créer des identifiants OAuth 2.0 (Web application)
   - Ajouter l'URI de redirection : `https://<PROJECT_REF>.supabase.co/auth/v1/callback`
   - Copier le Client ID et Client Secret dans Supabase

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

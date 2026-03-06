# Architecture MVC

```
lib/
├── models/              # MODEL - Couche données
│   ├── supabase.model.ts
│   └── auth/user.model.ts
│
├── controllers/         # CONTROLLER - Logique métier
│   └── auth.controller.ts
│
├── supabase.ts         # Re-export (compat)
└── auth/user.ts        # Re-export (compat)
```

## Composants réutilisables

```
components/
├── layout/             # Layouts d'écran
│   ├── screen-header.tsx
│   └── auth-form-layout.tsx
│
├── ui/                 # Composants UI
│   ├── button, input-section
│   ├── divider-with-text, auth-link
│   ├── loading-screen, stat-card
│   ├── setting-row, section-card
│   ├── saved-article-card, championship-toggle-row
│   └── ...
│
└── social-auth/        # Auth OAuth
    └── google-sign-in-button.tsx
```

## Constantes

```
constants/
├── colors.ts           # Design tokens
└── mock-data.ts       # Données mock (championships, articles)
```

## Flux

1. **Model** : Accès aux données (Supabase, formatage user)
2. **Controller** : Logique métier (authController)
3. **View** : Composants qui appellent le controller via `useAuth()` ou `authController`

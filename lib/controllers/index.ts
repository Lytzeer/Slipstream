/**
 * CONTROLLERS - Couche logique métier
 *
 * Ré-exports des contrôleurs pour imports simplifiés.
 */

export {
  authController,
  getRedirectUrl,
  getAuthCallbackUrl,
  extractTokensFromUrl,
} from "./auth.controller";

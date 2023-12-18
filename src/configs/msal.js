import * as msal from '@azure/msal-node';
import { MICROSOFT_AUTHORITY_URL, MICROSOFT_CLIENT_ID, MICROSOFT_CLIENT_SECRET } from './app.js';

// Configuración de MSAL
export const cca = new msal.ConfidentialClientApplication({
  auth: {
    clientId: MICROSOFT_CLIENT_ID,
    authority: MICROSOFT_AUTHORITY_URL,
    clientSecret: MICROSOFT_CLIENT_SECRET,
  },
});
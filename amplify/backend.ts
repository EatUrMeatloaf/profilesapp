import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';  // Import from auth/resource.ts, not post-confirmation
import { data } from './data/resource';

export const backend = defineBackend({
  auth,
  data,
});
import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { defineFunction } from '@aws-amplify/backend';

const backend = defineBackend({
  auth,
  data,
});

// Export the backend
export default backend;
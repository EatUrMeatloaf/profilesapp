import { defineFunction } from '@aws-amplify/backend';

export const postConfirmation = defineFunction({
  name: 'post-confirmation',
  environment: {
    // We'll get this value during deployment
    AMPLIFY_DATA_GRAPHQL_ENDPOINT: '${{data.GraphQLEndpoint}}',
  },
});
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://graphqlzero.almansi.me/api ', // Replace with your GraphQL API URL
  cache: new InMemoryCache(),
});

export { client, ApolloProvider };

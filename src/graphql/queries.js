import { gql } from "@apollo/client";

// User Queries //
export const GET_USERS = gql`
  query GetUsers {
    users {
      data {
        id
        name
        email
      }
    }
  }
`;
export const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      name
      email
      phone
      username
      website
    }
  }
`;

// Album Queries //
export const GET_ALBUMS = gql`
  query GetAlbums {
    albums {
      data {
        id
        title
      }
    }
  }
`;
export const GET_ALBUM = gql`
  query GetAlbum($id: ID!) {
    album(id: $id) {
      id
      title
      user {
        id
        name
      }
    }
  }
`;

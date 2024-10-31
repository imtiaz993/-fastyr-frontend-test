import { gql } from "@apollo/client";

// User Mutations //
export const ADD_USER = gql`
  mutation AddUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      name
      email
      phone
      username
      website
    }
  }
`;
export const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
      id
      name
      email
      phone
      username
      website
    }
  }
`;
export const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id)
  }
`;

// Album Mutations //
export const ADD_ALBUM = gql`
  mutation AddAlbum($input: CreateAlbumInput!) {
    createAlbum(input: $input) {
      id
      title
      user {
        id
      }
    }
  }
`;
export const UPDATE_ALBUM = gql`
  mutation UpdateAlbum($id: ID!, $input: UpdateAlbumInput!) {
    updateAlbum(id: $id, input: $input) {
      id
      title
    }
  }
`;
export const DELETE_ALBUM = gql`
  mutation DeleteAlbum($id: ID!) {
    deleteAlbum(id: $id)
  }
`;

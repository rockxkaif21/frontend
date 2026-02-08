import { gql } from "@apollo/client";

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      email
      role
      name
    }
  }
`;

export const GET_PRODUCTS_QUERY = gql`
  query GetProducts {
    products {
      id
      name
      category
      status
      quantity
      price
      updatedAt
    }
  }
`;

export const CREATE_PRODUCT_MUTATION = gql`
  mutation CreateProduct($name: String!, $category: String!, $quantity: Int!, $price: Int!) {
    createProduct(name: $name, category: $category, quantity: $quantity, price: $price) {
      id
      name
      category
      status
      quantity
      price
      updatedAt
    }
  }
`;

export const UPDATE_PRODUCT_MUTATION = gql`
  mutation UpdateProduct($id: String!, $name: String!, $category: String!, $quantity: Int!, $price: Int!) {
    updateProduct(id: $id, name: $name, category: $category, quantity: $quantity, price: $price) {
      id
      name
      category
      status
      quantity
      price
      updatedAt
    }
  }
`;

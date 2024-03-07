import { gql } from "graphql-request";

export const TOKEN_TRANSFERS_QUERY = gql`
  query tokenTransfers(
    $skip: Int
    $first: Int
    $orderBy: Transfer_orderBy
    $orderDirection: OrderDirection
    $where: Transfer_filter
  ) {
    transfers(
      skip: $skip
      first: $first
      orderBy: $orderBy
      orderDirection: $orderDirection
      where: $where
    ) {
      id
      txHash
      value
      timestamp
      from {
        address
      }
      to {
        address
      }
      token {
        address
        name
        symbol
        decimals
        totalSupply
      }
    }
  }
`;

export const TOKENS_QUERY = gql`
  query tokens(
    $skip: Int
    $first: Int
    $orderBy: Token_orderBy
    $orderDirection: OrderDirection
    $where: Token_filter
  ) {
    tokens(
      skip: $skip
      first: $first
      orderBy: $orderBy
      orderDirection: $orderDirection
      where: $where
    ) {
      id
      address
      name
      symbol
      decimals
      totalSupply
    }
  }
`;

export const TOKEN_DETAILS_QUERY = gql`
  query tokenDetails($id: String!) {
    token(id: $id) {
      id
      address
      name
      symbol
      decimals
      totalSupply
    }
  }
`;
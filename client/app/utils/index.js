import { GraphQLClient } from "graphql-request";
import { subgraphUrl } from "./config";

export const graphqlClient = new GraphQLClient(subgraphUrl, { headers: {} });
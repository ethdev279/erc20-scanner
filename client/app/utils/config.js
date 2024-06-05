export const subgraphUrl =
  process.env.NEXT_PUBLIC_SUBGRAPH_URL ||
  "https://api.studio.thegraph.com/query/18583/erc20-tracker-uhack/v0.0.6";

export const explorerUrl =
  process.env.NEXT_PUBLIC_EXPLORER_URL || "https://etherscan.io";

export const chainName = process.env.NEXT_PUBLIC_CHAIN_NAME || "Mainnet";
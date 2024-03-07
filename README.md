# ERC20 Token Tracker

This project aims to provide a comprehensive ERC20 token transfer tracking system by building a custom subgraph that indexes all ERC20 token transfers on the Ethereum Mainnet. It offers a Next.js application that utilizes this subgraph to enable users to track token transfers, search transfers by address, and view all available tokens. It has dedicated pages for all transfers, all tokens, each token transfers, and addresses.

### How it's built:

Utilizing The Graph, it's typically feasible to index one or a few contracts (multiple data sources in definition) at a time on a single chain. However, to effectively track all ERC20 tokens, a workaround is required.

In this implementation, I've omitted the address in the data sources configuration. By doing so, The Graph indexes all contracts that match the transfer event signature. This approach allows us to capture token transfers across a wide array of ERC20 contracts without explicitly specifying each contract address.

Once the subgraph indexes the transfer events, we map the token details, transfers and accounts based on the event data. This mapping process involves extracting relevant information such as token symbols, balances, transaction details, and participant addresses. By structuring the mapping logic effectively, we ensure that the tracked data is organized and accessible for querying within the application.

This method enables a comprehensive tracking system that dynamically captures ERC20 token transfers across the Ethereum Mainnet without the need for manual configuration of contract addresses. Users can seamlessly access and analyze transfer data for a wide range of ERC20 tokens, enhancing transparency and visibility within the Ethereum ecosystem.

## Deployed Resources:

- [ERC20 Tracker Subgraph](https://thegraph.com/studio/subgraph/erc20-tracker-uhack/)
- [ERC20 Tracker App](https://erc20-scanner.vercel.app/)

## Getting Started

### Subgraph Deployment

1. Go to [Subgraph Studio](https://thegraph.com/studio), connect wallet and create a new subgraph.

2. Copy subgraph slug and deploy key.

3. Update the subgraph slug in `package.json` scripts.

4. Run the following commands to deploy the subgraph:

```bash

npm run codegen

graph auth --studio <DEPLOY KEY>

graph deploy --node https://api.studio.thegraph.com/deploy/ <SUBGRAPH_SLUG>

```

### Client Setup

> Note: Make sure to update the subgraph endpoint and chain config in `client/app/utils/config.js`

```bash
cd client

npm install

npm run dev

```

Open http://localhost:3000 with your browser to see the result.

### Screenshots

![sc1](https://github.com/ethdev279/erc20-scanner-uhack/assets/29351207/976fc3a2-6bf7-40f1-9000-c566716655fc)

![sc2](https://github.com/ethdev279/erc20-scanner-uhack/assets/29351207/4264eb23-638a-4d98-bc78-97598d273439)

![sc3](https://github.com/ethdev279/erc20-scanner-uhack/assets/29351207/b534a920-0200-45bd-b5d8-ef03c3a052af)

![sc4](https://github.com/ethdev279/erc20-scanner-uhack/assets/29351207/a028a8f1-32ec-4136-9852-fa85312c6e3b)

## Built With

- [The Graph](https://thegraph.com/)
- [Next.js](https://nextjs.org/)
- [Ant Design](https://ant.design/)
- [Ethers.js](https://docs.ethers.io/v5/)

## References

- [The Graph Documentation](https://thegraph.com/docs/en/)
- [Ethers.js Documentation](https://docs.ethers.io/v5/)
- [Next.js Documentation](https://nextjs.org/docs/getting-started)

## Safety

This is experimental software and subject to change over time.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

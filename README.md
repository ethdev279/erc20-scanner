# ERC20 Scanner

This project aims to provide a comprehensive ERC20 token transfer tracking system by building a custom subgraph that indexes all ERC20 token transfers on the Ethereum Mainnet. While many subgraphs typically track one token or a limited array of tokens, this project's custom subgraph sets itself apart by comprehensively tracking all ERC20 token transfers on the Ethereum Mainnet. Its inherent design allows it to seamlessly track all token transfers on a given network, offering unparalleled flexibility and adaptability. It offers a Next.js application that utilizes this subgraph to enable users to track token transfers, search transfers by address, and view all available tokens. It has dedicated pages for all transfers, all tokens, each token transfers, and addresses.

### How it's built:

Utilizing The Graph, it's typically feasible to index one or a few contracts (multiple data sources in definition) at a time on a single chain. However, to effectively track all ERC20 tokens, a workaround is required.

In this implementation, I've omitted the address in the data sources configuration. By doing so, The Graph indexes all contracts that match the transfer event signature. This approach allows us to capture token transfers across a wide array of ERC20 contracts without explicitly specifying each contract address.

Once the subgraph indexes the transfer events, we map the token details, transfers and accounts based on the event data. This mapping process involves extracting relevant information such as token symbols, balances, transaction details, and participant addresses. By structuring the mapping logic effectively, we ensure that the tracked data is organized and accessible for querying within the application.

This method enables a comprehensive tracking system that dynamically captures ERC20 token transfers across the Ethereum Mainnet without the need for manual configuration of contract addresses. Users can seamlessly access and analyze transfer data for a wide range of ERC20 tokens, enhancing transparency and visibility within the Ethereum ecosystem.

## Deployed Resources:

- [ERC20 Scanner Subgraph](https://thegraph.com/studio/subgraph/erc20-tracker-uhack/)
- [ERC20 Scanner App](https://erc20-scanner-uhack.vercel.app/)
- [ERC20 Scanner Replit](https://replit.com/@ethdev279/erc20-scanner-uhack)

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

![uhack-sc1](https://github.com/ethdev279/erc20-scanner-uhack/assets/45661693/028fbaf3-0c80-4ea4-891a-37513a208c0c)

![uhack-sc2](https://github.com/ethdev279/erc20-scanner-uhack/assets/45661693/b17810d1-60ff-40c2-93c9-4ea30467cc55)

![uhack-sc3](https://github.com/ethdev279/erc20-scanner-uhack/assets/45661693/e88c89e6-4a5b-4c6d-950a-597fe41a74b8)

![uhack-sc4](https://github.com/ethdev279/erc20-scanner-uhack/assets/45661693/2a2b411b-7543-45f0-9e92-26638736001b)

![uhack-sc5](https://github.com/ethdev279/erc20-scanner-uhack/assets/45661693/904aee02-f7da-4974-b0ba-7d104d8b1d98)

## Built With

- [The Graph](https://thegraph.com/)
- [Next.js](https://nextjs.org/)
- [Ant Design](https://ant.design/)
- [Ethers.js](https://docs.ethers.io/v5/)
- [Replit](https://replit.com/)

## References

- [The Graph Documentation](https://thegraph.com/docs/en/)
- [Ethers.js Documentation](https://docs.ethers.io/v5/)
- [Next.js Documentation](https://nextjs.org/docs/getting-started)
- [Replit Documentation](https://docs.replit.com/)

## Safety

This is experimental software and subject to change over time.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

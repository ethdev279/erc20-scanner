# ERC20 Token Subgraph

This subgraph is for any ERC20 token standard. This subgraph maps user balances, token transfers.

### Steps:

1. Update `subgraph.yaml` file with the relevant ERC20 token contract address, start block, and network where the ERC20 token is deployed.

2. Create new subgraph in subgraph studio service and copy subgraph slug. Update `package.json` `deploy` script with the subgraph slug.

3. Generate types

4. Authorize graph cli for deployment using token

5. Build subgraph

6. Deploy subgraph

### Subgraph Deployment to Subgraph Studio

```bash

npm run codegen

graph auth --studio <DEPLOY KEY>

graph deploy --node https://api.studio.thegraph.com/deploy/ <SUBGRAPH_SLUG>

```

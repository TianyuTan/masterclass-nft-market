# Masterclass NFT Marketplace

## Technology Stack & Tools

- Solidity (Writing Smart Contract)
- Javascript (React & Testing)
- [Ethers](https://docs.ethers.io/v5/) (Blockchain Interaction)
- [Hardhat](https://hardhat.org/) (Development Framework)
- [IPFS](https://ipfs.io/) (Metadata storage)
- [React routers](https://v5.reactrouter.com/) (Navigational components)

## Requirements For Initial Setup
- Install [NodeJS](https://nodejs.org/en/)
- Install [Hardhat](https://hardhat.org/)

## Setting Up
### 1. Clone/Download the Repository

### 2. Install Dependencies:
```
$ cd ${your_project_path}
$ npm install
```
### 3. Boot up local development blockchain
```
$ cd ${your_project_path}
$ npx hardhat node
```
This creates a local blockchain on your machine. You can interact with it using Metamask.

### 4. Connect development blockchain accounts to Metamask
- Install Metamask and create a new account.
- Connect your metamask to hardhat blockchain, network 127.0.0.1:8545.
- If you have not added hardhat to the list of networks on your metamask, open up a browser, click the fox icon, then click the top center dropdown button that lists all the available networks then click add networks. A form should pop up. For the "Network Name" field enter "Hardhat". For the "New RPC URL" field enter "http://127.0.0.1:8545". For the chain ID enter "31337". Then click save.  


### 5. Deploy Smart Contracts
`npx hardhat run src/backend/scripts/deploy.cjs --network localhost`

If you want to deploy the contracts to different networks, specify the network name in the command above and configurate hardhat.config.cjs 
For example, to deploy to Sepolia testnet, run:
```
module.exports = {
    networks: {
    hardhat: {},
    sepolia: {
    url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
accounts: [`{your-private-key-here}}`]
}
},
```
`npx hardhat run src/backend/scripts/deploy.cjs --network Sepolia`

### 6. Launch Frontend
`$ npm run start`

License
----
MIT


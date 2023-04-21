async function main() {
    const [owner] = await ethers.getSigners();

    //Replace this address with the address of your NFT contract
    const Contract = await ethers.getContractFactory("NFT");
    const contract = Contract.attach("0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512");

    // Replace this value with the total supply of your NFTs
    const totalSupply = await contract.tokenCount();

    for (let i = 1; i <= totalSupply; i++) {
        const tokenURI = await contract.tokenURI(i);
        const ownerOfToken = await contract.ownerOf(i);

        console.log(`Token ID: ${i}`);
        console.log(`Token URI: ${tokenURI}`);
        console.log(`Owner: ${ownerOfToken}`);
        console.log("--------------");
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

import { useState } from 'react'
import { ethers } from "ethers"
import { Row, Form, Button } from 'react-bootstrap'
const ipfsClient = require('ipfs-http-client');
const projectId = '2OVBNbND9eYOEqHPPUFyOhADyX5';
const projectSecret = 'b632b82f07835f22d8d24c9ff4335183';
const credentials = projectId + ':' + projectSecret;
const encoder = new TextEncoder();
const data = encoder.encode(credentials);
const auth = 'Basic ' + btoa(String.fromCharCode.apply(null, data));
//IPFS client instance to connect to Infura IPFS node
const client = ipfsClient.create({
  host: 'masterclass.ipfs.infura-ipfs.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: auth,
  },
});
const Create = ({ marketplace: marketplaceInstance, nft: nftInstance }) => {
  const [tmp_image, setTmp_image] = useState('')
  const [price, setPrice] = useState(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('These unique NFTs capture digital artifacts are from a custom-built virtual environment in Unreal Engine.  Each NFT contains an image that showcases the intricate details and unique aesthetics of the virtual world.  As a result, each NFT is a one-of-a-kind artwork that represents the creativity and ingenuity of the virtual world\'s creator.')
  //Upload image to IPFS
  const uploadToIPFS = async (event) => {
    // prevent page refresh
    event.preventDefault()
    // get file from event
    const file = event.target.files[0]
    if (typeof file !== 'undefined') {
      try {
        const result = await client.add(file)
        setTmp_image(`https://masterclass.ipfs.infura-ipfs.io/ipfs/${result.path}`)
        console.log("image:", tmp_image.toString())
      } catch (error){
        console.log("Failed to upload the image to IPFS:", error)
      }
    }
  }

  const createNFT = async () => {
    if (!tmp_image || !price || !name || !description) return
    try{
      let image = tmp_image.replace("https://masterclass.ipfs.infura-ipfs.io", "https://masterclass.infura-ipfs.io");
      //upload metadata to IPFS
      const result = await client.add(JSON.stringify({image, price, name, description}))
      await mintThenList(result)
      console.log("metadata cid: ", result)
    } catch(error) {
      console.log("ipfs uri upload error: ", error)
    }
  }
  const mintThenList = async (result) => {
    // get metadata cid from ipfs
    const uri = `https://masterclass.infura-ipfs.io/ipfs/${result.path}`
    // mint nft
    await(await nftInstance.mint(uri)).wait()
    // get tokenId of new nft 
    const id = await nftInstance.tokenCount()
    console.log("tokenCount:", id.toString())
    // approve marketplace to spend nft
    await(await nftInstance.setApprovalForAll(marketplaceInstance.address, true)).wait()
    // add nft to marketplace
    const listingPrice = ethers.utils.parseEther(price.toString())
    console.log("listingPrice:", listingPrice.toString())
    await(await marketplaceInstance.makeItem(nftInstance.address, id, listingPrice)).wait()
    console.log("Mint and list successful! ", id.toString())
  }
  return (
    <div className="container-fluid mt-5">
      <div className="row">
        <main role="main" className="col-lg-12 mx-auto" style={{ maxWidth: '1000px' }}>
          <div className="content mx-auto">
            <Row className="g-4">
              <Form.Control
                type="file"
                required
                name="file"
                onChange={uploadToIPFS}
              />
              <Form.Control onChange={(e) => setName(e.target.value)} size="lg" required type="text" placeholder="Name" />
              {/*<Form.Control onChange={(e) => setDescription(e.target.value)} size="lg" required as="textarea" placeholder="Description" />*/}
              <Form.Control
                  size="lg"
                  required
                  as="textarea"
                  value={description}
                  readOnly
                  style={{ color: 'grey', height: '200px', width: '100%' }}

              />
              <Form.Control onChange={(e) => setPrice(e.target.value)} size="lg" required type="number" placeholder="Price in ETH" />
              <div className="d-grid px-0">
                <Button onClick={createNFT} variant="primary" size="lg">
                  Create & List NFT!
                </Button>
              </div>
            </Row>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Create
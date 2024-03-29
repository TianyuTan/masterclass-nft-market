import {useState, useEffect} from 'react'
import {ethers} from "ethers"
import {Row, Col, Card} from 'react-bootstrap'

function renderSoldItems(items) {
    return (
        <>
            <h2>Sold</h2>
            <Row xs={1} md={2} lg={4} className="g-4 py-3">
                {items.map((item, idx) => (
                    <Col key={idx} className="overflow-hidden">
                        <Card>
                            <Card.Img variant="top" src={item.image}/>
                            <Card.Footer>
                                For {ethers.utils.formatEther(item.totalPrice)} ETH -
                                Recieved {ethers.utils.formatEther(item.price)} ETH
                            </Card.Footer>
                        </Card>
                    </Col>
                ))}
            </Row>
        </>
    )
}

export default function MyListedItems({marketplace, nft, account}) {
    const [loading, setLoading] = useState(true)
    const [listedItems, setListedItems] = useState([])
    const [soldItems, setSoldItems] = useState([])
    const loadListedItems = async () => {
        // Load all sold items that the user listed
        const itemCount = await marketplace.itemCount()
        console.log("Marketplace itemCount:", itemCount.toString())
        let listedItems = []
        let soldItems = []
        for (let indx = 1; indx <= itemCount; indx++) {
            const i = await marketplace.items(indx)
            if (i.seller.toLowerCase() === account) {
                // get uri url from nft contract
                const uri = await nft.tokenURI(i.tokenId)
                console.log(uri)
                // use uri to fetch the nft metadata stored on ipfs
                const response = await fetch(uri)
                // const response = await fetch('https://masterclass.infura-ipfs.io/ipfs/QmNVFhdJj1MegFX5qfyPDnF4Jf1dR9DcsPcmyqwpBN6qVu')
                const metadata = await response.json()
                // get total price of item (item price + fee)
                const totalPrice = await marketplace.getTotalPrice(i.itemId)
                // define listed item object
                let item = {
                    totalPrice,
                    price: i.price,
                    itemId: i.itemId,
                    name: metadata.name,
                    description: metadata.description,
                    image: metadata.image
                }
                console.log("item image:", item.image, "metadata image:", metadata.image)
                listedItems.push(item)
                // Add listed item to sold items array if sold
                if (i.sold) soldItems.push(item)
            }
        }
        setLoading(false)
        setListedItems(listedItems)
        setSoldItems(soldItems)
    }
    useEffect(() => {
        loadListedItems()
    }, [])
    if (loading) return (
        <main style={{padding: "1rem 0"}}>
            <h2>Loading...</h2>
        </main>
    )
    return (
        <div className="flex justify-center">
            {listedItems.length > 0 ?
                <div className="px-5 py-3 container">
                    <h2>Listed items</h2>
                    <Row xs={1} md={2} lg={4} className="g-4 py-3">
                        {listedItems.map((item, idx) => (
                            <Col key={idx} className="overflow-hidden">
                                <Card>
                                    <Card.Img variant="top" src={item.image}/>
                                    <Card.Body color="secondary">
                                        <Card.Title>{"Name:" + item.name}</Card.Title>
                                        <Card.Text>
                                            <strong>Description:</strong>{item.description}
                                        </Card.Text>
                                        <Card.Text>
                                            <strong>Token id:</strong>{item.itemId.toString()}
                                        </Card.Text>
                                    </Card.Body>
                                    <Card.Footer>{ethers.utils.formatEther(item.totalPrice)} ETH</Card.Footer>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                    {soldItems.length > 0 && renderSoldItems(soldItems)}
                </div>
                : (
                    <main style={{padding: "1rem 0"}}>
                        <h2>No listed assets</h2>
                    </main>
                )}
        </div>
    );
}
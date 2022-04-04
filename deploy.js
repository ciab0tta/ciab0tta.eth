import fs from 'fs'
import { CarIndexedReader } from '@ipld/car'
import { NFTStorage } from 'nft.storage'

const { NFT_STORAGE_KEY: token } = process.env;

async function main() {
  const storage = new NFTStorage({ token })

  // Create the car reader
  const carReader = await CarIndexedReader.fromFile(
    `${process.cwd()}/output.car`
  )
  const expectedCid = carReader._roots[0].toString()

  // send the CAR to nft.storage, the returned CID will match the one we created above.
  const cid = await storage.storeCar(carReader)

  // verify the service stored the CID we expected
  const cidsMatch = expectedCid === cid
  console.log({ cid, expectedCid, cidsMatch })

  // check that the CID is pinned
  const status = await storage.status(cid)
  console.log(status)

  // Delete car file created
  await fs.promises.rm(`${process.cwd()}/output.car`)
}
main().catch(console.error)

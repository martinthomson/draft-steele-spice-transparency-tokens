import { ScalableBloomFilter, Hashing } from 'bloom-filters'

import cose from '@transmute/cose'

import { digest } from './digest'

import { JWS } from './jose'

const defaultSeed = -1261461178

type AllowedHashFucntions = 'sha256'

type FactoryOptions = {
  hashFunction ?: AllowedHashFucntions, 
  filterSeed ?: number
}

const smallerFilter = (data: any) => {
  data._filters = data._filters.map((pbf:any, index: number)=>{
    pbf._filter = pbf._filter.map((fb:any)=>{
      return fb.content
    })
    pbf._filter = filterEncodedArrayToBuffer(pbf._filter)
    delete pbf.type
    delete pbf._loadFactor
    delete pbf._seed
    return pbf 
  })
  return data
}

const largerFilter = (data:any)=> {
  data._filters = data._filters.map((pbf:any, index: number)=>{
    const size = 8 * 2 ** (index+1)
    pbf._filter = bufferToFilterEncodedArray(pbf._filter, size)
    pbf._filter = pbf._filter.map((fbc:string)=>{
      return { size , content: fbc }
    })
    pbf.type = 'PartitionedBloomFilter'
    pbf._loadFactor = data._ratio;
    pbf._seed = data._seed;
    return pbf 
  })
  return data
}

const filterEncodedArrayToBuffer = (filter: string[])=> {
  const decodedFilterBlocks = filter.map((fb: string)=>{
    return Buffer.from(fb, 'base64')
  })
  const oneFilterBlock = Buffer.concat(decodedFilterBlocks)
  return oneFilterBlock.toString('base64')
}
const bufferToFilterEncodedArray = (filter: string, size: number)=> {
  const oneFilterBlockDecoded = Buffer.from(filter, 'base64')
  const _filter = [] as string[]
  let blockLengthOffeset = size/8
  for (let index = 0; index < oneFilterBlockDecoded.length; index+= blockLengthOffeset) {
    const block = oneFilterBlockDecoded.slice(index, index +blockLengthOffeset)
    _filter.push(block.toString('base64'))
  }
  return _filter
}

const verifyJose = async ({entry, receipt, publicKeyJwk}: any) =>{
  const verifier = await JWS.verifier(publicKeyJwk);
  const verified = await verifier.verify(receipt);
  const payload = JSON.parse(new TextDecoder().decode(verified.payload))
  const log = Log.from(payload)
  return log.has(entry)
}

const verifyCose = async ({entry, receipt, publicKeyJwk}: any) =>{
  const verifier = await cose.lib.verifier({publicKeyJwk});
  const verified = await verifier.verify(receipt);
  const payload = filterDataFromCbor(verified)
  const log = Log.from(payload)
  return log.has(entry)
}

const signJose = async (secretKeyJwk: any, filterData: any) => {
  const signer = await JWS.signer(secretKeyJwk);
  const signedReceipt = await signer.sign({ 
    protectedHeader: {
      alg: secretKeyJwk.alg
    }, 
    payload: new TextEncoder().encode(JSON.stringify(filterData)) 
  })
  return signedReceipt
}

const filterDataToCbor = ( filterData: any ) => {
  const filter_1_json = filterData._filters[0]
  const filter_1 = cose.cbor.encode([
    filter_1_json._size,
    filter_1_json._nbHashes,
    filter_1_json._m,
    filter_1_json._capacity,
    Buffer.from(filter_1_json._filter, 'base64')
  ])
  const filter_0_json = filterData
  const filter_0 = cose.cbor.encode([
    filter_0_json._initial_size,
    filter_0_json._error_rate,
    filter_0_json._ratio,
    filter_0_json._seed,
    [ filter_1 ]
  ])
  return filter_0
}

const filterDataFromCbor = ( filterData: any ) => {
  const decodedFilter0 = cose.cbor.decode(filterData)
  const [_initial_size, _error_rate, _ratio, _seed ] = decodedFilter0
  const decodedFilter1 = cose.cbor.decode(decodedFilter0[4][0])
  const [_size, _nbHashes, _m, _capacity, _filter_1 ] = decodedFilter1
  const filter_0_json = {
    type: 'ScalableBloomFilter',
    _initial_size,
    _error_rate,
    _ratio,
    _seed,
    _filters: [
      {
        _size,
        _nbHashes,
        _m,
        _capacity,
        _filter: _filter_1.toString('base64'),
        
      }
    ],
  }  
  return filter_0_json
}

const signCose = async (secretKeyJwk: any, filterData: any) => {

  const signer = await cose.lib.signer({ secretKeyJwk})
  const protectedHeader = new Map();
  protectedHeader.set(1, -35)
  const unprotectedHeader = new Map();
  const signedReceipt = await signer.sign({ 
    protectedHeader, 
    unprotectedHeader,
    payload: filterDataToCbor(filterData)
  })
  return signedReceipt
}

export class Log {
  public filter: ScalableBloomFilter
  static receipt = { 
    jose: { 
      verify: verifyJose 
    },
    cose: {
      verify: verifyCose
    }
  }
  static create = ({ hashFunction, filterSeed}: FactoryOptions = {}) => {
    return new Log(hashFunction || 'sha256', filterSeed || defaultSeed )
  }
  static from = (filter: any)=> {
    const log = new Log('sha256', defaultSeed)
    log.filter = ScalableBloomFilter.fromJSON(largerFilter(filter))
    class CustomHashing extends Hashing {
      serialize(element: Buffer, seed: number) {
        const message = Buffer.concat([Buffer.from(seed.toString(16), 'hex'), element])
        const hash = digest['sha256'](message)
        return Number(BigInt.asUintN(42, BigInt(`0x${hash}`)))
      }
    }
    filter._hashing = new CustomHashing()
    return log
  }
  constructor(hashFunction: AllowedHashFucntions ,  filterSeed: number){
    class CustomHashing extends Hashing {
      serialize(element: Buffer, seed: number) {
        const message = Buffer.concat([Buffer.from(seed.toString(16), 'hex'), element])
        const hash = digest[hashFunction](message)
        return Number(BigInt.asUintN(42, BigInt(`0x${hash}`)))
      }
    }
    const filter = new ScalableBloomFilter()
    filter.seed = filterSeed
    filter._hashing = new CustomHashing()
    this.filter = filter
  }
  add(entry: ArrayBuffer){
    return this.filter.add(entry)
  }
  has(entry: ArrayBuffer){
    return this.filter.has(entry)
  }
  rate(){
    return this.filter.rate()
  }
  toJSON(){
    const data = this.filter.saveAsJSON()
    return smallerFilter(data)
  }

  async receipt({greenHost, secretKeyJwk}: any){
    const filterData = this.toJSON()
    if (!greenHost){
      return signJose(secretKeyJwk, filterData)
    }
    return signCose(secretKeyJwk, filterData) 
  }
}
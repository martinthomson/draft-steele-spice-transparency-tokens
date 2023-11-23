import { XorFilter } from 'bloom-filters'

import { JWS } from './jose'

import cose from '@transmute/cose'

const smallerFilter = (data: any) => {
  const decodedFilterBlocks = data._filter.map((fb: string)=>{
    return Buffer.from(fb, 'base64')
  })
  const oneFilterBlock = Buffer.concat(decodedFilterBlocks)
  const oneFilterBlockEncoded = oneFilterBlock.toString('base64')
  data._filter = oneFilterBlockEncoded
  return data
}

const largerFilter = (data: any) => {
  const oneFilterBlockDecoded = Buffer.from(data._filter, 'base64')
  const _filter = [] as string[]
  let blockLengthOffeset = data._bits/8
  for (let index = 0; index < oneFilterBlockDecoded.length; index+= blockLengthOffeset) {
    const block = oneFilterBlockDecoded.slice(index, index +blockLengthOffeset)
    _filter.push(block.toString('base64'))
  }
  data._filter = _filter
  if (data._filter.length !== data._blockLength * 3){
    throw new Error('error expanding filter')
  }
  return data
}

const verifyJose = async ({entry, receipt, publicKeyJwk}: any) =>{
  const verifier = await JWS.verifier(publicKeyJwk);
  const verified = await verifier.verify(receipt);
  const payload = JSON.parse(new TextDecoder().decode(verified.payload))
  const status = Status.from(payload)
  return status.has(entry)
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
  const { _seed, _blockLength, _bits,  _size, _filter } = filterData;
  return cose.cbor.encode([
    _seed,
    _blockLength, 
    _bits,  
    _size, 
    Buffer.from(_filter, 'base64')
  ])  
}

const filterDataFromCbor = ( filterData: any ) => {
  const decodedFilter = cose.cbor.decode(filterData)
  const [ _seed, _blockLength, _bits,  _size, _filter ] = decodedFilter;
  return {
    type: 'XorFilter',
    _seed, 
    _blockLength, 
    _bits,  
    _size, 
    _filter: _filter.toString('base64')
  }
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

const verifyCose = async ({entry, receipt, publicKeyJwk}: any) =>{
  const verifier = await cose.lib.verifier({publicKeyJwk});
  const verified = await verifier.verify(receipt);
  const status = Status.from(filterDataFromCbor(verified))
  return status.has(entry)
}

export class Status {
  public filter: XorFilter
  static receipt = { 
    jose: {
      verify: verifyJose
    },
    cose : {
      verify: verifyCose
    }
  }
  static create = (list: string[])=> {
    return new Status(list)
  }
  static from = (filter: any)=> {
    const status = new Status(['a'])
    const f2 = largerFilter(filter)
    status.filter._bits = f2._bits
    status.filter._size = f2._size
    status.filter._seed = f2._seed
    status.filter._blockLength = f2._blockLength
    status.filter._filter = f2._filter.map(((fb: string)=>{
      return Buffer.from(fb, 'base64')
    }))
    return status
  }
  constructor(list: string[]){
    const filter = new XorFilter(list.length, 16)
    filter.add(list)
    this.filter = filter
  }
  has(entry: string){
    return this.filter.has(entry)
  }
  toJSON(){
    const data = this.filter.saveAsJSON()
    return smallerFilter(data)
  }

  async receipt({ greenHost, secretKeyJwk}: any){
    const filterData = this.toJSON()
    if (!greenHost){
      return signJose(secretKeyJwk, filterData)
    }
    return signCose(secretKeyJwk, filterData)
  }
}

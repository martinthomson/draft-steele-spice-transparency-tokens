
import yaml from 'yaml'
import { JWS } from '../jose'

import { base64url } from 'jose'
import { jsonToken } from '../encoding'

export type NotaryOptions = {
  notaryId: string
  notaryKeyId: string

  tokenType: string

  secretKeyJwk?: any
  signer?:any
}

export type ReceiptOptions ={   
  claimset:string
  issuedToken?: string
  presentedToken?: string
}

export const notary = (options: NotaryOptions) => {
  // TODO: a real implementation goes here... 
  return {
    issue: async ({  issuedToken, presentedToken, claimset }: ReceiptOptions) => {
      if (options.secretKeyJwk){
        options.signer = await JWS.signer(options.secretKeyJwk)
      }
      // TODO: Get inclusion proof for issuedToken
      const fakeInclusionProof = {
        merkle_root: 'fake merkle root',
        inclusion_path: []
      }

      const serializedInclusionProof = base64url.encode(JSON.stringify(fakeInclusionProof.inclusion_path))
      const claimsObject = JSON.parse(JSON.stringify(yaml.parse(claimset)))
      const detachedPayloadJws = await options.signer.sign({
        protectedHeader: {
          alg: options.secretKeyJwk.alg,
          b64: false,
          crit: ["b64"],
          kid: options.notaryKeyId,
          typ: options.tokenType,
          jwt_claims: {
            iat: Math.floor(Date.now() / 1000), // unix time stamp in seconds 
            _sd_hash_alg: 'sha-256',
            ...claimsObject
          }
        },
        payload: Buffer.from(fakeInclusionProof.merkle_root)
      })
      const [protectedHeader, signature] = detachedPayloadJws.split('..')
      const ttJson = {
        protected: protectedHeader,
        unprotected: {
          proofs: {
            inclusion: [
              serializedInclusionProof
            ]
          }
        },
        signature
      }
      const receipt = `${ttJson.protected}..${ttJson.signature}~${base64url.encode(JSON.stringify(ttJson.unprotected))}`
      const envelope = issuedToken !== undefined ? issuedToken : presentedToken as string
      const envelopeJson = jsonToken.decode(envelope)
      envelopeJson.unprotected.receipts = [ receipt ]
      const envelopeWithReceipts = jsonToken.encode(envelopeJson)
      return envelopeWithReceipts
    }
  }
}


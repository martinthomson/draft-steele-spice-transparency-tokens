
import yaml from 'yaml'
import { JWS } from '../jose'

import { base64url } from 'jose'
import { jsonToken } from '../encoding'

export type EndorserOptions = {
  endorserId: string
  endorserKeyId: string

  tokenType: string

  secretKeyJwk?: any
  signer?:any
}

export type CounterSignOptions ={   
  claimset:string
  issuedToken?: string
  presentedToken?: string
}

export const endorser = (options: EndorserOptions) => {
  // TODO: a real implementation goes here... 
  return {
    issue: async ({  issuedToken, presentedToken, claimset }: CounterSignOptions) => {
      if (options.secretKeyJwk){
        options.signer = await JWS.signer(options.secretKeyJwk)
      }
      const envelope = issuedToken !== undefined ? issuedToken : presentedToken as string
      // TODO: drop unprotected header....
      const claimsObject = JSON.parse(JSON.stringify(yaml.parse(claimset)))

      const detachedPayloadJws = await options.signer.sign({
        protectedHeader: {
          alg: options.secretKeyJwk.alg,
          b64: false,
          crit: ["b64"],
          kid: options.endorserKeyId,
          typ: options.tokenType,
          jwt_claims: {
            iat: Math.floor(Date.now() / 1000), // unix time stamp in seconds 
            _sd_hash_alg: 'sha-256',
            ...claimsObject
          }
        },
        payload: Buffer.from(envelope)
      })
      const envelopeJson = jsonToken.decode(envelope)
      const envelopeWithCounterSignatures = jsonToken.encode({
        ...envelopeJson,
        unprotected: {
          ...envelopeJson.unprotected,
          counter_signatures: [detachedPayloadJws]
        }
      })
      return envelopeWithCounterSignatures
    }
  }
}


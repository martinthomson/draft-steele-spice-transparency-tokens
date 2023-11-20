
import { digester } from '../util'

import { JWS } from '../jose'

import { jsonToken } from '../encoding'
import { base64url } from 'jose'

export type HolderOptions = {
  holderId: string
  holderKeyId: string

  secretKeyJwk?: any
  signer?:any
}

export type PresentationOptions ={   
  issuedToken: string
  fullDisclosure: boolean

  audience? : string | string[]
  nonce? : string
}

export const holder = (options: HolderOptions) => {
  // TODO: a real implementation goes here... 
  return {
    issue: async ({  issuedToken, fullDisclosure, audience, nonce }: PresentationOptions) => {
      if (options.secretKeyJwk){
        options.signer = await JWS.signer(options.secretKeyJwk)
      }
      const issuedTokenJson = jsonToken.decode(issuedToken)
      let presentedToken;
      // compute presentation

      // compute disclosures
      const disclosures = [] as string[]
      if (fullDisclosure){
        presentedToken = issuedToken
      } else {
        presentedToken = jsonToken.encode({
          ...issuedTokenJson, 
          // TODO: handle redaction via yaml-sd from both JSON and CBOR.
          unprotected: {
            presented_disclosures: disclosures
          }
        })
      }
      const presentationTokenDigest = await digester.digest(Buffer.from(presentedToken))
      // sign hash of presentation token
      const detachedPayloadKeyBindingToken = await options.signer.sign({
        protectedHeader: {
          alg: options.secretKeyJwk.alg,
          b64: false,
          crit: ["b64"],
          kid: options.holderKeyId,
          jwt_claims: {
            _sd_hash_alg: 'sha-256',
            _sd_hash: base64url.encode(presentationTokenDigest),
            iat: Math.floor(Date.now() / 1000), // unix time stamp in seconds 
            aud: audience,
            nonce: nonce,
          }
        },
        payload: presentationTokenDigest
      })
      // add the issued token to the unprotected header of the presentation token.
      const jsonEncodedPresentationToken = jsonToken.decode(detachedPayloadKeyBindingToken)
      jsonEncodedPresentationToken.unprotected.issued_token = issuedToken
      jsonEncodedPresentationToken.unprotected.issued_disclosures = disclosures
      // these 2 unprotected properties need to be committed to by the holder in the _sd_hash
      
      // could also use a hash or reference to the issued token here.
      // jsonEncodedPresentationToken.unprotected.issuedTokenId = ...
      // verifier still needs the issued token to verify....
      // researialize
      const presentationToken = jsonToken.encode(jsonEncodedPresentationToken)
      return presentationToken
    }
  }
}


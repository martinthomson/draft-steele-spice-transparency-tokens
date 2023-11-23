import * as jose from "jose";

import { JWK } from "./JWK";

const signer = async (privateKeyJwk: any): Promise<any> => {
  const privateKey = await jose.importJWK(privateKeyJwk);
  return {
    sign: async ({ protectedHeader, payload }: any) => {
      return new jose.CompactSign(payload)
        .setProtectedHeader(protectedHeader)
        .sign(privateKey);
    },
  };
};

const verifier = async (publicKeyJwk: any) => {
  const publicKey = await jose.importJWK( JWK.getPublicKey(publicKeyJwk) );
  return {
    verify: async (jws: string) => {
      const result = await jose.compactVerify(jws, publicKey);
      return result;
    },
  };
};

export const JWS = { signer, verifier };


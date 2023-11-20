import { base64url } from "jose"

const encode = (data:any)=>{
  return `${data.protected}..${data.signature}~${base64url.encode(JSON.stringify(data.unprotected))}`
}

const decode = (data: string)=> {
  if (!data.includes('~')){
    data = data + `~${base64url.encode(JSON.stringify({}))}`
  }
  const [jws, unprotectedHeader] = data.split('~')
  const [protectedHeader, signature] = jws.split('..')
  const decodedUnprotectedHeader = JSON.parse(new TextDecoder().decode(base64url.decode(unprotectedHeader)))
  return {
    protected: protectedHeader,
    unprotected: decodedUnprotectedHeader,
    payload: null,
    signature
  }
}

export const jsonToken = { encode, decode }
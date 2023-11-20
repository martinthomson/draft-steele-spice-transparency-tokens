import fs from 'fs'
import { tt } from '../src'

describe("readme examples", () => {
  it('api', async () => {
    const alg = 'ES384'
    const aud = `https://verifier.example/transactions/b9a87c99-1fc3-4292-a324-756d680fa4cf`
    const nonce = `860fc8e5-1ed9-4f25-92ad-964c4197df15`

    const issuerRole = await tt.jose.JWK.generate(alg);
    const issuerId = 'https://issuer.example/issuers/4fd94f63-4e8d-4ba0-8b08-496c6087acf0'
    const issuerKeyId = `${issuerId}#${issuerRole.publicKeyJwk.kid}`

    const holderRole = await tt.jose.JWK.generate(alg);
    const holderId = 'https://subject.example/subjects/6320cb92-fffe-4538-8c82-2ad3b6e7fbf8'
    const holderKeyId = `${holderId}#${holderRole.publicKeyJwk.kid}`

    const claimset =  `
# issuer
iss: ${issuerId}
# subject
sub: ${holderId}
    `.trim()
    
    const issuedToken = await tt
    .issuer({ 
      issuerId: issuerId, 
      issuerKeyId: issuerKeyId,
      tokenType: `application/cool+jose`,
      contentType: `text/plain; charset=utf-8`,
      secretKeyJwk: issuerRole.secretKeyJwk 
    })
    .issue({
      holderKeyId: holderKeyId,
      claimset: claimset,
      content: Buffer.from(`💧 Nature is the source of all true knowledge. 🌺`.trim())
    })
    const issuedTokenDiagnostic = tt.diagnose(issuedToken);
    fs.writeFileSync('examples/sd_issued_token.md', issuedTokenDiagnostic)

    const presentedToken = await tt
    .holder({
      holderId: holderId, 
      holderKeyId: holderKeyId,
      secretKeyJwk: holderRole.secretKeyJwk 
    })
    .issue({
      issuedToken,
      fullDisclosure: true,
      audience: aud,
      nonce: nonce
    })

    const presentedTokenDiagnostic = tt.diagnose(presentedToken);
    fs.writeFileSync('examples/sd_presented_token.md', presentedTokenDiagnostic)

  })
});
import cose from '@transmute/cose'
import fs from 'fs'
import { tt }  from '../src'
import { co2 } from "@tgwf/co2";

const co2Emission = new co2();

it('demo', async () => {

  let markdown = ''

  const notaryRole = await tt.bloom.jose.JWK.generate('ES384')

  markdown += `

## Notary Identity

### COSE
~~~~ cbor-diag
${cose.key.beautify(await cose.key.importJWK(notaryRole.publicKeyJwk))}
~~~~

### JOSE
~~~~ json
${JSON.stringify(notaryRole.publicKeyJwk, null, 2)}
~~~~
  `

  const log = tt.bloom.Log.create()
  log.add(Buffer.from('alice'))
  log.add(Buffer.from('bob'))

  const inclusionJose = await log.receipt({ secretKeyJwk: notaryRole.secretKeyJwk })
  const inclusionCose = await log.receipt({ greenHost: true, secretKeyJwk: notaryRole.secretKeyJwk })

  const decoded = cose.cbor.decode(inclusionCose)
  const decodedLog = cose.cbor.decode(decoded.value[2])
  // console.log(decodedLog)
  const decodedLogFilter = cose.cbor.decode(decodedLog[4][0])
  // console.log(decodedLogFilter) 

  const logDiag = await cose.cbor.diagnose(decoded.value[2])
  const filterDiag = await cose.cbor.diagnose(decodedLog[4][0])

  const logJson = JSON.stringify(log, null, 2);

  markdown += `

## Notary Transparency Log

### COSE

#### Inclusion Receipt
${await cose.scitt.receipt.edn(inclusionCose)}

#### Inclusion Log
~~~~ cbor-diag
${logDiag.trim()}
~~~~

## Inclusion Log Filter
~~~~ cbor-diag
${filterDiag.trim()}
~~~~

### JOSE

#### Inclusion Receipt
~~~~ text
${inclusionJose}
~~~~

#### Inclusion Log
~~~~ text
${logJson}
~~~~


  `

  const verifiedInclusionJose = await tt.bloom.Log.receipt.jose.verify({
    entry: Buffer.from('alice'),
    receipt: inclusionJose,
    publicKeyJwk: notaryRole.publicKeyJwk
  })

  const verifiedInclusionCose = await tt.bloom.Log.receipt.cose.verify({
    entry: Buffer.from('alice'),
    receipt: inclusionCose,
    publicKeyJwk: notaryRole.publicKeyJwk
  })

  const statusLog = tt.bloom.Status.create(['alice-happy', 'alice-favorite-color-blue'])

  const statusJose = await statusLog
    .receipt({ secretKeyJwk: notaryRole.secretKeyJwk })

  const statusCose = await statusLog
    .receipt({ greenHost: true, secretKeyJwk: notaryRole.secretKeyJwk })

  const verifiedStatusJose = await tt.bloom.Status.receipt.jose.verify({
    entry: 'alice-favorite-color-blue',
    receipt: statusJose,
    publicKeyJwk: notaryRole.publicKeyJwk
  })

  const verifiedStatusCose = await tt.bloom.Status.receipt.cose.verify({
    entry: 'alice-favorite-color-blue',
    receipt: statusCose,
    publicKeyJwk: notaryRole.publicKeyJwk
  })

  const decodedStatus = cose.cbor.decode(statusCose)
  const statusDiag = await cose.cbor.diagnose(decodedStatus.value[2])


  const statusJson = JSON.stringify(statusLog, null, 2);
  markdown += `

## Log Entry Status

### COSE

#### Status Receipt
${await cose.scitt.receipt.edn(statusCose)}

#### Status Log
~~~~ cbor-diag
${statusDiag.trim()}
~~~~

### JOSE

#### Status Receipt
~~~~ text
${statusJose}
~~~~

#### Status Log
~~~~ text
${statusJson}
~~~~

`

  // proof that alice is in the log, and has favorite color blue
  expect(verifiedInclusionCose).toBe(true)
  expect(verifiedInclusionJose).toBe(true)
  expect(verifiedStatusJose).toBe(true)
  expect(verifiedStatusCose).toBe(true)

  const greenHost = false; // Is the data transferred from a green host?
  const scalingFactor = 1 * 1000000000 // 1 billion

  const inclusionBytesJose = Buffer.from(inclusionJose).length * scalingFactor
  const inclusionBytesCose = Buffer.from(inclusionCose).length * scalingFactor
  const estimatedCO2ForInclusionJose = co2Emission.perByte(inclusionBytesJose, greenHost); // grams of CO2
  const estimatedCO2ForInclusionCose = co2Emission.perByte(inclusionBytesCose, greenHost); // grams of CO2
  // console.log('JOSE: ', estimatedCO2ForInclusionJose, ' grams CO2 for 1 billion inclusion receipts')
  // console.log('COSE: ', estimatedCO2ForInclusionCose, ' grams CO2 for 1 billion inclusion receipts')

  const carbonSavedBySwitchingToCoseInclusion = 100 * (estimatedCO2ForInclusionJose - estimatedCO2ForInclusionCose) / estimatedCO2ForInclusionJose;
  // console.log('COSE Inclusion CO2 Improvement: ', carbonSavedBySwitchingToCoseInclusion, '%')

  const statusBytesJose = Buffer.from(statusJose).length * scalingFactor
  const statusBytesCose = Buffer.from(statusCose).length * scalingFactor
  const estimatedCO2ForStatusJose = co2Emission.perByte(statusBytesJose, greenHost); // grams of CO2
  const estimatedCO2ForStatusCose = co2Emission.perByte(statusBytesCose, greenHost); // grams of CO2
  // console.log('JOSE: ', estimatedCO2ForStatusJose, ' grams CO2 for 1 billion status receipts', )
  // console.log('COSE: ', estimatedCO2ForStatusCose, ' grams CO2 for 1 billion status receipts', )

  const carbonSavedBySwitchingToCoseStatus = 100 * (estimatedCO2ForStatusJose - estimatedCO2ForStatusCose) / estimatedCO2ForStatusJose;
  // console.log('COSE Status CO2 Improvement: ', carbonSavedBySwitchingToCoseStatus, '%')

  markdown = `
# CO2 Transparency with Bloom Filters

We experiment with inclusion and status proofs that a notary might provide by signing bloom filters.
This is not a complete solution, has unaddressed security and privacy issues, and is for demonstration purposes only.

An inclusion receipt can prove than a document is in a log, or has been accepted by an authority.
For example, a customs broker might submit documents related to a customs entry.

A status receipt can prove that a document has a specific status.
For example, a customs broker might wish to know if a shipment is approved for release or being held for a reason.

In this experiment, we create a simple transparency log using Scalable Bloom Filters as described in 
[Scalable Bloom Filters](https://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.725.390&rep=rep1&type=pdf) 
and [Callidon/bloom-filters#scalable-bloom-filter](https://github.com/Callidon/bloom-filters#scalable-bloom-filter).

Next, we create a "status list" with an XOR Filter as decribed in 
[Xor Filters: Faster and Smaller Than Bloom and Cuckoo Filters](https://arxiv.org/abs/1912.08258)
and [Callidon/bloom-filters#xor-filter](https://github.com/Callidon/bloom-filters#xor-filter).

We then sign and verify them using JOSE and COSE, while adjusting their expressions to match the conventions of the serialization, 
for example, preferring arrays over objects in CBOR.

We measure the bytes associated with the secured receipts, 
and multiply by 1 billion scaling factor to simulate the effect of adoption and scaling by industries.

We apply [Web Sustainability Guidelines (WSG) 1.0](https://w3c.github.io/sustyweb/) 
design principles to the COSE representation and estimate the CO2 impact with [CO2.js](https://developers.thegreenwebfoundation.org/co2js/overview/) 
from the green web foundation.

### CO2 Saved by Switching to COSE

| Inclusion  | Status |
| ------------- | ------------- |
| ${carbonSavedBySwitchingToCoseInclusion.toFixed(2)}%  | ${carbonSavedBySwitchingToCoseStatus.toFixed(2)}%   |

### Grams CO2 for 1 billion

| Serialization | Inclusion     | Status        |
| ------------- | ------------- | ------------- |
| COSE  | ${estimatedCO2ForInclusionCose.toFixed(2)}  | ${estimatedCO2ForStatusCose.toFixed(2)}  |
| JOSE  |  ${estimatedCO2ForInclusionJose.toFixed(2)}  | ${estimatedCO2ForStatusJose.toFixed(2)}  |


  ` + markdown

  markdown += `
## View Source

- [demo.test.ts](https://github.com/OR13/draft-steele-spice-transparency-tokens/blob/main/test/demo.test.ts)
  `
  fs.writeFileSync('examples/c02-bloom-jose-cose.md', markdown)

})

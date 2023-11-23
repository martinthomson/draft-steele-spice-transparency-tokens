
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
| 62.93%  | 52.56%   |

### Grams CO2 for 1 billion

| Serialization | Inclusion     | Status        |
| ------------- | ------------- | ------------- |
| COSE  | 53885.93  | 65584.85  |
| JOSE  |  145350.21  | 138259.95  |


  

## Notary Identity

### COSE
~~~~ cbor-diag
{                                   / COSE Key                      /
  1: 2,                             / Type                          /
  2: h'4c4b4b57...53503177',        / Identifier                    /
  3: -35,                           / Algorithm                     /
  -1: 2,                            / Curve                         /
  -2: h'c61d2422...069e2599',       / x public key component        /
  -3: h'e52d77a9...eaa74a35',       / y public key component        /
}
~~~~

### JOSE
~~~~ json
{
  "kid": "LKKWhiPQzgSyCrai54SSceWCAQAKQwkoruD019WSP1w",
  "kty": "EC",
  "crv": "P-384",
  "alg": "ES384",
  "x": "xh0kIn2xmFgBUHMQexRAyg_U5xMxctuI0gL7AXqJofGolObrpcOuvSR5j4UGniWZ",
  "y": "5S13qVQGsGBHyxlZPygr4qzSay_yhLZhCo9JH_DscVN0G0TQvM5yTCNAX2jqp0o1"
}
~~~~
  

## Notary Transparency Log

### COSE

#### Inclusion Receipt
~~~~ cbor-diag
18(                                 / COSE Sign 1                   /
    [
      h'a1013822',                  / Protected                     /
      {},                           / Unprotected                   /
      h'8508fb3f...60000400',       / Payload                       /
      h'fec5669e...fc0ae68e'        / Signature                     /
    ]
)
~~~~

~~~~ cbor-diag
{                                   / Protected                     /
  1: -35,                           / Algorithm                     /
}
~~~~

#### Inclusion Log
~~~~ cbor-diag
[8, 0.01_3, 0.5_2, -1261461178, [h'85184d070b084e1002840081004800140060000400']]
~~~~

##### Inclusion Log Filter
~~~~ cbor-diag
[77, 7, 11, 8, h'1002840081004800140060000400']
~~~~

### JOSE

#### Inclusion Receipt
~~~~ text
eyJhbGciOiJFUzM4NCJ9.eyJ0eXBlIjoiU2NhbGFibGVCbG9vbUZpbHRlciIsIl9pbml0aWFsX3NpemUiOjgsIl9lcnJvcl9yYXRlIjowLjAxLCJfcmF0aW8iOjAuNSwiX2ZpbHRlcnMiOlt7Il9zaXplIjo3NywiX25iSGFzaGVzIjo3LCJfbSI6MTEsIl9maWx0ZXIiOiJFQUtFQUlFQVNBQVVBR0FBQkFBPSIsIl9jYXBhY2l0eSI6OH1dLCJfc2VlZCI6LTEyNjE0NjExNzh9.IXJQGDNr22jx9VlPpjeNKNFxWeN1xEr5sovVjlCDZQos595qAJI4hFJDzv6GACIZw2yyrsYyvz-Sc6No94UFONGFT4_8hg9I5zuvJDQUwcm82n6Pzj3r3g2uUvuIdcgs
~~~~

#### Inclusion Log
~~~~ text
{
  "type": "ScalableBloomFilter",
  "_initial_size": 8,
  "_error_rate": 0.01,
  "_ratio": 0.5,
  "_filters": [
    {
      "_size": 77,
      "_nbHashes": 7,
      "_m": 11,
      "_filter": "EAKEAIEASAAUAGAABAA=",
      "_capacity": 8
    }
  ],
  "_seed": -1261461178
}
~~~~


  

## Log Entry Status

### COSE

#### Status Receipt
~~~~ cbor-diag
18(                                 / COSE Sign 1                   /
    [
      h'a1013822',                  / Protected                     /
      {},                           / Unprotected                   /
      h'853a4b30...00000000',       / Payload                       /
      h'fe062f76...a5a66fa3'        / Signature                     /
    ]
)
~~~~

~~~~ cbor-diag
{                                   / Protected                     /
  1: -35,                           / Algorithm                     /
}
~~~~

#### Status Log
~~~~ cbor-diag
[-1261461178, 11, 16, 2, h'00000000000000006b4500000000000000008d9100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000']
~~~~

### JOSE

#### Status Receipt
~~~~ text
eyJhbGciOiJFUzM4NCJ9.eyJ0eXBlIjoiWG9yRmlsdGVyIiwiX2ZpbHRlciI6IkFBQUFBQUFBQUFCclJRQUFBQUFBQUFBQWpaRUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUEiLCJfYml0cyI6MTYsIl9zaXplIjoyLCJfYmxvY2tMZW5ndGgiOjExLCJfc2VlZCI6LTEyNjE0NjExNzh9.UcqJLMMlvGPcdrj6m256fcKDDN6iAhClN0NSzPWpEjHta3HcXzDdPf3hswDv0Wk3smGVCN_OdHEDyCiA0ZyP9F7r7iTOF_Fpv40WGAS8r2HrFUmDLSCYZ4XRF8n8raqG
~~~~

#### Status Log
~~~~ text
{
  "type": "XorFilter",
  "_filter": "AAAAAAAAAABrRQAAAAAAAAAAjZEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
  "_bits": 16,
  "_size": 2,
  "_blockLength": 11,
  "_seed": -1261461178
}
~~~~


## View Source

- [demo.test.ts](https://github.com/OR13/draft-steele-spice-transparency-tokens/blob/main/sample-implementation/test/demo.test.ts)
  
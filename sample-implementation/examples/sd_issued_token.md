# Transparency Token 

## Issued Token 

### Protected Header

~~~ json
{
  "alg": "ES384",
  "b64": false,
  "crit": [
    "b64"
  ],
  "kid": "https://issuer.example/issuers/4fd94f63-4e8d-4ba0-8b08-496c6087acf0#A5_fYARoOu57wWtfLywYOjfVz5HIUSy3SDFxhrGH_rA",
  "typ": "application/cool+jose",
  "cty": "text/plain; charset=utf-8",
  "jwt_claims": {
    "cnf": {
      "kid": "https://subject.example/subjects/6320cb92-fffe-4538-8c82-2ad3b6e7fbf8#lhGBUIH25Fa9radeRsjISOptyGtbzZyJIWgK6jkCcUw"
    },
    "iat": 1700763222,
    "_sd_hash_alg": "sha-256",
    "iss": "https://issuer.example/issuers/4fd94f63-4e8d-4ba0-8b08-496c6087acf0",
    "sub": "https://subject.example/subjects/6320cb92-fffe-4538-8c82-2ad3b6e7fbf8"
  }
}
~~~

### Unprotected Header

~~~ json
{}
~~~

### JSON

~~~ text
{
  "protected": "eyJhbGciOiJFUzM4NCIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il0sImtpZCI6Imh0dHBzOi8vaXNzdWVyLmV4YW1wbGUvaXNzdWVycy80ZmQ5NGY2My00ZThkLTRiYTAtOGIwOC00OTZjNjA4N2FjZjAjQTVfZllBUm9PdTU3d1d0Zkx5d1lPamZWejVISVVTeTNTREZ4aHJHSF9yQSIsInR5cCI6ImFwcGxpY2F0aW9uL2Nvb2wram9zZSIsImN0eSI6InRleHQvcGxhaW47IGNoYXJzZXQ9dXRmLTgiLCJqd3RfY2xhaW1zIjp7ImNuZiI6eyJraWQiOiJodHRwczovL3N1YmplY3QuZXhhbXBsZS9zdWJqZWN0cy82MzIwY2I5Mi1mZmZlLTQ1MzgtOGM4Mi0yYWQzYjZlN2ZiZjgjbGhHQlVJSDI1RmE5cmFkZVJzaklTT3B0eUd0YnpaeUpJV2dLNmprQ2NVdyJ9LCJpYXQiOjE3MDA3NjMyMjIsIl9zZF9oYXNoX2FsZyI6InNoYS0yNTYiLCJpc3MiOiJodHRwczovL2lzc3Vlci5leGFtcGxlL2lzc3VlcnMvNGZkOTRmNjMtNGU4ZC00YmEwLThiMDgtNDk2YzYwODdhY2YwIiwic3ViIjoiaHR0cHM6Ly9zdWJqZWN0LmV4YW1wbGUvc3ViamVjdHMvNjMyMGNiOTItZmZmZS00NTM4LThjODItMmFkM2I2ZTdmYmY4In19",
  "unprotected": {},
  "payload": null,
  "signature": "0jToIE5xq4SLAbc5V8VWfqndIR_ClSGdBaTkZee0ppPII3-KZ4s7CPbkEzPjlL3OPiziEVNu75YOaY8QTBojYE6f9cxRMBZKGo_bAv87cxymPlxgXjoySB_5LTW6Muq8"
}
~~~

### Compact

~~~ text
eyJhbGciOiJFUzM4NCIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il0sImtpZCI6Imh0dHBzOi8vaXNzdWVyLmV4YW1wbGUvaXNzdWVycy80ZmQ5NGY2My00ZThkLTRiYTAtOGIwOC00OTZjNjA4N2FjZjAjQTVfZllBUm9PdTU3d1d0Zkx5d1lPamZWejVISVVTeTNTREZ4aHJHSF9yQSIsInR5cCI6ImFwcGxpY2F0aW9uL2Nvb2wram9zZSIsImN0eSI6InRleHQvcGxhaW47IGNoYXJzZXQ9dXRmLTgiLCJqd3RfY2xhaW1zIjp7ImNuZiI6eyJraWQiOiJodHRwczovL3N1YmplY3QuZXhhbXBsZS9zdWJqZWN0cy82MzIwY2I5Mi1mZmZlLTQ1MzgtOGM4Mi0yYWQzYjZlN2ZiZjgjbGhHQlVJSDI1RmE5cmFkZVJzaklTT3B0eUd0YnpaeUpJV2dLNmprQ2NVdyJ9LCJpYXQiOjE3MDA3NjMyMjIsIl9zZF9oYXNoX2FsZyI6InNoYS0yNTYiLCJpc3MiOiJodHRwczovL2lzc3Vlci5leGFtcGxlL2lzc3VlcnMvNGZkOTRmNjMtNGU4ZC00YmEwLThiMDgtNDk2YzYwODdhY2YwIiwic3ViIjoiaHR0cHM6Ly9zdWJqZWN0LmV4YW1wbGUvc3ViamVjdHMvNjMyMGNiOTItZmZmZS00NTM4LThjODItMmFkM2I2ZTdmYmY4In19..0jToIE5xq4SLAbc5V8VWfqndIR_ClSGdBaTkZee0ppPII3-KZ4s7CPbkEzPjlL3OPiziEVNu75YOaY8QTBojYE6f9cxRMBZKGo_bAv87cxymPlxgXjoySB_5LTW6Muq8~e30
~~~
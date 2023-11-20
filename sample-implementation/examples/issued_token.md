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
  "kid": "https://issuer.example/issuers/4fd94f63-4e8d-4ba0-8b08-496c6087acf0#wExB-Q4moKUPtRTTtjda_92Gez1BR5Mdl48Akz6S50U",
  "typ": "application/cool+jose",
  "cty": "text/plain; charset=utf-8",
  "cnf": {
    "kid": "https://subject.example/subjects/6320cb92-fffe-4538-8c82-2ad3b6e7fbf8#EOw_X3nrV6gs229uNTLauEoV5rJpqPmuSA1XJPJokns"
  },
  "jwt_claims": {
    "iat": 1700506732,
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
  "protected": "eyJhbGciOiJFUzM4NCIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il0sImtpZCI6Imh0dHBzOi8vaXNzdWVyLmV4YW1wbGUvaXNzdWVycy80ZmQ5NGY2My00ZThkLTRiYTAtOGIwOC00OTZjNjA4N2FjZjAjd0V4Qi1RNG1vS1VQdFJUVHRqZGFfOTJHZXoxQlI1TWRsNDhBa3o2UzUwVSIsInR5cCI6ImFwcGxpY2F0aW9uL2Nvb2wram9zZSIsImN0eSI6InRleHQvcGxhaW47IGNoYXJzZXQ9dXRmLTgiLCJjbmYiOnsia2lkIjoiaHR0cHM6Ly9zdWJqZWN0LmV4YW1wbGUvc3ViamVjdHMvNjMyMGNiOTItZmZmZS00NTM4LThjODItMmFkM2I2ZTdmYmY4I0VPd19YM25yVjZnczIyOXVOVExhdUVvVjVySnBxUG11U0ExWEpQSm9rbnMifSwiand0X2NsYWltcyI6eyJpYXQiOjE3MDA1MDY3MzIsIl9zZF9oYXNoX2FsZyI6InNoYS0yNTYiLCJpc3MiOiJodHRwczovL2lzc3Vlci5leGFtcGxlL2lzc3VlcnMvNGZkOTRmNjMtNGU4ZC00YmEwLThiMDgtNDk2YzYwODdhY2YwIiwic3ViIjoiaHR0cHM6Ly9zdWJqZWN0LmV4YW1wbGUvc3ViamVjdHMvNjMyMGNiOTItZmZmZS00NTM4LThjODItMmFkM2I2ZTdmYmY4In19",
  "unprotected": {},
  "payload": null,
  "signature": "N-bG0amNO3BNUx3oeiWyVUFZay9c1k_gDPMzbv6GSUqR-i8QhNSS661j3CXncDUeKoGerZ_xjAxW3Djk7ZMQwJMFz42aucTlCu0s5ikhgqsrf6KfEBkGiKGwggt0Lz6i"
}
~~~

### Compact

~~~ text
eyJhbGciOiJFUzM4NCIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il0sImtpZCI6Imh0dHBzOi8vaXNzdWVyLmV4YW1wbGUvaXNzdWVycy80ZmQ5NGY2My00ZThkLTRiYTAtOGIwOC00OTZjNjA4N2FjZjAjd0V4Qi1RNG1vS1VQdFJUVHRqZGFfOTJHZXoxQlI1TWRsNDhBa3o2UzUwVSIsInR5cCI6ImFwcGxpY2F0aW9uL2Nvb2wram9zZSIsImN0eSI6InRleHQvcGxhaW47IGNoYXJzZXQ9dXRmLTgiLCJjbmYiOnsia2lkIjoiaHR0cHM6Ly9zdWJqZWN0LmV4YW1wbGUvc3ViamVjdHMvNjMyMGNiOTItZmZmZS00NTM4LThjODItMmFkM2I2ZTdmYmY4I0VPd19YM25yVjZnczIyOXVOVExhdUVvVjVySnBxUG11U0ExWEpQSm9rbnMifSwiand0X2NsYWltcyI6eyJpYXQiOjE3MDA1MDY3MzIsIl9zZF9oYXNoX2FsZyI6InNoYS0yNTYiLCJpc3MiOiJodHRwczovL2lzc3Vlci5leGFtcGxlL2lzc3VlcnMvNGZkOTRmNjMtNGU4ZC00YmEwLThiMDgtNDk2YzYwODdhY2YwIiwic3ViIjoiaHR0cHM6Ly9zdWJqZWN0LmV4YW1wbGUvc3ViamVjdHMvNjMyMGNiOTItZmZmZS00NTM4LThjODItMmFkM2I2ZTdmYmY4In19..N-bG0amNO3BNUx3oeiWyVUFZay9c1k_gDPMzbv6GSUqR-i8QhNSS661j3CXncDUeKoGerZ_xjAxW3Djk7ZMQwJMFz42aucTlCu0s5ikhgqsrf6KfEBkGiKGwggt0Lz6i~e30
~~~
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
  "kid": "https://issuer.example/issuers/4fd94f63-4e8d-4ba0-8b08-496c6087acf0#Yt1NOXukIQMP3BgImdMcmhFL727muTmqNIiVf-76gjs",
  "typ": "application/cool+jose",
  "cty": "text/plain; charset=utf-8",
  "jwt_claims": {
    "cnf": {
      "kid": "https://subject.example/subjects/6320cb92-fffe-4538-8c82-2ad3b6e7fbf8#JCGVU80jN1pwP2NI-06BDIyNPcQPUdIGKi-d7cSipT8"
    },
    "iat": 1700763443,
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
  "protected": "eyJhbGciOiJFUzM4NCIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il0sImtpZCI6Imh0dHBzOi8vaXNzdWVyLmV4YW1wbGUvaXNzdWVycy80ZmQ5NGY2My00ZThkLTRiYTAtOGIwOC00OTZjNjA4N2FjZjAjWXQxTk9YdWtJUU1QM0JnSW1kTWNtaEZMNzI3bXVUbXFOSWlWZi03NmdqcyIsInR5cCI6ImFwcGxpY2F0aW9uL2Nvb2wram9zZSIsImN0eSI6InRleHQvcGxhaW47IGNoYXJzZXQ9dXRmLTgiLCJqd3RfY2xhaW1zIjp7ImNuZiI6eyJraWQiOiJodHRwczovL3N1YmplY3QuZXhhbXBsZS9zdWJqZWN0cy82MzIwY2I5Mi1mZmZlLTQ1MzgtOGM4Mi0yYWQzYjZlN2ZiZjgjSkNHVlU4MGpOMXB3UDJOSS0wNkJESXlOUGNRUFVkSUdLaS1kN2NTaXBUOCJ9LCJpYXQiOjE3MDA3NjM0NDMsIl9zZF9oYXNoX2FsZyI6InNoYS0yNTYiLCJpc3MiOiJodHRwczovL2lzc3Vlci5leGFtcGxlL2lzc3VlcnMvNGZkOTRmNjMtNGU4ZC00YmEwLThiMDgtNDk2YzYwODdhY2YwIiwic3ViIjoiaHR0cHM6Ly9zdWJqZWN0LmV4YW1wbGUvc3ViamVjdHMvNjMyMGNiOTItZmZmZS00NTM4LThjODItMmFkM2I2ZTdmYmY4In19",
  "unprotected": {},
  "payload": null,
  "signature": "QA0hmZZEjUIzOwKhmsMr3nHkBgEfSfjpopnt9ka8pvSneQ9eL4sx4MAM9P1q1buD0LwXlZel9yGIE8eeIoIJ0Bz6Kt9M73uavSdJ3GjSbwHBvw0g9jXpMfwAcx1CHgDn"
}
~~~

### Compact

~~~ text
eyJhbGciOiJFUzM4NCIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il0sImtpZCI6Imh0dHBzOi8vaXNzdWVyLmV4YW1wbGUvaXNzdWVycy80ZmQ5NGY2My00ZThkLTRiYTAtOGIwOC00OTZjNjA4N2FjZjAjWXQxTk9YdWtJUU1QM0JnSW1kTWNtaEZMNzI3bXVUbXFOSWlWZi03NmdqcyIsInR5cCI6ImFwcGxpY2F0aW9uL2Nvb2wram9zZSIsImN0eSI6InRleHQvcGxhaW47IGNoYXJzZXQ9dXRmLTgiLCJqd3RfY2xhaW1zIjp7ImNuZiI6eyJraWQiOiJodHRwczovL3N1YmplY3QuZXhhbXBsZS9zdWJqZWN0cy82MzIwY2I5Mi1mZmZlLTQ1MzgtOGM4Mi0yYWQzYjZlN2ZiZjgjSkNHVlU4MGpOMXB3UDJOSS0wNkJESXlOUGNRUFVkSUdLaS1kN2NTaXBUOCJ9LCJpYXQiOjE3MDA3NjM0NDMsIl9zZF9oYXNoX2FsZyI6InNoYS0yNTYiLCJpc3MiOiJodHRwczovL2lzc3Vlci5leGFtcGxlL2lzc3VlcnMvNGZkOTRmNjMtNGU4ZC00YmEwLThiMDgtNDk2YzYwODdhY2YwIiwic3ViIjoiaHR0cHM6Ly9zdWJqZWN0LmV4YW1wbGUvc3ViamVjdHMvNjMyMGNiOTItZmZmZS00NTM4LThjODItMmFkM2I2ZTdmYmY4In19..QA0hmZZEjUIzOwKhmsMr3nHkBgEfSfjpopnt9ka8pvSneQ9eL4sx4MAM9P1q1buD0LwXlZel9yGIE8eeIoIJ0Bz6Kt9M73uavSdJ3GjSbwHBvw0g9jXpMfwAcx1CHgDn~e30
~~~
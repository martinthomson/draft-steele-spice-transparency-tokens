import { base64url } from "jose"

import { jsonToken } from "../encoding"


const diagnoseIssuedToken =  (data: any) => {
  const decodedToken = jsonToken.decode(data)
  const decodedProtectedHeader = JSON.parse(new TextDecoder().decode(base64url.decode(decodedToken.protected)))

  return `
# Transparency Token

## Issued Token

### Protected Header

~~~ json
${JSON.stringify(decodedProtectedHeader, null, 2)}
~~~

### Unprotected Header

~~~ json
${JSON.stringify(decodedToken.unprotected, null, 2)}
~~~

### JSON

~~~ text
${JSON.stringify(decodedToken, null, 2)}
~~~

### Compact

~~~ text
${data}
~~~
  `.trim()
}

const diagnosePresentedToken =  (data: any) => {
  const decodedPresentedToken = jsonToken.decode(data)
  const decodedPresentedProtectedHeader  = JSON.parse(new TextDecoder().decode(base64url.decode(decodedPresentedToken.protected)))
  
  const decodedIssuedToken  = jsonToken.decode(decodedPresentedToken.unprotected.issued_token)
  const decodedIssuedProtectedHeader = JSON.parse(new TextDecoder().decode(base64url.decode(decodedIssuedToken.protected)))
  return `
# Transparency Token

## Presented Token

### Protected Header

~~~ json
${JSON.stringify(decodedPresentedProtectedHeader, null, 2)}
~~~

### Unprotected Header

~~~ json
${JSON.stringify(decodedPresentedToken.unprotected, null, 2)}
~~~

### JSON

~~~ text
${JSON.stringify(decodedPresentedToken, null, 2)}
~~~

### Compact

~~~ text
${data}
~~~

## Issued Token

### Protected Header

~~~ json
${JSON.stringify(decodedIssuedProtectedHeader, null, 2)}
~~~

### Unprotected Header

~~~ json
${JSON.stringify(decodedIssuedToken.unprotected, null, 2)}
~~~

### JSON

~~~ text
${JSON.stringify(decodedIssuedToken, null, 2)}
~~~

### Compact

~~~ text
${data}
~~~
  `.trim()
}

export const diagnose = (data: any) => {
  const decodedToken = jsonToken.decode(data)
  if (decodedToken.unprotected.issued_token){
    return diagnosePresentedToken(data)
  } else {
    return diagnoseIssuedToken(data)
  }
}
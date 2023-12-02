---
v: 3
title: "Transparency Tokens"
abbrev: "SpiceTT"
cat: std
docname: draft-steele-transparency-tokens-latest
stream: IETF
number:
date: 2023
consensus: true
area: "Security"
keyword:
 - Internet-Draft
 - cose
 - jose
 - transparency
 - selective disclosure
 - unlinkability
 - untraceability
venue:
  group: "Secure Patterns for Internet CrEdentials (spice)"
  type: "Working Group"
  mail: "spice@ietf.org"
  arch: "https://mailarchive.ietf.org/arch/browse/spice/"
  github: "OR13/draft-steele-spice-transparency-tokens"
  latest: "https://OR13.github.io/draft-steele-spice-transparency-tokens/draft-steele-transparency-tokens.html"

author:
 -
    fullname: "Orie Steele"
    organization: Transmute
    email: "orie@transmute.industries"

normative:
  I-D.ietf-privacypass-architecture: PRIVACY-PASS
  I-D.ietf-cose-cwt-claims-in-headers: COSE-CWT-HEADER-CLAIMS
  I-D.ietf-cose-typ-header-parameter: COSE-TYP
  I-D.ietf-cose-merkle-tree-proofs: COSE-VDP
  I-D.ietf-jose-json-web-proof: JOSE-JWP
  I-D.ietf-oauth-selective-disclosure-jwt: SD-JWT
  I-D.ietf-oauth-sd-jwt-vc: SD-JWT-VC

  I-D.prorock-cose-sd-cwt: SD-CWT

  RFC7519: JWT
  RFC8392: CWT

informative:
  RFC4949: SEC-v2
  RFC5755: ATTRIBUTE-CERTS
  RFC8725: JWT-BCP
  RFC5785: WELL-KNOWN-URIS
  RFC9449: DPOP



--- abstract

When professionals travel for business, they carry identity documents,
such as passports,
employer related payment capabilites,
such as corporate credit cards, and
security keys that might be used for both personal or professional reasons,
such as hotel or car keys.

These credentials might be stored in a purse, briefcase or wallet.

Digital storage systems struggle to support the various credential formats,
physical proximity and remote presentation protocols,
and assurance capabilities needed to enable international business.

Device capabilities, cost and power consumption can preclude
access and adoption of digital credentials, or exclude communities
that require higher than normal privacy, sustainability, or availability guarantees.

This specification describes a scalable solution to digital credentials,
that is market friendly, transport agnostic, privacy oriented,
and accountable to users of digital credentials above all other stakeholders.

--- middle

# Introduction

The "Complaint tablet to Ea-nāṣir" is considered to be the oldest known written complaint.
The tablet was written in Akkadian cuneiform, by a customer named Nanni to a merchant named Ea-nāṣir.
The complaint describes how Ea-nāṣir had agreed to sell copper ingots to Nanni, via Nanni's unnamed servant,
but the ingots were considered sub standard and were not accepted. Nanni created the complaint letter
for delivery to Ea-nāṣir to explain that the copper was not the correct grade, that his servant was treated poorly,
and that at the time of writing, he had not accepted the copper, but had paid for it.
Search for the wikipedia article for the full story.

Although humanity has moved on from clay tablets, to paper, to byte streams on the internet,
some business challenges have remained the same.

Travel is dangerous and expensive.

The properties of the products we purchase,
do not always match the properties that were advertised.

There is a need to delegate negotiation to trusted intermediaries,
while convincing counter parties that the intermediary is authorized to complete the transaction.

There is a need to ensure that intermediaries do not tamper with the sale price
or technical specification of the product.

And there is a need to provide transparency regarding supply chain activities,
so that consumers and businesses can make informed decisions regarding products and the known risks associated with them, as this information changes over time.

If Nanni and Ea-nāṣir had transparency tokens, their trade would have been frictionless, and we would all be without the first written use case expressing the concept of credentials.

# Terminology

{::boilerplate bcp14-tagged}

To the best of our ability we reuse terminology from {{-SEC-v2}}.
For clarity, we provide more specific definitions when necessary.

principle:
: A specific identity claimed by an entity when accessing a system.

identity:
: The collective aspect of a set of attribute values (i.e., a
  set of characteristics) by which a system entity is recognizable or known.

identifier:
: A data object -- often, a printable, non-blank character
  string -- that definitively represents a specific identity of a
  system entity, distinguishing that identity from all others.

issuer:
: An entity that makes statements. Also known as issuing authority. This entity may have multiple identifiers.

statement:
: A definite or clear expression of something;
  a judgement, opinion, attribute, predicate or proposition regarding a subject.

subject:
: The entity being discussed, described or attributed. This entity may have multiple identifiers.

holder:
: An entity which knows or possesses statements. This entity may have multiple identifiers.

verifier:
: An entity which reviews, checks or confirms proofs and optionally statements. This entity may have multiple identifiers.

credential:
: A token (usually an unforgeable data object)
  that is a portable representation of the association between an
  identifier and a unit of authentication information, or statement
  and that can be presented by a holder.

issued credential:
: A tamper-proof object that includes a set of attributes about an entity issued by an issuing authority.

anonymous credential:
: An issued credential that has privacy-preserving properties to enable data minimization and correlation resistance. RFC4949, deprecated this term, but recent advances in cryptography have changed the common understanding from what it once was.

credential proof:
: An unforgeable data object derived from an issued credential, constructed by the holder of they credential

presentation:
: The activity a holder performs when transmiting a credential proofs, and optionally issued credentials to a verifier.

notary:
: Provides a trusted timestamp for a document, so that
  someone can later prove that the document existed at that point in
  time; verifies the signature(s) on a signed document before
  applying the stamp.

receipt:
: A token (usually an unforgeable data object)
  proving that notarization has taken place.

counter signature:
: A token (usually an unforgeable data object)
  proving that a second issuer, has seen a credential from a first issuer.

mediator:
: A party that provides a transmission capability that protects
  the confidentiality or presentations made by holders.


# Architecture

## Credential Roles

Credentials are essential to the efficient function of principles,
be they natural persons or legal entities.

Throughout their lifetime, a principle might create many identifiers,
and these identifiers may be known to fulfill the various
roles associated with digital credentials.

These roles include being the issuer of statements about a subject,
being the subject of statements made by issuers,
holding credentials regarding identifiers for the principle,
holding credentials regarding identifiers for other principles,
presenting credentials to verifiers, or receiving presentations from other holders.

The same entity may play all these roles,
but for the sake of clarity we usually refer to interactions
where each distinct entity playes a specific role in a workflow.

The canonical example is:

An issuer makes statements about a subject and produces an unforgable token as the issued credential.
The issuer transmits the issued credential to a holder.
A verifier requests a credential be presented.
The holder derives a presentable form of the issued credential, called the presented credential.
The holder transmits the presented credential to a verifier.

~~~aasvg
                                    Holders
                                     ______
                                    /\     \
                                   /  \     \
                                  /    \_____\
                                 _\    / ____/_
                                /\ \  / /\     \
                               /  \ \/_/  \     \
                              /    \__/    \_____\
                             _\    /  \    / ____/_
                            /\ \  /    \  / /\     \
                           /  \ \/_____/\/_/  \     \
                          /    \_____\    /    \_____\
      Credentials        _\    /     /    \    / ____/_        Proofs
                        /\ \  /     /      \  / /\     \
                       /  \ \/_____/        \/_/  \     \
                      /    \_____\            /    \_____\
                     _\    /     /            \    / ____/_
                    /\ \  /     /              \  / /\     \
                   /  \ \/_____/                \/_/  \     \
                  /    \_____\                    /    \_____\
                 _\    /     /_  ______  ______  _\____/ ____/_
                /\ \  /     /  \/\     \/\     \/\     \/\     \
               /  \ \/_____/    \ \     \ \     \ \     \ \     \
              /    \_____\ \_____\ \_____\ \_____\ \_____\ \_____\
              \    /     / /     / /     / /     / /     / /     /
               \  /     / /     / /     / /     / /     / /     /
Issuers         \/_____/\/_____/\/_____/\/_____/\/_____/\/_____/         Verifiers

                                  Status Checks
~~~

There are auxillary roles which are special cases of the issuer, holder or verifier which are common
in scenarious requiring additional assurance or confidentiality.

In cases where the issuer, or holder lacks credibility,
a countersignature or endorsement from a more reputatible entity
might be required to convince a warry verifier.

In cases where the issuer or holder might rotate verification keys frequently,
or where the issuer or holder might not be well known to a verifier,
a receipt from a notary can provide assurance to the verifier.

~~~aasvg

                 .----+-----.  .-----------.
Issuers     --> | Statements ||  Envelopes  |
                 '----+-----'  '-----+-----'
                      |              |
                       '----. .-----'
                             |
                             v
                      .------+------.
                     |  Credentials  |
                      '------+------'
                             |                +--------------+
                          .-' '-------------->+ Transparency |
                         |   .----------.     |              |
Authority A -->          |  | Receipt 1  +<---+   Service 1  |
                         |   '---+------'     +---------+----+
                         |       |                      |
                         |       |           +--------------+
                      .-' '------)---------->+ Transparency |
                     |   .----------.        |              |
Authority B -->      |  | Receipt 2  +<------+   Service 2  |
                     |   '----+-----'        +----+---------+
                     |        |  |                |     |
                      '-. .--'   |                |     |
                         |       |                |     |
                          '-. .-'                 |     |
                             |                    |     |
                             v                    v     v
                       .-----+------.         .---+-----+--.
                      | Transparency |       | Identity     |
                      | Tokens       |       | Documents    |
                       '-----+------'         '------+-----'
                             |                       |
                              '-------.     .-------'
                                       |   |
                                       v   v
                            .-----------+---+--------.
Verifiers    -->             \   Credential Proofs  /
                              '--------------------'
~~~


In cases where a holder requires untraceability or is required
to provide confidentiality regarding the provenance of a credential,
delegation with or without attenutation to intermediate, or mediators holders, may be necessary.

Notaries and mediators can leverage receipts and counter signatures to adjust the transparency,
traceability and confidentiality associated with credentials.

Giving unique and meaningful names to these roles,
allows for digital trust systems to optimize for the properties that are most needed for credential use cases.

## Identity Documents

In order to verify a credential proof, verification material from the issuer and holder needs to be available at the time the verification algorithm is called.

Resolving key material just in time negatively impacts privacy, security and performance.

Whenever possible, it recommended to fetch verification keys and any associated metadata from a trusted source, and cache them locally.

Key material can also be delivered out of band or in band depending on the envelope format used.

This specification defines an identity document format based on transparency receipts that is compact, integrity protected, and can be delivered in band to verifiers in a network denied environment.

This example is not normative.

The identity document is a COSE Key, which has been signed and made transparent:

~~~~ cbor-diag
18(                                 / COSE Sign 1                   /
    [
      h'a4013822...31333337',       / Protected                     /
      {                             / Unprotected                   /
        -333: [                     / Receipts (1)                  /
          h'd2845867...cf71886e'    / Receipt 1                     /
        ]
      },
      nil,                          / Detached payload              /
      h'1c3271fb...b5df03d7'        / Signature                     /
    ]
)
~~~~

The protected header includes identifiers for the entity, and the issuer of the identity document:

~~~~ cbor-diag
{                                   / Protected                     /
  1: -35,                           / Algorithm                     /
  3: application/cose-key,          / Content type                  /
  4: h'5b55dd99...8a2acc6b',        / Key identifier                /
  13: {                             / CWT Claims                    /
    1: issuer.example,              / Issuer                        /
    2: holder.example,              / Subject                       /
  },
}
~~~~

Because the payload is opaque that content type can be used to support key formats that are present in [IANA Media Types](https://www.iana.org/assignments/media-types/media-types.xhtml)

A verifier will need to discover or obtain the identity documents for the issuer and the holder.

The identifier for the entity (issuer / holder) might be present in identifiers for resources representing the identity document for the identifier.

This can be accomplished several ways.

A verifier might discover an identity document through {{-WELL-KNOWN-URIS}}

For example:

~~~text
https://issuer.example/.well-known/id
~~~

A verifier might look up an identity document through a trusted key server, distributed database, or transparency service:

~~~text
https://service.example/keys/issuer.example
~~~

In some cases, a verifier might require multiple receipts for an identity document,
proving the same key information is bound to an identifier in multiple independent systems.

~~~text

https://government1.example/receipts/keys/issuer.example

https://government2.example/receipts/keys/issuer.example
~~~

The verifier can then decide to reject credential proofs from holder's that are unable to demonstrate enough transparency.

During verification, the holder of a credential might be required to demonstrate possession of an identity document similar to {{-DPOP}}

A verifier can prepare a challenge token (signed nonce) or nonce for the holder.

The holder can sign the challenge or nonce, along with an audience claim binding their response to the requesting verifier.

This "key binding token" is defined similar to {{-SD-JWT}}

A credential requiring identity document confirmation (traceability, NOT unlinkability) can contain a `cnf` claim with an identifier that resolves to an identity document,
and verifiers can confirm the associated key binding token is signed with the public key in an identity document for the holder.

An example of a credential with identity confirmation:

~~~~ cbor-diag
{                                   / Protected                     /
  1: -35,                           / Algorithm                     /
  3: application/example+xml,       / Content type                  /
  4: h'5b55dd99...8a2acc6b',        / Issuer Key identifier         /
  13: {                             / CWT Claims                    /
    1: issuer.example,              / Issuer                        /
    2: holder.example,              / Subject                       /
    8: {                            / Confirmation                  /
      3: h'a04bfe57...296ea037'     / Holder Identity Doc URI       /
    }
  },
}
~~~~

In order to verify credential proofs for this credential with identity binding, the verifier must:

- decode the protected header, and lookup the issuer identity document.
- confirm the issuer's identity document is still valid according to the verifier's policy
  - check the validity period, ensure the credential is not activated in the future or expired in the past.
  - check the status, in case the issuer of the issuer's identity docment has suspended or revoked the document.
  - check the key used to sign the credential proof, is present in the issuer's identity document.
- verify the credential proof with the issuer's public key, from their identity document.
  - decode the protected header, and validate the claims
  - lookup the holder's identity document using the hints inside the `cnf` claim
  - perform the same validation checks as were done for the issuer's identity document on the holder's identity document.
- verify the credential identity confirmation token using the holder's public key from the holder's identity document.
  - check the validity period, ensure the token is not activated in the future or expired in the past.
  - check the key used to sign the credential identity confirmation token, is present in the holder's identity document.

After these verifications and validations have been completed, if they have all succeeded the verifier should believe the following:

The issuer's intention to assert the payload's relation to the subject has not been tampered with, the intention is still valid and has not changed since the credential was issued.
The holder is in possession of the credential at the time of verification.
The identity documents for both the issuer and holder are still valid.

With these basics confirmed, the verifier can proceed to application / business layer processing of the payload.

In the example above the payload is XML, and could represent some required legacy identity credential format.

The verifier can then advertise that the legacy identity credential system is nearing end of life and that in order to support sustainability initiatives,
reduce attack surface, and reduce carbon emmissions, only compact binary representations will be supported in the future.

By keeping the payload opaque,
transparency tokens can be intergrated into legacy systems that require larger and older media types,
and assist those systems in modernizing to support compact binary.


# Credential Principles

Identification happens before we recognize threat or opportunity.

Digital credentials are tools but like most tools,
access and authority to use them are controlled by social,
economic and political factors.

Because this technology has the potential to adversly impact the freedom
and inalienable rights of human beings, and healthy competition of legal entities,
we state these principles of digital credentials,
but caution that not all these properties can be easily achieved without sacrifice,
and where some principles may be appropriatly degraded for legal entities,
other principles ought to be preserved for natural persons.

## Format Agility

Modern paper credentials come in many different shapes and sizes, from notary stamped paper documents with wet ink signatures,
to ASN.1 and X.509 signed XML documents representing commercial invoices.

New formats are created to address the challenges and shortcoming of the formats that came before. Clay tablets were heavy, paper is easily destroyed, XML Signatures were expensive to compute and error prone, JSON while readable and writable by humans was wasteful of compute and storage when processed by machines.

CBOR stands on the shoulders of giants, having benefitted from being created last, and suffering for being less well adopted than XML and JSON.

It is natural to wish for there to be only one format, for digital credentials, as this would improve interoperability and reduce the costs associated with verifying credentials as part of business transactions, but nature does not produce discrete steps in technology deployment. Horses and automobiles shared the streets of cities in the early 19th century, and XML, ASN.1, JSON and CBOR will coexist so long as business requires them too.

There are advantages to having multiple formats for digital credentials, particular when attempting to give privacy or security benefits to users that depend on specific protocols, that are only able to handle certain credential formats. For example, OAuth and OpenID Connect tend to require JSON claimsets and JWT credential formats.

In order to preserve format agility, while leveraging existing claims and terminology, this document recommends a convention of preserving payload content as opaque bytes, leveraging protected headers to signature media types associated with validation of payloads, and claims in headers, in cases where format specific claims need to be consistently understood by verifiers.


## Autonomy

Issuers reserve the right to make statements.
Holders reserve the right to present credentials.
Verifiers reserve the right to reject presentation.

Issuers may be subject to local, regional or global laws regarding statements.
Holders might be denied service, if they are unwilling to present credentials.
Verifiers might be subject to legal action for rejecting presentations in ways that violate local laws.

When developing digital credential technology,
consideration should be given to allow these roles to perform their function,
with respect to local culture and conventions.

Globally compelling behavior reduces the value of digital reputation over time,
and degrades the ability of individual entities to provide better security and privacy properties,
by applying least privledge and minimal disclosure.

## Confidentiality

All information should be considered sensitive, including timing,
transmission metadata, the social graph that is built between issuers, subjects, holders and verifiers,
and of course the content of statements.

All encryption has a shelf life, these signals should be protected with cryptography
appropriate for maintaining confidentiality for as long as is necessary to prevent harm.

## Anonymity

The act of observation changes the outcome, and character is what you do when nobody is watching.

These technologies can be used to erode the abilty to create unlinkable digital identifiers,
which are necessary for maintaining distinct digital identities.

At the same time, these technologies can be used to create unlinkable digital identifers,
which can be used in ways that are unpredictable.

When designing digital trust systems, implementers should be cautious to preserve anonymity when it is essential,

## Authenticity

Perhaps the most essential property of digital credentials is assuring that statements can be made unforgable.

Verifiers require this property to be able to make use of presentations from holders,
with confidence that the holder is not able to tamper with or alter the statements made by issuers.

This property also applies to the act of presenting by the holder.

Assurance regarding the capabilities of the holder's device, or other evidence regarding
the presence or awareness of the holder can be essential to convincing a verifier to accept a presentation.

See FIDO, etc...

## Transparency

Transparency does not mean lack of confidentiality, it means commiting to be honest, in a way that dishonesty can be detected.

This property is essential to service providers who maintain public key to identity bindings such as the work describes in key transparency.

This property is also essential to statements about artifacts or ingredients that are assembled into more complex structures,
so that is a problem in a sub component is detected, the potential damage can be mitigated, and the relying parties can be notified
to protect their systems from cascading faults.

## Accountability

Of the various credential roles, holders and subjects are most vulnerable, and have the least power or incentive to adopt digital credential systems.

Issuers and verifiers have great power and responsibility, and in cases where holders might not have the
choices regarding credential storage, credential transmission, privacy and security features or the principles above,
it will be due to the choices made by issuers and verifiers.

Implementers should seek to frame the design of digital trust systems in terms of supporting the needs of holders,
and challenged seek accountability to holders before all other parties.

# Credential Workflows

Credentials can be exchanged over differrent protocols.
In this section we outline a few exemplar exchange scenarios,
however, this list is not exhaustive and some protocols might
define additional variations on these examples.

## Credential Delivery

A subject will request a credential be created by an issuer,
or an issuer will create a credential for a subject.

The next step requires the credential to be delivered to the subject,
so they can become a holder, and make presentations to verifiers.

This workflow is commonly referred to as credential delivery.

## Presentation Delivery

A holder will be challenged to present credentials to a verifier.

It common for the verifier to specify the details of the credentials requested along with with nonce,
to prevent replay attacks.

The holder will craft a presentation for the verifier,
possibly proving they control key material commited to be the issuer,
by signing the nonce with a public key endorsed by the issuer.

The holder will then transmit the presentation to the verifier.

The verifier will check the signature from the issuer,
the signature from the holder, and evaluate the nonce
and other time related data to determine if the presentation is valid.

## Credential Endorsement

Some holders may request a counter signature on an existing credential.

This can help convince a verifier who is not familiar with a given issuer.

## Presentation Notarization

Some holders may request a receipt from a notary when making presentations.

This can help them prove that a notary, or intermediary offering notarization
had accepted a presentaton in the past.

# Credential Formats

A credential format combines a well known and popular serialization, such as JSON or CBOR,
with a well known and popular securing capability, such as JOSE and COSE.

Different serializations offer benefits over each other, but some terminology is so consistently needed,
that we see the same concepts emerging in each content type specific securing specifications.

A good example is `iss` and `sub` which are popular in both JWT and CWT claims, and express the identifier of the issuer and the subject.

Another is `alg` which expresses the cryptographic suite associated with providing the unforgable property of a credential.

Another is `nbf` which expresses a time at which the statements made by the issuer become authoriative for the subject.

Another is `exp` which expresses a time at which the statements made by the issuer cease being auuthoritative for the subject.

Another is `cnf` which is a popular way to enable a holder to prove possession of a public key identity.

Registries such as https://www.iana.org/assignments/cwt/cwt.xhtml and https://www.iana.org/assignments/jwt/jwt.xhtml

over the ability for issuers, holders and verifiers to have unambious and well understood terminology,
but they cannot scale to express all the possible statements about the possible subjects,
in all the possible industry veriticals and contexts.

Several competing solutions to this problem have emerged over time:

1. collision-resistant-names

In JSON, it is often recommended to prefix private claim names (names that are not registered), for example:

~~~ json
{
  "iss": "joe",
  "exp": 1300819380,
  "http://example.com/is_root":true
}
~~~
{: #collision-resistant-names title="Example Collision-Resistant Name"}

In this scenario, since "is_root" is a private claim,
and there is a risk that it might not be interpretted consistently,
or that there might be collisions, since it is not registered,
it is prefixed with a URL.

2. embedding type information

The JWT BCP recomments to use explict typing to avoid similar looking tokens from being confused,
which could lead to faults in verification or processing. See {{-JWT-BCP}} section on explicit typing.

~~~ json
{
  "typ": "application/cool+jwt",
  "cty": "application/cool",
  "iss": "joe",
  "exp": 1300819380,
  "http://example.com/is_root":true
}
~~~
{: #explict-typing title="Example Explict Typing"}

3. embedding schema references

A schema language can help provide a clear, unambigious name for certain shapes of data, or certain properties of data.

In JSON, this can be accomplished with JSON Schema, or JSON-LD:

~~~ json
{
  "@context": "https://ontology.provider.example/v4346",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://example.com/product.schema.json",
  "iss": "joe",
  "exp": 1300819380,
  "http://example.com/is_root":true
}
~~~
{: #embbedded-schema title="Example Embedded Schema"}

Another solution is to leverage knowledge about the protocol to reduce the need to communicate redundant information,
for example, if unicorn-protocol only uses JWT or only uses CWT,
then signaling that a token is of these types is unnecessary.

If the protocol grows to support new types in the future, a protocol specific parameter can be used remove ambiguity,
or common solutions such as media types can be used to distinguish different kinds of statements and secure envelopes.

## CBOR Web Tokens

CBOR Web Tokens are defined in {{-CWT}} and extended to support selective disclosure in {{-SD-CWT}}.

## JSON Web Tokens

JSON Web Tokens are defined in {{-JWT}} and extended to support selective disclosure in {{-SD-JWT}}.

## CBOR Web Proofs

CBOR Web Proofs are defined in {{-JOSE-JWP}} and extended to support credentials in this specification.

## JSON Web Proofs

JSON Web Proofs are defined in {{-JOSE-JWP}} and extended to support credentials in this specification.

## Transparency Tokens

Transparency Tokens build on lessons learned from deploying JWTs, CWTs and attribute certificates.

### Opaque Payloads

A major structural difference between transparency tokens and previous token formats is the opacity of statements (the use of opaque payloads).

Opaque payloads allow for arbitrary content to be easily integrated in statements,
which enables issuers and verifiers to keep using serializations they are familar with,
instead of mapping them to a new claims structure.

For example, XML files can be signed and exchanged using JWS or COSE Sign 1 envelopes.

Because transparency tokens secure payloads that are not required to be JSON objects or CBOR Maps,
it is best to think of them as a new kind of token.

Because the payload is opaque, it is common to play all the statement metadata in the protected header.

In cases where selective disclosure or zero knowledge proofs need to be applied, this specification extends the related work to enable these capabilies over protected header metadata.

### Detached Payloads

Transparency Token also recommend support for detached payloads, this allows for easier integration with protocols that already transport well known content types, such as HTTP or file systems that support directory and file structures such as UNIX.

### Redundant Claims

In some cases, a JWT or CWT claim might be present in both the protected header and the payload.
This can lead to protocol confusion vulnerabilities.
The `typ` parameter MUST be used to distiniguish such tokens from similar looking tokens.

### Key Discovery

Editors note: consider moving out of scope.

As a general rule, any well defined `typ` values SHOULD describe the available key discovery mechanisms.

As a best practice the protected header should be the only location a verifier needs to look for hints related to discovering verification or decryption keys.

The following fields are commonly used to discovery verification material: `iss`, `kid`, `jwk`, `cnf`.

### Mutable Claims

The unprotected header provides a useful extension point, but requires careful consideration, due to the lack of built in integrity checking.

Common uses for the unprotected header include:

- adding counter signatures
- adding transparency receipts
- disclosing redacted commitments
- providing proofs of knowledge

### Entity Identifiers

JOSE and COSE have claims that are need to be text, but could be strings or URIs.

Transparency tokens do not require these fields to be URIs.

As a general preference, these fields should be a small as possible, and avoid transmitting information that is redundant to either:

1. the protocol specification (https can be ommmited when its known to be required...)
2. other protected claims (`kid` and `sub` can be relative to `iss`, if your `typ` says so...)

### Trusted Hardware

Application developers need the ability to communciate the assurances associated with a harware and software platform such as iOS and Android,
so that issuers can have confidence in the key material that digital credentials will be bound too.

In order to accomplish this, the app developer needs both RATS Evidence and a RATS Endorsement.

By presenting both evidence and endorsement associated with a private key to an issuer, the issuer can be convinced that
the digital credential store has the necessary security properties to hold high value credentials.



### Architectural Alignment

Transparency Tokens require some consistency in functionality between JOSE and COSE.

Editors note: consider focusing only on COSE.

In order to enable similar experience, while leveraging existing RFCs, the following structural changes and recommendations have been made.

In cases where a break in conventions needs to be made, Transparency Tokens prioritize CBOR / COSE over JSON / JOSE.

#### Unprotected headers

JOSE Compact and JSON serializations have been extended to support an unprotected header.

#### Claims in headers

In JOSE, JWT claims go directly in the protected header.

~~~ json
{
  "alg": "ES384",
  "iss": "vendor.example",
  "sub": "service.example"
}
~~~
{: #jose-claims-in-headers title="Example JOSE Claims in Headers"}

In COSE, CWT claims go in the CWT Claims map, which is placed inside the protected header.

~~~~ cbor-diag
{
  1: -35,                / Algorithm                     /
  13: {                  / CWT Claims                    /
    1: vendor.example,   / Issuer                        /
    2: service.example,  / Subject                       /
  },
}
~~~~
{: #cose-claims-in-headers title="Example COSE Claims in Headers"}

#### Fully Specified Algorithms

Parametric algorithms MUST NOT be used.

Algorithms MUST exist in both JOSE and COSE registries, and have the same security properties to be suitable for Transparency Tokens.

# Credential Forms

In order to be a well recognized digital credential,
there must be a specification defining the privacy and security properties of the format.

The must be a registered media type which distinguishes the format from similar formats, for example:

application/sd-jwt is different than application/jwt.

There must be at least one way of extending the well known terminology associated with the credential format,
to support industry use cases.

The core operations of issuance, presentation and verification must be defined in a specification with privacy and security considerations.

There must be clear definitions of the forms of credentials supported by the format,
and the privacy and security considerations associated with each form.

## Issued Credential

This form is produced by an issuer and delivered to a holder.

## Presented Credential

This form is prepared by a holder and delivered to a verifier.

In the simple case of credentials, this form is indistinguishable from the issued credential.

In more privacy preserving forms,
this from reveals a subset of the information commited to by the issuer,
and possibly hides the identity of the subject in the process.

# Privacy Considerations

TODO Privacy

## Collection limitation of attributes by Verifiers
## Holder consent for sending credential proofs to verifiers
## Unlinkability of credential proofs between Verifiers
## Untrackability of a credential proof by an Issuer
## Holder observability of both issued credentials and credential proofs
## Issuer anonymity among a set of Issuers

# Security Considerations

TODO Security

## Binding of an issued credential to the correct owner
## Verification by a Holder that an issued credential matches with an expected object structure
## Verification by a Verifier that a credential proof matches with a supported object structure
## Binding of a credential proof to the correct owner
## Detection of collusion attacks between individuals
## Detection of the freshness or of the validity of a credential proof by a Verifier
## Binding of a credential proof to the intended verifier
## Prevention of the forwarding of a credential proof by a verifier to another Verifier

# IANA Considerations

This document has no IANA actions.

--- back

# Examples

These examples are "JOSE-like", because thats easier to generate than "COSE-like",
however, they are designed to be easily translated to COSE.

Editors note: There are currently no examples using BBS Blind Signatures, but we plan to add some when its easy to do so.

## Presented Token with Receipts

### Protected Header

~~~ json
{
  "alg": "ES384",
  "b64": false,
  "crit": [
    "b64"
  ],
  "kid": "https://subject.example/subjects/6320cb92-fffe-4538-8c82-2ad3b6e7fbf8#QtCd_YvNG8IkhRwQUH3wNqScXzKvRyI0SPjuEy8Ms1A",
  "jwt_claims": {
    "_sd_hash_alg": "sha-256",
    "_sd_hash": "d_4N34CMEwjuBSKEFFk7GyfKQS_GPgCj_Mo2KWdOFUU",
    "iat": 1700518433,
    "aud": "https://verifier.example/transactions/b9a87c99-1fc3-4292-a324-756d680fa4cf",
    "nonce": "860fc8e5-1ed9-4f25-92ad-964c4197df15"
  }
}
~~~

### Unprotected Header

~~~ json
{
  "issued_token": "eyJhbGciOiJFUzM4NCIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il0sImtpZCI6Imh0dHBzOi8vaXNzdWVyLmV4YW1wbGUvaXNzdWVycy80ZmQ5NGY2My00ZThkLTRiYTAtOGIwOC00OTZjNjA4N2FjZjAjWm9UbmM4cXQzMU1MWk1nVHdyQnVmTWxYSXpBN1BrX2hfSmwxNmNfbmZ3YyIsInR5cCI6ImFwcGxpY2F0aW9uL2Nvb2wram9zZSIsImN0eSI6InRleHQvcGxhaW47IGNoYXJzZXQ9dXRmLTgiLCJqd3RfY2xhaW1zIjp7ImNuZiI6eyJraWQiOiJodHRwczovL3N1YmplY3QuZXhhbXBsZS9zdWJqZWN0cy82MzIwY2I5Mi1mZmZlLTQ1MzgtOGM4Mi0yYWQzYjZlN2ZiZjgjUXRDZF9Zdk5HOElraFJ3UVVIM3dOcVNjWHpLdlJ5STBTUGp1RXk4TXMxQSJ9LCJpYXQiOjE3MDA1MTg0MzMsIl9zZF9oYXNoX2FsZyI6InNoYS0yNTYiLCJpc3MiOiJodHRwczovL2lzc3Vlci5leGFtcGxlL2lzc3VlcnMvNGZkOTRmNjMtNGU4ZC00YmEwLThiMDgtNDk2YzYwODdhY2YwIiwic3ViIjoiaHR0cHM6Ly9zdWJqZWN0LmV4YW1wbGUvc3ViamVjdHMvNjMyMGNiOTItZmZmZS00NTM4LThjODItMmFkM2I2ZTdmYmY4In19.._hmFSFDpUpUsOYeF3O0o-buB6-R_2cuMu85p6NQtK3uQ8UsHolx_icHEgpDbgKv-FomxVUoCqs0GfUVmUwraor_tDEwmdteP7u2L9YpfTp95XlGWhLRMqyMMUzT563Ib~e30",
  "issued_disclosures": [],
  "receipts": [
    "eyJhbGciOiJFUzM4NCIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il0sImtpZCI6Imh0dHBzOi8vdHJhbnNwYXJlbmN5LmV4YW1wbGUvbm90YXJpZXMvNjZlOTkyNmEtYjJkNS00MjVkLTgwODUtYmEyMmVlZDMxZWYzI3V4ZU9fRlhFamh6TjlYdGFyTDZoaE04V09GV1FtakNXV2szRUhmX3JYVjQiLCJ0eXAiOiJhcHBsaWNhdGlvbi9jb29sLXJlY2VpcHQram9zZSIsImp3dF9jbGFpbXMiOnsiaWF0IjoxNzAwNTE4NDMzLCJfc2RfaGFzaF9hbGciOiJzaGEtMjU2IiwiaXNzIjoiaHR0cHM6Ly90cmFuc3BhcmVuY3kuZXhhbXBsZS9ub3Rhcmllcy82NmU5OTI2YS1iMmQ1LTQyNWQtODA4NS1iYTIyZWVkMzFlZjMiLCJzdWIiOiJodHRwczovL3RyYW5zcGFyZW5jeS5leGFtcGxlL25vdGFyaWVzLzY2ZTk5MjZhLWIyZDUtNDI1ZC04MDg1LWJhMjJlZWQzMWVmMy9yZWNlaXB0cy8yNjc0ODc0Mi0yNWQ0LTRkZWEtOGJiOC05ZTgxOTdmZDM0NzEifX0..vq1LVcsS5Uf9W4TQOXPgy2X-j8n0Gbc5jf2ZI-hlcdNHpwtZ60hYbUwa5qBCfktjVBumqXi6qgkrfLmC8uO9_RRxoPYLB-nA5-Ip5xYzjM9hQ-_bVb0c2voAfj73HM8k~eyJwcm9vZnMiOnsiaW5jbHVzaW9uIjpbIlcxMCJdfX0"
  ]
}
~~~

### JSON

~~~ text
{
  "protected": "eyJhbGciOiJFUzM4NCIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il0sImtpZCI6Imh0dHBzOi8vc3ViamVjdC5leGFtcGxlL3N1YmplY3RzLzYzMjBjYjkyLWZmZmUtNDUzOC04YzgyLTJhZDNiNmU3ZmJmOCNRdENkX1l2Tkc4SWtoUndRVUgzd05xU2NYekt2UnlJMFNQanVFeThNczFBIiwiand0X2NsYWltcyI6eyJfc2RfaGFzaF9hbGciOiJzaGEtMjU2IiwiX3NkX2hhc2giOiJkXzROMzRDTUV3anVCU0tFRkZrN0d5ZktRU19HUGdDal9NbzJLV2RPRlVVIiwiaWF0IjoxNzAwNTE4NDMzLCJhdWQiOiJodHRwczovL3ZlcmlmaWVyLmV4YW1wbGUvdHJhbnNhY3Rpb25zL2I5YTg3Yzk5LTFmYzMtNDI5Mi1hMzI0LTc1NmQ2ODBmYTRjZiIsIm5vbmNlIjoiODYwZmM4ZTUtMWVkOS00ZjI1LTkyYWQtOTY0YzQxOTdkZjE1In19",
  "unprotected": {
    "issued_token": "eyJhbGciOiJFUzM4NCIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il0sImtpZCI6Imh0dHBzOi8vaXNzdWVyLmV4YW1wbGUvaXNzdWVycy80ZmQ5NGY2My00ZThkLTRiYTAtOGIwOC00OTZjNjA4N2FjZjAjWm9UbmM4cXQzMU1MWk1nVHdyQnVmTWxYSXpBN1BrX2hfSmwxNmNfbmZ3YyIsInR5cCI6ImFwcGxpY2F0aW9uL2Nvb2wram9zZSIsImN0eSI6InRleHQvcGxhaW47IGNoYXJzZXQ9dXRmLTgiLCJqd3RfY2xhaW1zIjp7ImNuZiI6eyJraWQiOiJodHRwczovL3N1YmplY3QuZXhhbXBsZS9zdWJqZWN0cy82MzIwY2I5Mi1mZmZlLTQ1MzgtOGM4Mi0yYWQzYjZlN2ZiZjgjUXRDZF9Zdk5HOElraFJ3UVVIM3dOcVNjWHpLdlJ5STBTUGp1RXk4TXMxQSJ9LCJpYXQiOjE3MDA1MTg0MzMsIl9zZF9oYXNoX2FsZyI6InNoYS0yNTYiLCJpc3MiOiJodHRwczovL2lzc3Vlci5leGFtcGxlL2lzc3VlcnMvNGZkOTRmNjMtNGU4ZC00YmEwLThiMDgtNDk2YzYwODdhY2YwIiwic3ViIjoiaHR0cHM6Ly9zdWJqZWN0LmV4YW1wbGUvc3ViamVjdHMvNjMyMGNiOTItZmZmZS00NTM4LThjODItMmFkM2I2ZTdmYmY4In19.._hmFSFDpUpUsOYeF3O0o-buB6-R_2cuMu85p6NQtK3uQ8UsHolx_icHEgpDbgKv-FomxVUoCqs0GfUVmUwraor_tDEwmdteP7u2L9YpfTp95XlGWhLRMqyMMUzT563Ib~e30",
    "issued_disclosures": [],
    "receipts": [
      "eyJhbGciOiJFUzM4NCIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il0sImtpZCI6Imh0dHBzOi8vdHJhbnNwYXJlbmN5LmV4YW1wbGUvbm90YXJpZXMvNjZlOTkyNmEtYjJkNS00MjVkLTgwODUtYmEyMmVlZDMxZWYzI3V4ZU9fRlhFamh6TjlYdGFyTDZoaE04V09GV1FtakNXV2szRUhmX3JYVjQiLCJ0eXAiOiJhcHBsaWNhdGlvbi9jb29sLXJlY2VpcHQram9zZSIsImp3dF9jbGFpbXMiOnsiaWF0IjoxNzAwNTE4NDMzLCJfc2RfaGFzaF9hbGciOiJzaGEtMjU2IiwiaXNzIjoiaHR0cHM6Ly90cmFuc3BhcmVuY3kuZXhhbXBsZS9ub3Rhcmllcy82NmU5OTI2YS1iMmQ1LTQyNWQtODA4NS1iYTIyZWVkMzFlZjMiLCJzdWIiOiJodHRwczovL3RyYW5zcGFyZW5jeS5leGFtcGxlL25vdGFyaWVzLzY2ZTk5MjZhLWIyZDUtNDI1ZC04MDg1LWJhMjJlZWQzMWVmMy9yZWNlaXB0cy8yNjc0ODc0Mi0yNWQ0LTRkZWEtOGJiOC05ZTgxOTdmZDM0NzEifX0..vq1LVcsS5Uf9W4TQOXPgy2X-j8n0Gbc5jf2ZI-hlcdNHpwtZ60hYbUwa5qBCfktjVBumqXi6qgkrfLmC8uO9_RRxoPYLB-nA5-Ip5xYzjM9hQ-_bVb0c2voAfj73HM8k~eyJwcm9vZnMiOnsiaW5jbHVzaW9uIjpbIlcxMCJdfX0"
    ]
  },
  "payload": null,
  "signature": "3VQlvmoSwm4VYielECL38_RqkKI41XL-eS4etFpRgWUxL4UpcGE_jSEaLh4Aou0syF5Kto3F7An1QSjE6Jz3_GhmhyZvYxKiIyb8HAcuI_L4KHGs1riPSk9NO9r279i3"
}
~~~

### Compact

~~~ text
eyJhbGciOiJFUzM4NCIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il0sImtpZCI6Imh0dHBzOi8vc3ViamVjdC5leGFtcGxlL3N1YmplY3RzLzYzMjBjYjkyLWZmZmUtNDUzOC04YzgyLTJhZDNiNmU3ZmJmOCNRdENkX1l2Tkc4SWtoUndRVUgzd05xU2NYekt2UnlJMFNQanVFeThNczFBIiwiand0X2NsYWltcyI6eyJfc2RfaGFzaF9hbGciOiJzaGEtMjU2IiwiX3NkX2hhc2giOiJkXzROMzRDTUV3anVCU0tFRkZrN0d5ZktRU19HUGdDal9NbzJLV2RPRlVVIiwiaWF0IjoxNzAwNTE4NDMzLCJhdWQiOiJodHRwczovL3ZlcmlmaWVyLmV4YW1wbGUvdHJhbnNhY3Rpb25zL2I5YTg3Yzk5LTFmYzMtNDI5Mi1hMzI0LTc1NmQ2ODBmYTRjZiIsIm5vbmNlIjoiODYwZmM4ZTUtMWVkOS00ZjI1LTkyYWQtOTY0YzQxOTdkZjE1In19..3VQlvmoSwm4VYielECL38_RqkKI41XL-eS4etFpRgWUxL4UpcGE_jSEaLh4Aou0syF5Kto3F7An1QSjE6Jz3_GhmhyZvYxKiIyb8HAcuI_L4KHGs1riPSk9NO9r279i3~eyJpc3N1ZWRfdG9rZW4iOiJleUpoYkdjaU9pSkZVek00TkNJc0ltSTJOQ0k2Wm1Gc2MyVXNJbU55YVhRaU9sc2lZalkwSWwwc0ltdHBaQ0k2SW1oMGRIQnpPaTh2YVhOemRXVnlMbVY0WVcxd2JHVXZhWE56ZFdWeWN5ODBabVE1TkdZMk15MDBaVGhrTFRSaVlUQXRPR0l3T0MwME9UWmpOakE0TjJGalpqQWpXbTlVYm1NNGNYUXpNVTFNV2sxblZIZHlRblZtVFd4WVNYcEJOMUJyWDJoZlNtd3hObU5mYm1aM1l5SXNJblI1Y0NJNkltRndjR3hwWTJGMGFXOXVMMk52YjJ3cmFtOXpaU0lzSW1OMGVTSTZJblJsZUhRdmNHeGhhVzQ3SUdOb1lYSnpaWFE5ZFhSbUxUZ2lMQ0pxZDNSZlkyeGhhVzF6SWpwN0ltTnVaaUk2ZXlKcmFXUWlPaUpvZEhSd2N6b3ZMM04xWW1wbFkzUXVaWGhoYlhCc1pTOXpkV0pxWldOMGN5ODJNekl3WTJJNU1pMW1abVpsTFRRMU16Z3RPR000TWkweVlXUXpZalpsTjJaaVpqZ2pVWFJEWkY5WmRrNUhPRWxyYUZKM1VWVklNM2RPY1ZOaldIcExkbEo1U1RCVFVHcDFSWGs0VFhNeFFTSjlMQ0pwWVhRaU9qRTNNREExTVRnME16TXNJbDl6WkY5b1lYTm9YMkZzWnlJNkluTm9ZUzB5TlRZaUxDSnBjM01pT2lKb2RIUndjem92TDJsemMzVmxjaTVsZUdGdGNHeGxMMmx6YzNWbGNuTXZOR1prT1RSbU5qTXROR1U0WkMwMFltRXdMVGhpTURndE5EazJZell3T0RkaFkyWXdJaXdpYzNWaUlqb2lhSFIwY0hNNkx5OXpkV0pxWldOMExtVjRZVzF3YkdVdmMzVmlhbVZqZEhNdk5qTXlNR05pT1RJdFptWm1aUzAwTlRNNExUaGpPREl0TW1Ga00ySTJaVGRtWW1ZNEluMTkuLl9obUZTRkRwVXBVc09ZZUYzTzBvLWJ1QjYtUl8yY3VNdTg1cDZOUXRLM3VROFVzSG9seF9pY0hFZ3BEYmdLdi1Gb214VlVvQ3FzMEdmVVZtVXdyYW9yX3RERXdtZHRlUDd1Mkw5WXBmVHA5NVhsR1doTFJNcXlNTVV6VDU2M0lifmUzMCIsImlzc3VlZF9kaXNjbG9zdXJlcyI6W10sInJlY2VpcHRzIjpbImV5SmhiR2NpT2lKRlV6TTROQ0lzSW1JMk5DSTZabUZzYzJVc0ltTnlhWFFpT2xzaVlqWTBJbDBzSW10cFpDSTZJbWgwZEhCek9pOHZkSEpoYm5Od1lYSmxibU41TG1WNFlXMXdiR1V2Ym05MFlYSnBaWE12TmpabE9Ua3lObUV0WWpKa05TMDBNalZrTFRnd09EVXRZbUV5TW1WbFpETXhaV1l6STNWNFpVOWZSbGhGYW1oNlRqbFlkR0Z5VERab2FFMDRWMDlHVjFGdGFrTlhWMnN6UlVobVgzSllWalFpTENKMGVYQWlPaUpoY0hCc2FXTmhkR2x2Ymk5amIyOXNMWEpsWTJWcGNIUXJhbTl6WlNJc0ltcDNkRjlqYkdGcGJYTWlPbnNpYVdGMElqb3hOekF3TlRFNE5ETXpMQ0pmYzJSZmFHRnphRjloYkdjaU9pSnphR0V0TWpVMklpd2lhWE56SWpvaWFIUjBjSE02THk5MGNtRnVjM0JoY21WdVkza3VaWGhoYlhCc1pTOXViM1JoY21sbGN5ODJObVU1T1RJMllTMWlNbVExTFRReU5XUXRPREE0TlMxaVlUSXlaV1ZrTXpGbFpqTWlMQ0p6ZFdJaU9pSm9kSFJ3Y3pvdkwzUnlZVzV6Y0dGeVpXNWplUzVsZUdGdGNHeGxMMjV2ZEdGeWFXVnpMelkyWlRrNU1qWmhMV0l5WkRVdE5ESTFaQzA0TURnMUxXSmhNakpsWldRek1XVm1NeTl5WldObGFYQjBjeTh5TmpjME9EYzBNaTB5TldRMExUUmtaV0V0T0dKaU9DMDVaVGd4T1RkbVpETTBOekVpZlgwLi52cTFMVmNzUzVVZjlXNFRRT1hQZ3kyWC1qOG4wR2JjNWpmMlpJLWhsY2ROSHB3dFo2MGhZYlV3YTVxQkNma3RqVkJ1bXFYaTZxZ2tyZkxtQzh1TzlfUlJ4b1BZTEItbkE1LUlwNXhZempNOWhRLV9iVmIwYzJ2b0FmajczSE04a35leUp3Y205dlpuTWlPbnNpYVc1amJIVnphVzl1SWpwYklsY3hNQ0pkZlgwIl19
~~~

## Issued Token

### Protected Header

~~~ json
{
  "alg": "ES384",
  "b64": false,
  "crit": [
    "b64"
  ],
  "kid": "https://issuer.example/issuers/4fd94f63-4e8d-4ba0-8b08-496c6087acf0#ZoTnc8qt31MLZMgTwrBufMlXIzA7Pk_h_Jl16c_nfwc",
  "typ": "application/cool+jose",
  "cty": "text/plain; charset=utf-8",
  "jwt_claims": {
    "cnf": {
      "kid": "https://subject.example/subjects/6320cb92-fffe-4538-8c82-2ad3b6e7fbf8#QtCd_YvNG8IkhRwQUH3wNqScXzKvRyI0SPjuEy8Ms1A"
    },
    "iat": 1700518433,
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
  "protected": "eyJhbGciOiJFUzM4NCIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il0sImtpZCI6Imh0dHBzOi8vaXNzdWVyLmV4YW1wbGUvaXNzdWVycy80ZmQ5NGY2My00ZThkLTRiYTAtOGIwOC00OTZjNjA4N2FjZjAjWm9UbmM4cXQzMU1MWk1nVHdyQnVmTWxYSXpBN1BrX2hfSmwxNmNfbmZ3YyIsInR5cCI6ImFwcGxpY2F0aW9uL2Nvb2wram9zZSIsImN0eSI6InRleHQvcGxhaW47IGNoYXJzZXQ9dXRmLTgiLCJqd3RfY2xhaW1zIjp7ImNuZiI6eyJraWQiOiJodHRwczovL3N1YmplY3QuZXhhbXBsZS9zdWJqZWN0cy82MzIwY2I5Mi1mZmZlLTQ1MzgtOGM4Mi0yYWQzYjZlN2ZiZjgjUXRDZF9Zdk5HOElraFJ3UVVIM3dOcVNjWHpLdlJ5STBTUGp1RXk4TXMxQSJ9LCJpYXQiOjE3MDA1MTg0MzMsIl9zZF9oYXNoX2FsZyI6InNoYS0yNTYiLCJpc3MiOiJodHRwczovL2lzc3Vlci5leGFtcGxlL2lzc3VlcnMvNGZkOTRmNjMtNGU4ZC00YmEwLThiMDgtNDk2YzYwODdhY2YwIiwic3ViIjoiaHR0cHM6Ly9zdWJqZWN0LmV4YW1wbGUvc3ViamVjdHMvNjMyMGNiOTItZmZmZS00NTM4LThjODItMmFkM2I2ZTdmYmY4In19",
  "unprotected": {},
  "payload": null,
  "signature": "_hmFSFDpUpUsOYeF3O0o-buB6-R_2cuMu85p6NQtK3uQ8UsHolx_icHEgpDbgKv-FomxVUoCqs0GfUVmUwraor_tDEwmdteP7u2L9YpfTp95XlGWhLRMqyMMUzT563Ib"
}
~~~

### Compact

~~~ text
eyJhbGciOiJFUzM4NCIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il0sImtpZCI6Imh0dHBzOi8vc3ViamVjdC5leGFtcGxlL3N1YmplY3RzLzYzMjBjYjkyLWZmZmUtNDUzOC04YzgyLTJhZDNiNmU3ZmJmOCNRdENkX1l2Tkc4SWtoUndRVUgzd05xU2NYekt2UnlJMFNQanVFeThNczFBIiwiand0X2NsYWltcyI6eyJfc2RfaGFzaF9hbGciOiJzaGEtMjU2IiwiX3NkX2hhc2giOiJkXzROMzRDTUV3anVCU0tFRkZrN0d5ZktRU19HUGdDal9NbzJLV2RPRlVVIiwiaWF0IjoxNzAwNTE4NDMzLCJhdWQiOiJodHRwczovL3ZlcmlmaWVyLmV4YW1wbGUvdHJhbnNhY3Rpb25zL2I5YTg3Yzk5LTFmYzMtNDI5Mi1hMzI0LTc1NmQ2ODBmYTRjZiIsIm5vbmNlIjoiODYwZmM4ZTUtMWVkOS00ZjI1LTkyYWQtOTY0YzQxOTdkZjE1In19..3VQlvmoSwm4VYielECL38_RqkKI41XL-eS4etFpRgWUxL4UpcGE_jSEaLh4Aou0syF5Kto3F7An1QSjE6Jz3_GhmhyZvYxKiIyb8HAcuI_L4KHGs1riPSk9NO9r279i3~eyJpc3N1ZWRfdG9rZW4iOiJleUpoYkdjaU9pSkZVek00TkNJc0ltSTJOQ0k2Wm1Gc2MyVXNJbU55YVhRaU9sc2lZalkwSWwwc0ltdHBaQ0k2SW1oMGRIQnpPaTh2YVhOemRXVnlMbVY0WVcxd2JHVXZhWE56ZFdWeWN5ODBabVE1TkdZMk15MDBaVGhrTFRSaVlUQXRPR0l3T0MwME9UWmpOakE0TjJGalpqQWpXbTlVYm1NNGNYUXpNVTFNV2sxblZIZHlRblZtVFd4WVNYcEJOMUJyWDJoZlNtd3hObU5mYm1aM1l5SXNJblI1Y0NJNkltRndjR3hwWTJGMGFXOXVMMk52YjJ3cmFtOXpaU0lzSW1OMGVTSTZJblJsZUhRdmNHeGhhVzQ3SUdOb1lYSnpaWFE5ZFhSbUxUZ2lMQ0pxZDNSZlkyeGhhVzF6SWpwN0ltTnVaaUk2ZXlKcmFXUWlPaUpvZEhSd2N6b3ZMM04xWW1wbFkzUXVaWGhoYlhCc1pTOXpkV0pxWldOMGN5ODJNekl3WTJJNU1pMW1abVpsTFRRMU16Z3RPR000TWkweVlXUXpZalpsTjJaaVpqZ2pVWFJEWkY5WmRrNUhPRWxyYUZKM1VWVklNM2RPY1ZOaldIcExkbEo1U1RCVFVHcDFSWGs0VFhNeFFTSjlMQ0pwWVhRaU9qRTNNREExTVRnME16TXNJbDl6WkY5b1lYTm9YMkZzWnlJNkluTm9ZUzB5TlRZaUxDSnBjM01pT2lKb2RIUndjem92TDJsemMzVmxjaTVsZUdGdGNHeGxMMmx6YzNWbGNuTXZOR1prT1RSbU5qTXROR1U0WkMwMFltRXdMVGhpTURndE5EazJZell3T0RkaFkyWXdJaXdpYzNWaUlqb2lhSFIwY0hNNkx5OXpkV0pxWldOMExtVjRZVzF3YkdVdmMzVmlhbVZqZEhNdk5qTXlNR05pT1RJdFptWm1aUzAwTlRNNExUaGpPREl0TW1Ga00ySTJaVGRtWW1ZNEluMTkuLl9obUZTRkRwVXBVc09ZZUYzTzBvLWJ1QjYtUl8yY3VNdTg1cDZOUXRLM3VROFVzSG9seF9pY0hFZ3BEYmdLdi1Gb214VlVvQ3FzMEdmVVZtVXdyYW9yX3RERXdtZHRlUDd1Mkw5WXBmVHA5NVhsR1doTFJNcXlNTVV6VDU2M0lifmUzMCIsImlzc3VlZF9kaXNjbG9zdXJlcyI6W10sInJlY2VpcHRzIjpbImV5SmhiR2NpT2lKRlV6TTROQ0lzSW1JMk5DSTZabUZzYzJVc0ltTnlhWFFpT2xzaVlqWTBJbDBzSW10cFpDSTZJbWgwZEhCek9pOHZkSEpoYm5Od1lYSmxibU41TG1WNFlXMXdiR1V2Ym05MFlYSnBaWE12TmpabE9Ua3lObUV0WWpKa05TMDBNalZrTFRnd09EVXRZbUV5TW1WbFpETXhaV1l6STNWNFpVOWZSbGhGYW1oNlRqbFlkR0Z5VERab2FFMDRWMDlHVjFGdGFrTlhWMnN6UlVobVgzSllWalFpTENKMGVYQWlPaUpoY0hCc2FXTmhkR2x2Ymk5amIyOXNMWEpsWTJWcGNIUXJhbTl6WlNJc0ltcDNkRjlqYkdGcGJYTWlPbnNpYVdGMElqb3hOekF3TlRFNE5ETXpMQ0pmYzJSZmFHRnphRjloYkdjaU9pSnphR0V0TWpVMklpd2lhWE56SWpvaWFIUjBjSE02THk5MGNtRnVjM0JoY21WdVkza3VaWGhoYlhCc1pTOXViM1JoY21sbGN5ODJObVU1T1RJMllTMWlNbVExTFRReU5XUXRPREE0TlMxaVlUSXlaV1ZrTXpGbFpqTWlMQ0p6ZFdJaU9pSm9kSFJ3Y3pvdkwzUnlZVzV6Y0dGeVpXNWplUzVsZUdGdGNHeGxMMjV2ZEdGeWFXVnpMelkyWlRrNU1qWmhMV0l5WkRVdE5ESTFaQzA0TURnMUxXSmhNakpsWldRek1XVm1NeTl5WldObGFYQjBjeTh5TmpjME9EYzBNaTB5TldRMExUUmtaV0V0T0dKaU9DMDVaVGd4T1RkbVpETTBOekVpZlgwLi52cTFMVmNzUzVVZjlXNFRRT1hQZ3kyWC1qOG4wR2JjNWpmMlpJLWhsY2ROSHB3dFo2MGhZYlV3YTVxQkNma3RqVkJ1bXFYaTZxZ2tyZkxtQzh1TzlfUlJ4b1BZTEItbkE1LUlwNXhZempNOWhRLV9iVmIwYzJ2b0FmajczSE04a35leUp3Y205dlpuTWlPbnNpYVc1amJIVnphVzl1SWpwYklsY3hNQ0pkZlgwIl19
~~~

# Acknowledgments
{:numbered="false"}

The following individuals provided input into the final form of the document:

- Ea-nāṣir
- Nanni
- Nis Jespersen

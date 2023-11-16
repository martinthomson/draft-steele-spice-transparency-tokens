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
  I-D.ietf-oauth-sd-jwt-vc: SD-JWT-VC
  
  I-D.prorock-cose-sd-cwt: SD-CWT

informative:
  RFC4949: SEC-v2
  RFC5755: ATTRIBUTE-CERTS



--- abstract

When professionals travel for business, they carry identity documents, 
such as passports or commercial drivers licenses, 
employer related payment capabilites, 
such as corporate credit cards, or 
security keys that might be used for both personal or professional reasons,
such as hotel or car keys.

These credentials might be stored in a purse, briefcase or wallet.

Digital storage systems struggle to support the various credential formats, 
physical proximity and remote presentation protocols, 
and assurance capabilities needed to enable international business.

Device capabilities, cost and power consumption can preclude 
access and adoption of digital credentials, or exclude communities 
that require higher than normal privacy, sustainability, or availability guarantees.

This specification describes a scallable solution to digital credentials, 
that is transport agnostic, privacy oriented, 
and accountable to users of digital credentials above all other stake holders. 

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

# Diversity is a Feature

Modern paper credentials come in many different shapes and sizes, from notary stamped paper documents with wet ink signatures,
to ASN.1 and X.509 signed XML documents representing commercial invoices.

New formats are created to address the challenges and shortcoming of the formats that came before. Clay tablets were heavy, paper is easily destroyed, XML Signatures were expensive to compute and error prone, JSON while readable and writable by humans was wasteful of compute and storage when processed by machines.

CBOR stands on the shoulders of giants, having benefitted from being created last, and suffering for being less well adopted than XML and JSON.

It is natural to wish for there to be only one format, for digital credentials, as this would improve interoperability and reduce the costs associated with verifying credentials as part of business transactions, but nature does not produce discrete steps in technology deployment. Horses and automobiles shared the streets of cities in the early 19th century, and XML, ASN.1, JSON and CBOR will coexist so long as business requires them too.

There are advantages to having multiple formats for digital credentials, particular when attempting to give privacy or security benefits to users that depend on specific protocols, that are only able to handle certain credential formats. For example, OAuth and OpenID Connect tend to require JSON claimsets and JWT credential formats.

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
: An identifier representing an entity that makes statements.

statement:
: A definite or clear expression of something; 
  a judgement, opinion, attribute, predicate or proposition regarding a subject.

subject:
: An identifier representing the entity being discussed, described or attributed. 

holder:
: An identifier representing an entity which knows or possesses statements.

verifier:
: An identifer representing an entity which reviews, checks or confirms statements.

credential:
: A token (usually an unforgeable data object)
  that is a portable representation of the association between an
  identifier and a unit of authentication information, or statement
  and that can be presented by a holder.

presentation:
: The activity a holder performs when transmiting a credential to a verifier.

# Credential Roles

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

~~~~aasvg
       .----------.           .----------. 
      |   Issuer   +-------->|   Holder   |
       '----------'           '----------'
~~~~
{: #credential-roles title="Credential Roles"}



# Credential Principles 

Identification happens before we recognize threat or opportunity.

Digital credentials are tools

## Autonomy

## Confidentiality

## Anonymity

## Authenticity

## Transparency

## Accountability

# Credential Formats



# Credential Types

# Workflows

# Security Considerations

TODO Security

# IANA Considerations

This document has no IANA actions.

--- back

# Acknowledgments
{:numbered="false"}

The following individuals provided input into the final form of the document:

- Ea-nāṣir
- Nanni
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

This specification describes a scallable solution to digital credentials,
that is market friendly, transport agnostic, privacy oriented,
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

The canonical example is:

An issuer makes statements about a subject and produces an unforgable token as the issued credential.
The issuer transmits the issued credential to a holder.
A verifier requests a credential be presented.
The holder derives a presentable form of the issued credential, called the presented credential.
The holder transmits the presented credential to a verifier.

There are auxillary roles which are special cases of the issuer, holder or verifier which are common
in scenarious requiring additional assurance or confidentiality.

In cases where the issuer, or holder lacks credibility,
a countersignature or endorsement from a more reputatible entity
might be required to convince a warry verifier.

In cases where the issuer or holder might rotate verification keys frequently,
or where the issuer or holder might not be well known to a verifier,
a receipt from a notary can provide assurance to the verifier.

In cases where a holder requires untraceability or is required
to provide confidentiality regarding the provenance of a credential,
delegation with or without attenutation to intermediate, or mediators holders, may be necessary.

Notaries and mediators can leverage receipts and counter signatures to adjust the transparency,
traceability and confidentiality associated with credentials.

Giving unique and meaningful names to these roles,
allows for digital trust systems to optimize for the properties that are most needed for credential use cases.

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

## Credential Delivery

## Presentation Delivery

## Credential Endorsement

## Presentation Notarization

# Credential Formats

## CBOR Web Tokens

## JSON Web Tokens

# Credential Forms

## Issued Credential

## Presented Credential


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


import * as jose from './jose'
import { diagnose } from './diagnostic'
import { issuer } from './issuer'
import { holder } from './holder'
import { notary } from './notary'
import { endorser } from './endorser'

import * as encoding from './encoding'

export const tt = { jose, encoding, diagnose, issuer, holder, notary, endorser }

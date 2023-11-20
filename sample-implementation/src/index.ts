
import * as jose from './jose'
import { diagnose } from './diagnostic'
import { issuer } from './issuer'
import { holder } from './holder'

import * as encoding from './encoding'

export const tt = { jose, encoding, diagnose, issuer, holder }

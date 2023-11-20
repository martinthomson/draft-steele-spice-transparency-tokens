import crypto from 'crypto'

export const salter = async () => {
  return crypto.randomBytes(16);
}

export const digester = {
  name: 'sha-256' as 'sha-256',
  digest: async (data: Buffer) => {
    return crypto.createHash("sha256").update(data).digest();
  }
}
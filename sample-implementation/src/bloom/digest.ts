import jsSHA from "jssha";

const sha256 = (data: Buffer) => {
  const shaObj = new jsSHA("SHA-256", "ARRAYBUFFER");
  shaObj.update(data)
  const hash = shaObj.getHash("HEX");
  return hash
}

export const digest = { sha256 }
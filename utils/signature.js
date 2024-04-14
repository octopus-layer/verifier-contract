const nacl = require('tweetnacl');
const naclUtil = require('tweetnacl-util');

export function verify(message, signature, publicKey) {
  const decodedMessage = naclUtil.decodeUTF8(message);
  const decodedSignature = naclUtil.decodeBase64(signature);
  const decodedPublicKey = naclUtil.decodeBase64(publicKey);

  return nacl.sign.detached.verify(
    decodedMessage,
    decodedSignature,
    decodedPublicKey
  );
};

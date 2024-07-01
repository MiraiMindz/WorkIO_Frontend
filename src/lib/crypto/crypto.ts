import * as forge from "node-forge";

export function LoadPrivateRSAKey(keyPEM: string, password?: string): forge.pki.rsa.PrivateKey {
    const rsaPrivateKey = forge.pki.decryptRsaPrivateKey(keyPEM, password);
    return rsaPrivateKey;
}

export function LoadPublicRSAKey(keyPEM: string): forge.pki.rsa.PublicKey {
    const rsaPrivateKey = forge.pki.publicKeyFromPem(keyPEM);
    return rsaPrivateKey;
}

export function Encrypt(publicKey: forge.pki.rsa.PublicKey, data: string): string {
    const encryptedData: string = publicKey.encrypt(data, 'RSA-OAEP', {md: forge.md.sha512.create()});
    return encryptedData;
}

export function Decrypt(privateKey: forge.pki.rsa.PrivateKey, encryptedData: string): string {
    const decryptedData: string = privateKey.decrypt(encryptedData, 'RSA-OAEP', {md: forge.md.sha512.create()});
    return decryptedData;
}

export function Base64Decode(data: string): string {
    const encoded: string = forge.util.decode64(data);
    return encoded;
}

export function Base64Encode(data: string): string {
    const encoded: string = forge.util.encode64(data);
    return encoded;
}


export function DecryptFromEncryptTo(privateKey: forge.pki.rsa.PrivateKey, publicKey: forge.pki.rsa.PublicKey, data: string): string {
    const decryptedData: string = Decrypt(privateKey, data)
    const encryptedData: string = Encrypt(publicKey, decryptedData)
    return encryptedData
}

export function DecodeDecrypt(privateKey: forge.pki.rsa.PrivateKey, data: string): string {
    const decodedData: string = Base64Decode(data)
    const decryptedData: string = Decrypt(privateKey, decodedData)
    return decryptedData
}

export function EncryptEncode(publicKey: forge.pki.rsa.PublicKey, data: string): string {
    const encryptedData: string = Encrypt(publicKey, data)
    const encodedData: string = Base64Encode(encryptedData)
    return encodedData
}

export function DecodeDecryptFromEncryptEncodeTo(privateKey: forge.pki.rsa.PrivateKey, publicKey: forge.pki.rsa.PublicKey, data: string): string {
    const decryptedDecodedData: string = DecodeDecrypt(privateKey, data)
    const encryptedEncodedData: string = EncryptEncode(publicKey, decryptedDecodedData)
    return encryptedEncodedData
}
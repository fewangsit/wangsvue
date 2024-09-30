declare module 'check/*' {}
declare module '*.lottie' {}
declare module 'base64toblob' {
  function base64ToBlob(base64: any, mime: any): Blob;
  export = base64ToBlob;
}

declare module 'qrcode' {
  const qrcode: any;
  export = qrcode;
}

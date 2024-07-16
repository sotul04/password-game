export default function arrayBufferToUrl(buffer, contentType) {
    const uint8Array = new Uint8Array(buffer);
    const blob = new Blob([uint8Array], { type: contentType });
    return URL.createObjectURL(blob);
}
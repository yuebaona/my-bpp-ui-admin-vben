import { Base64 } from 'js-base64';

export function handlePreview(row: any) {
  window.open(
    `http://10.15.78.1:8012/onlinePreview?url=${encodeURIComponent(Base64.encode(row.filePath))}`,
  );
}

import { QRCode } from 'qrcode.react';

export default function ResponsiveQRCode() {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <QRCode
        value="https://example.com"
        renderAs="svg"
        size={256} // controls viewBox, but you can scale with CSS
        style={{ width: '100%', height: 'auto' }}
      />
    </div>
  );
}

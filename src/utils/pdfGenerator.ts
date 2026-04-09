import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import type { PayStub } from '../types';

function formatMoney(amount: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
  }).format(amount);
}

function buildHtml(payStub: PayStub, userName: string, empresa: string): string {
  const haberesRows = payStub.haberes
    .map(
      (h) => `
      <tr>
        <td class="label">${h.label}</td>
        <td class="amount haber">${formatMoney(h.amount)}</td>
      </tr>`,
    )
    .join('');

  const descuentosRows = payStub.descuentos
    .map(
      (d) => `
      <tr>
        <td class="label">${d.label}</td>
        <td class="amount descuento">${formatMoney(d.amount)}</td>
      </tr>`,
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Recibo de Haberes — ${payStub.period}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      background: #060A14;
      color: #E8ECF4;
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 13px;
      padding: 32px;
    }

    .page {
      max-width: 680px;
      margin: 0 auto;
      background: #0F1420;
      border: 1px solid #2A1F14;
      border-radius: 12px;
      overflow: hidden;
    }

    /* Header */
    .header {
      background: #0A0E1A;
      border-bottom: 2px solid #C87533;
      padding: 24px 28px;
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .logo {
      width: 48px;
      height: 48px;
      border-radius: 8px;
      background: #1A1008;
      border: 1px solid #C87533;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      font-weight: 700;
      color: #C87533;
      flex-shrink: 0;
    }

    .header-text h1 {
      font-size: 18px;
      font-weight: 700;
      color: #E8ECF4;
    }

    .header-text p {
      font-size: 11px;
      color: #6B7A99;
      margin-top: 2px;
    }

    .badge {
      margin-left: auto;
      background: #1A1008;
      border: 1px solid #C87533;
      color: #C87533;
      font-size: 11px;
      font-weight: 600;
      padding: 4px 12px;
      border-radius: 20px;
    }

    /* Info grid */
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1px;
      background: #1A2035;
      border-bottom: 1px solid #1A2035;
    }

    .info-cell {
      background: #0F1420;
      padding: 16px 28px;
    }

    .info-cell.full {
      grid-column: 1 / -1;
    }

    .info-label {
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #6B7A99;
      margin-bottom: 4px;
    }

    .info-value {
      font-size: 14px;
      font-weight: 600;
      color: #E8ECF4;
    }

    .info-value.copper { color: #C87533; }

    /* Table */
    .section {
      padding: 20px 28px;
      border-bottom: 1px solid #1A2035;
    }

    .section-title {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: 1px solid #1A2035;
    }

    .section-title.haber { color: #34D399; }
    .section-title.descuento { color: #F87171; }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    tr { border-bottom: 1px solid #0F1420; }
    tr:last-child { border-bottom: none; }

    td {
      padding: 8px 4px;
      vertical-align: middle;
    }

    td.label { color: #A8B4CC; font-size: 12px; }

    td.amount {
      text-align: right;
      font-family: 'Courier New', Courier, monospace;
      font-size: 12px;
      font-weight: 600;
    }

    td.amount.haber { color: #34D399; }
    td.amount.descuento { color: #F87171; }

    .subtotal-row td {
      padding-top: 12px;
      border-top: 1px solid #1A2035;
      font-size: 12px;
      color: #6B7A99;
    }

    .subtotal-row td.amount { font-size: 13px; }

    /* Neto */
    .neto-section {
      padding: 20px 28px;
      background: #0A0E1A;
      border-top: 2px solid #C87533;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .neto-label {
      font-size: 13px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #C87533;
    }

    .neto-amount {
      font-family: 'Courier New', Courier, monospace;
      font-size: 26px;
      font-weight: 700;
      color: #C87533;
    }

    /* Footer */
    .footer {
      text-align: center;
      padding: 14px 28px;
      font-size: 10px;
      color: #3A4A6B;
      border-top: 1px solid #1A2035;
    }
  </style>
</head>
<body>
  <div class="page">

    <div class="header">
      <div class="logo">${empresa.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()}</div>
      <div class="header-text">
        <h1>${empresa}</h1>
        <p>Recibo de Haberes</p>
      </div>
      <div class="badge">ORIGINAL</div>
    </div>

    <div class="info-grid">
      <div class="info-cell">
        <div class="info-label">Empleado</div>
        <div class="info-value">${userName}</div>
      </div>
      <div class="info-cell">
        <div class="info-label">Periodo</div>
        <div class="info-value copper">${payStub.period}</div>
      </div>
      <div class="info-cell">
        <div class="info-label">Fecha de Pago</div>
        <div class="info-value">${payStub.paidDate}</div>
      </div>
      <div class="info-cell">
        <div class="info-label">Mes</div>
        <div class="info-value">${payStub.month} ${payStub.year}</div>
      </div>
    </div>

    <div class="section">
      <div class="section-title haber">Haberes</div>
      <table>
        ${haberesRows}
        <tr class="subtotal-row">
          <td class="label">Total Haberes</td>
          <td class="amount haber">+ ${formatMoney(payStub.totalHaberes)}</td>
        </tr>
      </table>
    </div>

    <div class="section">
      <div class="section-title descuento">Descuentos</div>
      <table>
        ${descuentosRows}
        <tr class="subtotal-row">
          <td class="label">Total Descuentos</td>
          <td class="amount descuento">- ${formatMoney(payStub.totalDescuentos)}</td>
        </tr>
      </table>
    </div>

    <div class="neto-section">
      <div class="neto-label">Neto a Cobrar</div>
      <div class="neto-amount">${formatMoney(payStub.neto)}</div>
    </div>

    <div class="footer">
      MineralWallet · Recibo generado digitalmente · ${new Date().toLocaleDateString('es-AR')}
    </div>

  </div>
</body>
</html>`;
}

export async function generatePayStubPdf(
  payStub: PayStub,
  userName: string,
  empresa: string,
): Promise<string> {
  const html = buildHtml(payStub, userName, empresa);
  const { uri } = await Print.printToFileAsync({ html, base64: false });
  return uri;
}

export async function sharePayStubPdf(
  payStub: PayStub,
  userName: string,
  empresa: string,
): Promise<void> {
  const uri = await generatePayStubPdf(payStub, userName, empresa);
  const canShare = await Sharing.isAvailableAsync();
  if (canShare) {
    await Sharing.shareAsync(uri, {
      mimeType: 'application/pdf',
      dialogTitle: `Recibo ${payStub.period} — ${userName}`,
      UTI: 'com.adobe.pdf',
    });
  }
}

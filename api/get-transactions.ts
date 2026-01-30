import { google } from 'googleapis';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const SHEET_ID = process.env.SHEET_ID!;
const CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL!;
const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, '\n');

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  try {
    const auth = new google.auth.JWT(
      CLIENT_EMAIL,
      undefined,
      PRIVATE_KEY,
      ['https://www.googleapis.com/auth/spreadsheets']
    );

    const sheets = google.sheets({ version: 'v4', auth });

    const result = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: 'Transactions!A2:C',
    });

    const rows = result.data.values || [];

    const transactions = rows.map(r => ({
      date: r[0],
      category: r[1],
      amount: Number(r[2]) || 0,
    }));

    res.status(200).json(transactions);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

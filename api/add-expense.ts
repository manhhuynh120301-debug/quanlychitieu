import { google } from "googleapis"
import type { VercelRequest, VercelResponse } from "@vercel/node"

const SHEET_ID = process.env.GOOGLE_SHEET_ID
const CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL
const RAW_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY

if (!SHEET_ID || !CLIENT_EMAIL || !RAW_PRIVATE_KEY) {
  throw new Error("Missing Google Sheets environment variables")
}

const PRIVATE_KEY = RAW_PRIVATE_KEY.replace(/\\n/g, "\n")

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    const { category, amount } = req.body

    if (!category || !amount) {
      return res.status(400).json({ error: "Missing category or amount" })
    }

    const auth = new google.auth.JWT(
      CLIENT_EMAIL,
      undefined,
      PRIVATE_KEY,
      ["https://www.googleapis.com/auth/spreadsheets"]
    )

    const sheets = google.sheets({ version: "v4", auth })

    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: "Transactions!A:C",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[new Date().toISOString(), category, amount]],
      },
    })

    return res.status(200).json({ success: true })
  } catch (error: any) {
    console.error(error)
    return res.status(500).json({ error: error.message })
  }
}

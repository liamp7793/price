import { google } from "googleapis";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
    if (req.method !== "GET") return res.status(405).end();

    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    try {
        const { role } = jwt.verify(token, process.env.JWT_SECRET);

        const auth = new google.auth.JWT(
            process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            null,
            process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
            ["https://www.googleapis.com/auth/spreadsheets.readonly"]
        );

        const response = await google.sheets({ version: "v4", auth }).spreadsheets.values.get({
            spreadsheetId: process.env.GOOGLE_SHEETS_ID,
            range: "Cameras!A2:C",
        });

        const cameras = response.data.values || [];
        return res.status(200).json({ cameras });

    } catch (error) {
        return res.status(403).json({ error: "Access denied" });
    }
}

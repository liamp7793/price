import { google } from "googleapis";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const sheets = google.sheets({ version: "v4" });

export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).end();

    const { email, password } = req.body;
    const auth = new google.auth.JWT(
        process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        null,
        process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
        ["https://www.googleapis.com/auth/spreadsheets.readonly"]
    );

    try {
        const response = await sheets.spreadsheets.values.get({
            auth,
            spreadsheetId: process.env.GOOGLE_SHEETS_ID,
            range: "Users!A2:C",
        });

        const users = response.data.values || [];
        const user = users.find(u => u[0] === email);

        if (!user) return res.status(401).json({ error: "User not found" });

        const [storedEmail, storedPassword, role] = user;

        const passwordMatch = await bcrypt.compare(password, storedPassword);
        if (!passwordMatch) return res.status(401).json({ error: "Invalid credentials" });

        const token = jwt.sign({ email, role }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.setHeader("Set-Cookie", `token=${token}; HttpOnly; Path=/; Max-Age=3600`);
        return res.status(200).json({ message: "Login successful", role });

    } catch (error) {
        return res.status(500).json({ error: "Authentication failed" });
    }
}

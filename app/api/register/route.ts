import { NextResponse } from "next/server";
import * as QRCode from "qrcode";
import nodemailer from "nodemailer";
import { google } from "googleapis";

export async function POST(req: Request) {
  try {
    const { name, email, count } = await req.json();

    /* =========================
       1️⃣ GENERATE QR CODE
    ========================= */
    const payload = JSON.stringify({
      name,
      email,
      count,
      event: "NOVA",
      issuedAt: Date.now(),
    });

    const qrImage = await QRCode.toDataURL(payload);

    /* =========================
       2️⃣ SEND EMAIL (QR INLINE)
    ========================= */
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.verify();

    await transporter.sendMail({
      from: `NOVA Event <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your NOVA Entry QR Code",
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Welcome to NOVA</h2>
          <p>Hi ${name},</p>
          <p>Please show this QR code at the entrance.</p>
          <img src="cid:novaqr" style="max-width:240px"/>
        </div>
      `,
      attachments: [
        {
          filename: "nova-qr.png",
          content: qrImage.split(",")[1],
          encoding: "base64",
          cid: "novaqr",
        },
      ],
    });

    /* =========================
       3️⃣ GOOGLE SHEETS (FIXED)
    ========================= */
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({
      version: "v4",
      auth,
    });

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEETS_ID,
      range: "A:D",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[
          name,
          email,
          count,
          new Date().toLocaleString(),
        ]],
      },
    });

    console.log("LOGGED TO SHEETS:", email);

    /* =========================
       4️⃣ RESPONSE
    ========================= */
    return NextResponse.json({
      message: "Registration successful. Check your email for the QR code.",
    });

  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return NextResponse.json(
      { message: "Something went wrong during registration." },
      { status: 500 }
    );
  }
}

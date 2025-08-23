import { NextResponse } from "next/server";
import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

export async function POST(request: Request) {
  const { idToken } = await request.json();
  const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
  try {
    const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn });
    const response = NextResponse.json({ status: "success" });
    response.cookies.set("session", sessionCookie, {
      httpOnly: true,
      secure: true,
      maxAge: expiresIn / 1000,
      path: "/",
    });
    return response;
  } catch (error) {
    let message = "Unknown error";
    if (error instanceof Error) {
      message = error.message;
    }
    return NextResponse.json({ status: "error", error: message }, { status: 401 });
  }
}

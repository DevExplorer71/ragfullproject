import { NextResponse } from "next/server";
import admin from "firebase-admin";

if (!admin.apps.length) {
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT) : undefined;
  if (!serviceAccount) {
    throw new Error('Missing FIREBASE_SERVICE_ACCOUNT environment variable');
  }
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
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

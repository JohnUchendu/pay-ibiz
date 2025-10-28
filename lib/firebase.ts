import { initializeApp } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';

const app = initializeApp({
  credential: {
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  }
});

export async function sendPush(userId: string, message: string) {
  const { data: profile } = await supabaseAdmin.from('profiles').select('push_token').eq('id', userId).single();
  if (!profile?.push_token) return;

  await getMessaging(app).send({
    token: profile.push_token,
    notification: { title: 'Payment!', body: message },
  });
}
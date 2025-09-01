// Accepts a POST { idToken, rememberMe }
// Verifies Google ID token and signs user in (creates user if not exists, with provider: 'google')


import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { OAuth2Client } from 'google-auth-library';
import { signToken } from '@/utils/jwt';


const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


export default async function handler(req, res) {
if (req.method !== 'POST') return res.status(405).end();
const { idToken, rememberMe = false } = req.body || {};
if (!idToken) return res.status(400).json({ error: 'idToken required' });


try {
const ticket = await client.verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID });
const payload = ticket.getPayload();
const { email, sub: googleId, name } = payload || {};
if (!email) return res.status(400).json({ error: 'Google token has no email' });


await dbConnect();
let user = await User.findOne({ email });
if (!user) {
user = await User.create({ fullName: name, email, provider: 'google', googleId });
} else if (user.provider !== 'google') {
// user previously registered via email OTP
// depending on your business logic you might want to link accounts; for now we block duplicate
// Or you could set provider to 'mixed'. Here we just allow login if emails match.
}


const token = signToken({ id: user._id }, rememberMe);
return res.status(200).json({ ok: true, token, user: { id: user._id, email: user.email, fullName: user.fullName } });
} catch (err) {
console.error('google verify error', err);
return res.status(400).json({ error: 'Invalid Google token' });
}
}
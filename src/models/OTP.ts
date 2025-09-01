import mongoose from 'mongoose';


const OTPSchema = new mongoose.Schema({
email: { type: String, required: true, index: true },
code: { type: String, required: true },
expiresAt: { type: Date, required: true },
purpose: { type: String, enum: ['login', 'signup'], default: 'login' },
attempts: { type: Number, default: 0 },
resendCount: { type: Number, default: 0 }
});


OTPSchema.index({ email: 1, purpose: 1 });


export default mongoose.models.OTP || mongoose.model('OTP', OTPSchema);
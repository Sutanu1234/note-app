import mongoose from 'mongoose';


const UserSchema = new mongoose.Schema({
fullName: { type: String },
dob: { type: Date },
email: { type: String, required: true, unique: true, index: true },
provider: { type: String, enum: ['email', 'google'], default: 'email' },
googleId: { type: String },
createdAt: { type: Date, default: Date.now }
});


export default mongoose.models.User || mongoose.model('User', UserSchema);
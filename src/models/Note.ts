import mongoose from 'mongoose';


const NoteSchema = new mongoose.Schema({
owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
title: { type: String, required: true },
content: { type: String, default: '' },
createdAt: { type: Date, default: Date.now },
updatedAt: { type: Date, default: Date.now }
});


NoteSchema.pre('save', function(next) {
this.updatedAt = new Date();
next();
});


export default mongoose.models.Note || mongoose.model('Note', NoteSchema);
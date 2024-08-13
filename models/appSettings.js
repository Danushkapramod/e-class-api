import mongoose from 'mongoose';

const statusOptionsDefault = [
    { option: 'paid', color: '#22c55e' },
    { option: 'unpaid', color: '#f97316' },
    { option: 'half', color: '#0ea5e9' },
    { option: 'free', color: '#64748b' }
]
export const appSettingsSchema = new mongoose.Schema({
    students: {
        statusOptions: {
            type: [{
                option: {
                    type: String,
                    lowercase: true
                },
                color: String
            }],
            default:statusOptionsDefault
        }
    }
});



appSettingsSchema.methods.statusOptionsDefault =  async function(){
    this.students.statusOptions = statusOptionsDefault
    await this.save()
}
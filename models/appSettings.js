import mongoose from 'mongoose';
import { type } from 'os';

const statusOptionsDefault = [
    { option: 'paid', color: '#22c55e' },
    { option: 'unpaid', color: '#f97316' },
    { option: 'half', color: '#0ea5e9' },
    { option: 'free', color: '#64748b' }
]

const permisions = {
    default: ['Create Student', 'Update Student','Delete Student',
             'Confirm Attendence', 'Confirm Payment'],

    all: ['Create', 'Update','Delete','Create Class' ,'Create Student', 
        'Create Teacher','Update Student', 'Confirm Attendence', 'Confirm Payment',
    ]         
}

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
            default: statusOptionsDefault
        }
    },
    user: {
        permisions: {
            type: {
             default : [String],
             all: [String]   
            },
            default: permisions
        }
    }
});



appSettingsSchema.methods.statusOptionsDefault =  async function(){
    this.students.statusOptions = statusOptionsDefault
    await this.save()
}
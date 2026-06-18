import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema(
  {
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true, index: true },
    employeeCode: { type: String, required: true, trim: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    department: { type: String, required: true, trim: true },
    position: { type: String, required: true, trim: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    hireDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

employeeSchema.index({ tenantId: 1, employeeCode: 1 }, { unique: true });
employeeSchema.index({ tenantId: 1, email: 1 });

employeeSchema.virtual('fullName').get(function getFullName() {
  return `${this.firstName} ${this.lastName}`;
});

employeeSchema.set('toJSON', { virtuals: true });

export const Employee = mongoose.model('Employee', employeeSchema);

import mongoose from 'mongoose';

const payrollSchema = new mongoose.Schema(
  {
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true, index: true },
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true, index: true },
    payPeriod: { type: String, required: true, trim: true },
    baseSalary: { type: Number, required: true, min: 0 },
    bonus: { type: Number, default: 0, min: 0 },
    deductions: { type: Number, default: 0, min: 0 },
    netPay: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ['draft', 'processed', 'paid'], default: 'processed' },
    processedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

payrollSchema.index({ tenantId: 1, employeeId: 1, payPeriod: 1 }, { unique: true });

export const Payroll = mongoose.model('Payroll', payrollSchema);

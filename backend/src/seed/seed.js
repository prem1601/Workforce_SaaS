import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Tenant } from '../models/Tenant.js';
import { User } from '../models/User.js';
import { Employee } from '../models/Employee.js';
import { Payroll } from '../models/Payroll.js';
import { RefreshToken } from '../models/RefreshToken.js';
import { ROLES } from '../constants/roles.js';

dotenv.config();

const DEMO_PASSWORD = 'Demo@123';

const departments = ['Engineering', 'HR', 'Finance', 'Operations', 'Sales'];
const positions = ['Developer', 'Manager', 'Analyst', 'Coordinator', 'Lead'];

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function seedEmployees(tenantId, prefix, count) {
  const employees = [];
  for (let i = 1; i <= count; i += 1) {
    const employee = await Employee.create({
      tenantId,
      employeeCode: `${prefix}-${String(i).padStart(3, '0')}`,
      firstName: `Employee${i}`,
      lastName: prefix,
      email: `${prefix.toLowerCase()}${i}@example.com`,
      department: randomFrom(departments),
      position: randomFrom(positions),
      status: 'active',
    });
    employees.push(employee);
  }
  return employees;
}

async function seedPayroll(tenantId, employees) {
  const periods = ['2025-10', '2025-11', '2025-12', '2026-01'];
  for (const employee of employees.slice(0, 20)) {
    for (const payPeriod of periods) {
      const baseSalary = 50000 + Math.floor(Math.random() * 30000);
      const bonus = Math.floor(Math.random() * 5000);
      const deductions = Math.floor(Math.random() * 3000);
      await Payroll.create({
        tenantId,
        employeeId: employee._id,
        payPeriod,
        baseSalary,
        bonus,
        deductions,
        netPay: baseSalary + bonus - deductions,
        status: 'processed',
      });
    }
  }
}

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB for seeding...');

  await Promise.all([
    RefreshToken.deleteMany({}),
    Payroll.deleteMany({}),
    Employee.deleteMany({}),
    User.deleteMany({}),
    Tenant.deleteMany({}),
  ]);

  const acme = await Tenant.create({ name: 'Acme Corp', slug: 'acme' });
  const beta = await Tenant.create({ name: 'Beta Inc', slug: 'beta' });

  const acmeEmployees = await seedEmployees(acme._id, 'ACME', 120);
  const betaEmployees = await seedEmployees(beta._id, 'BETA', 80);

  await seedPayroll(acme._id, acmeEmployees);
  await seedPayroll(beta._id, betaEmployees);

  const acmeEmpUser = await User.create({
    email: 'emp@acme.com',
    password: DEMO_PASSWORD,
    name: 'Acme Employee',
    role: ROLES.EMPLOYEE,
    tenantId: acme._id,
    employeeId: acmeEmployees[0]._id,
  });

  await User.create([
    {
      email: 'admin@acme.com',
      password: DEMO_PASSWORD,
      name: 'Acme Admin',
      role: ROLES.TENANT_ADMIN,
      tenantId: acme._id,
    },
    {
      email: 'hr@acme.com',
      password: DEMO_PASSWORD,
      name: 'Acme HR Manager',
      role: ROLES.HR_MANAGER,
      tenantId: acme._id,
    },
    acmeEmpUser,
    {
      email: 'admin@beta.com',
      password: DEMO_PASSWORD,
      name: 'Beta Admin',
      role: ROLES.TENANT_ADMIN,
      tenantId: beta._id,
    },
  ]);

  console.log('Seed completed successfully!');
  console.log('\nDemo accounts (password: Demo@123):');
  console.log('  admin@acme.com  (tenant: acme) - tenant_admin');
  console.log('  hr@acme.com     (tenant: acme) - hr_manager');
  console.log('  emp@acme.com    (tenant: acme) - employee');
  console.log('  admin@beta.com  (tenant: beta) - tenant_admin');

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});

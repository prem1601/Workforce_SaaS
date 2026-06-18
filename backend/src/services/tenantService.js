import { Tenant } from '../models/Tenant.js';

export async function listTenants() {
  return Tenant.find({ isActive: true }).select('name slug createdAt');
}

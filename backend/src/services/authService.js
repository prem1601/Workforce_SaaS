import crypto from 'crypto';
import { User } from '../models/User.js';
import { Tenant } from '../models/Tenant.js';
import { RefreshToken } from '../models/RefreshToken.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt.js';
import { ApiError } from '../utils/ApiError.js';
import { ROLE_PERMISSIONS } from '../constants/permissions.js';

function buildAuthPayload(user) {
  const tenantId = user.tenantId._id || user.tenantId;
  return {
    userId: user._id.toString(),
    tenantId: tenantId.toString(),
    role: user.role,
    email: user.email,
    name: user.name,
    permissions: ROLE_PERMISSIONS[user.role] || [],
    tenantName: user.tenantId?.name || null,
    employeeId: user.employeeId?.toString() || null,
  };
}

function formatUserResponse(user) {
  const tenantId = user.tenantId._id || user.tenantId;
  return {
    id: user._id,
    email: user.email,
    name: user.name,
    role: user.role,
    tenantId,
    tenantName: user.tenantId?.name || null,
    employeeId: user.employeeId,
    permissions: ROLE_PERMISSIONS[user.role] || [],
  };
}

async function storeRefreshToken(user, token) {
  const decoded = verifyRefreshToken(token);
  await RefreshToken.create({
    userId: user._id,
    tenantId: user.tenantId._id || user.tenantId,
    token,
    expiresAt: new Date(decoded.exp * 1000),
  });
}

export async function registerUser({ email, password, name, role, tenantSlug }) {
  const tenant = await Tenant.findOne({ slug: tenantSlug });
  if (!tenant) {
    throw new ApiError(404, 'Tenant not found');
  }

  const existing = await User.findOne({ email, tenantId: tenant._id });
  if (existing) {
    throw new ApiError(409, 'User already exists for this tenant');
  }

  const user = await User.create({
    email,
    password,
    name,
    role,
    tenantId: tenant._id,
  });

  await user.populate('tenantId', 'name slug');
  return formatUserResponse(user);
}

export async function loginUser({ email, password, tenantSlug }) {
  const tenant = await Tenant.findOne({ slug: tenantSlug });
  if (!tenant) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const user = await User.findOne({ email, tenantId: tenant._id }).populate('tenantId', 'name slug');
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const payload = buildAuthPayload(user);
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken({ userId: user._id.toString(), tokenId: crypto.randomUUID() });

  await storeRefreshToken(user, refreshToken);

  return {
    user: formatUserResponse(user),
    accessToken,
    refreshToken,
  };
}

export async function refreshAccessToken(refreshToken) {
  if (!refreshToken) {
    throw new ApiError(401, 'Refresh token required');
  }

  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch {
    throw new ApiError(401, 'Invalid refresh token');
  }

  const stored = await RefreshToken.findOne({ token: refreshToken, revokedAt: null });
  if (!stored) {
    throw new ApiError(401, 'Refresh token revoked or not found');
  }

  const user = await User.findById(decoded.userId).populate('tenantId', 'name slug');
  if (!user || !user.isActive) {
    throw new ApiError(401, 'User not found');
  }

  stored.revokedAt = new Date();
  await stored.save();

  const payload = buildAuthPayload(user);
  const newAccessToken = signAccessToken(payload);
  const newRefreshToken = signRefreshToken({ userId: user._id.toString(), tokenId: crypto.randomUUID() });
  await storeRefreshToken(user, newRefreshToken);

  return {
    user: formatUserResponse(user),
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
}

export async function logoutUser(refreshToken) {
  if (!refreshToken) return;
  await RefreshToken.findOneAndUpdate({ token: refreshToken }, { revokedAt: new Date() });
}

export async function getCurrentUser(userId) {
  const user = await User.findById(userId).populate('tenantId', 'name slug');
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  return formatUserResponse(user);
}

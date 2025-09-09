// TypeScript interfaces for the bank security monitoring system

export interface Device {
  id: string;
  name: string;
  type: 'ATM' | 'POS' | 'Security Camera' | 'Server' | 'Network Switch';
  status: 'online' | 'offline';
  lastActive: string;
  location?: string;
  ipAddress?: string;
  version?: string;
}

export interface Branch {
  id: string;
  name: string;
  code: string;
  address: string;
  manager: string;
  devices: Device[];
}

export interface RO {
  id: string;
  name: string;
  code: string;
  manager: string;
  branches: Branch[];
}

export interface NBG {
  id: string;
  name: string;
  code: string;
  manager: string;
  ros: RO[];
}

export interface Zone {
  id: string;
  name: string;
  code: string;
  manager: string;
  branches?: Branch[]; // For SBI direct structure
  nbgs?: NBG[]; // For Indian Bank structure
}

export interface Bank {
  id: string;
  name: string;
  type: 'SBI' | 'Indian Bank';
  zones: Zone[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  lastLogin: string;
  permissions: string[];
}

export interface DashboardSummary {
  totalDevices: number;
  onlineDevices: number;
  offlineDevices: number;
  totalBranches: number;
  totalUsers: number;
  lastUpdated: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
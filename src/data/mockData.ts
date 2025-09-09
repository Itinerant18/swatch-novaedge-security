import { Bank, Device, Branch, Zone, NBG, RO, User, DashboardSummary } from '../types';

// Mock devices data
const createMockDevices = (branchCode: string): Device[] => [
  {
    id: `${branchCode}-atm-001`,
    name: 'ATM Terminal 1',
    type: 'ATM',
    status: Math.random() > 0.2 ? 'online' : 'offline',
    lastActive: new Date(Date.now() - Math.random() * 86400000).toISOString(),
    location: 'Main Entrance',
    ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    version: '2.1.4'
  },
  {
    id: `${branchCode}-pos-001`,
    name: 'POS Terminal 1',
    type: 'POS',
    status: Math.random() > 0.15 ? 'online' : 'offline',
    lastActive: new Date(Date.now() - Math.random() * 86400000).toISOString(),
    location: 'Counter 1',
    ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    version: '1.8.2'
  },
  {
    id: `${branchCode}-cam-001`,
    name: 'Security Camera 1',
    type: 'Security Camera',
    status: Math.random() > 0.1 ? 'online' : 'offline',
    lastActive: new Date(Date.now() - Math.random() * 86400000).toISOString(),
    location: 'Main Hall',
    ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    version: '3.2.1'
  },
  {
    id: `${branchCode}-srv-001`,
    name: 'Branch Server',
    type: 'Server',
    status: Math.random() > 0.05 ? 'online' : 'offline',
    lastActive: new Date(Date.now() - Math.random() * 86400000).toISOString(),
    location: 'Server Room',
    ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    version: '4.5.0'
  }
];

// SBI Bank Structure
const sbiZones: Zone[] = [
  {
    id: 'sbi-z1',
    name: 'Mumbai Zone',
    code: 'MZ',
    manager: 'Rajesh Kumar',
    branches: [
      {
        id: 'sbi-b1',
        name: 'Andheri West Branch',
        code: 'SBIN0001234',
        address: '123 Andheri West, Mumbai - 400058',
        manager: 'Priya Sharma',
        devices: createMockDevices('SBIN0001234')
      },
      {
        id: 'sbi-b2',
        name: 'Bandra Branch',
        code: 'SBIN0001235',
        address: '456 Bandra, Mumbai - 400050',
        manager: 'Amit Patel',
        devices: createMockDevices('SBIN0001235')
      },
      {
        id: 'sbi-b3',
        name: 'Powai Branch',
        code: 'SBIN0001236',
        address: '789 Powai, Mumbai - 400076',
        manager: 'Sunita Gupta',
        devices: createMockDevices('SBIN0001236')
      }
    ]
  },
  {
    id: 'sbi-z2',
    name: 'Delhi Zone',
    code: 'DZ',
    manager: 'Vikram Singh',
    branches: [
      {
        id: 'sbi-b4',
        name: 'Connaught Place Branch',
        code: 'SBIN0002001',
        address: 'CP Block A, New Delhi - 110001',
        manager: 'Neha Agarwal',
        devices: createMockDevices('SBIN0002001')
      },
      {
        id: 'sbi-b5',
        name: 'Karol Bagh Branch',
        code: 'SBIN0002002',
        address: 'Karol Bagh, New Delhi - 110005',
        manager: 'Rohit Jain',
        devices: createMockDevices('SBIN0002002')
      }
    ]
  }
];

// Indian Bank Structure  
const indianBankZones: Zone[] = [
  {
    id: 'ib-z1',
    name: 'South Zone',
    code: 'SZ',
    manager: 'Lakshmi Nair',
    nbgs: [
      {
        id: 'ib-nbg1',
        name: 'Chennai NBG',
        code: 'CHE-NBG',
        manager: 'Ravi Chandran',
        ros: [
          {
            id: 'ib-ro1',
            name: 'Chennai Central RO',
            code: 'CHE-C-RO',
            manager: 'Meera Krishnan',
            branches: [
              {
                id: 'ib-b1',
                name: 'T Nagar Branch',
                code: 'IDIB0001001',
                address: 'T Nagar, Chennai - 600017',
                manager: 'Karthik Subramanian',
                devices: createMockDevices('IDIB0001001')
              },
              {
                id: 'ib-b2',
                name: 'Anna Nagar Branch',
                code: 'IDIB0001002',
                address: 'Anna Nagar, Chennai - 600040',
                manager: 'Divya Raj',
                devices: createMockDevices('IDIB0001002')
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'ib-z2',
    name: 'West Zone',
    code: 'WZ',
    manager: 'Arjun Desai',
    nbgs: [
      {
        id: 'ib-nbg2',
        name: 'Pune NBG',
        code: 'PUN-NBG',
        manager: 'Sangeeta Kulkarni',
        ros: [
          {
            id: 'ib-ro2',
            name: 'Pune City RO',
            code: 'PUN-C-RO',
            manager: 'Nitin Bhosale',
            branches: [
              {
                id: 'ib-b3',
                name: 'Shivaji Nagar Branch',
                code: 'IDIB0002001',
                address: 'Shivaji Nagar, Pune - 411005',
                manager: 'Pooja Marathe',
                devices: createMockDevices('IDIB0002001')
              }
            ]
          }
        ]
      }
    ]
  }
];

export const banks: Bank[] = [
  {
    id: 'sbi',
    name: 'State Bank of India',
    type: 'SBI',
    zones: sbiZones
  },
  {
    id: 'indianbank',
    name: 'Indian Bank',
    type: 'Indian Bank',
    zones: indianBankZones
  }
];

export const users: User[] = [
  {
    id: 'u1',
    name: 'Admin User',
    email: 'admin@bankingsec.com',
    role: 'System Administrator',
    status: 'active',
    lastLogin: new Date(Date.now() - 3600000).toISOString(),
    permissions: ['all']
  },
  {
    id: 'u2',
    name: 'Security Manager',
    email: 'security@bankingsec.com',
    role: 'Security Manager',
    status: 'active',
    lastLogin: new Date(Date.now() - 7200000).toISOString(),
    permissions: ['monitor', 'alerts', 'reports']
  },
  {
    id: 'u3',
    name: 'Branch Manager',
    email: 'branch@bankingsec.com',
    role: 'Branch Manager',
    status: 'active',
    lastLogin: new Date(Date.now() - 10800000).toISOString(),
    permissions: ['view', 'branch-manage']
  }
];

// Helper function to get all devices
export const getAllDevices = (): Device[] => {
  const devices: Device[] = [];
  
  banks.forEach(bank => {
    bank.zones.forEach(zone => {
      if (zone.branches) {
        // SBI structure
        zone.branches.forEach(branch => {
          devices.push(...branch.devices);
        });
      } else if (zone.nbgs) {
        // Indian Bank structure
        zone.nbgs.forEach(nbg => {
          nbg.ros.forEach(ro => {
            ro.branches.forEach(branch => {
              devices.push(...branch.devices);
            });
          });
        });
      }
    });
  });
  
  return devices;
};

// Helper function to get dashboard summary
export const getDashboardSummary = (): DashboardSummary => {
  const allDevices = getAllDevices();
  const onlineDevices = allDevices.filter(d => d.status === 'online').length;
  
  let totalBranches = 0;
  banks.forEach(bank => {
    bank.zones.forEach(zone => {
      if (zone.branches) {
        totalBranches += zone.branches.length;
      } else if (zone.nbgs) {
        zone.nbgs.forEach(nbg => {
          nbg.ros.forEach(ro => {
            totalBranches += ro.branches.length;
          });
        });
      }
    });
  });

  return {
    totalDevices: allDevices.length,
    onlineDevices,
    offlineDevices: allDevices.length - onlineDevices,
    totalBranches,
    totalUsers: users.length,
    lastUpdated: new Date().toISOString()
  };
};
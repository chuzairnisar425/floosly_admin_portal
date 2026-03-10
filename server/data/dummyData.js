// server/data/mockData.js
export const clinics = [
  {
    id: 1,
    name: "Smile Dental Clinic",
    email: "info@smiledental.com",
    phone: "+44 123456789",
    address: "123 London Bridge, London, UK",
    status: "active",
    createdAt: "2026-01-01"
  },
  {
    id: 2,
    name: "Bright Dental Care",
    email: "contact@brightdental.com",
    phone: "+44 987654321",
    address: "456 Oxford Road, Manchester, UK",
    status: "active",
    createdAt: "2026-01-15"
  },
  {
    id: 3,
    name: "Perfect Smile Studio",
    email: "hello@perfectsmile.co.uk",
    phone: "+44 555123456",
    address: "789 King Street, Birmingham, UK",
    status: "inactive",
    createdAt: "2026-02-01"
  }
]

export const users = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    email: "sarah.j@smiledental.com",
    role: "admin",
    clinicId: 1,
    status: "active",
    createdAt: "2026-01-01"
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    email: "m.chen@brightdental.com",
    role: "dentist",
    clinicId: 2,
    status: "active",
    createdAt: "2026-01-15"
  },
  {
    id: 3,
    name: "Emily Watson",
    email: "emily.w@smiledental.com",
    role: "receptionist",
    clinicId: 1,
    status: "inactive",
    createdAt: "2026-02-01"
  }
]
import { create } from 'zustand';
import { mockPatients, mockDepartments, mockHospitalBeds } from '@/lib/mockData';
import { addHours, startOfDay } from 'date-fns';

// Types
export interface Patient {
    id: string;
    first_name: string;
    last_name: string;
    dob: string;
    gender: 'M' | 'F';
    status: 'admitted' | 'outpatient' | 'discharged';
    last_visit: string;
    diagnosis: string;
    // New Detailed Fields
    socialSecurityNumber?: string;
    phone?: string;
    email?: string;
    address?: string;
    admissionReason?: string;
    allergies?: string[];
    medicalHistory?: string[];
    insuranceProvider?: string;
    treatingDoctorId?: string;
}

export interface Staff {
    id: string;
    name: string;
    role: string;
    specialty?: string;
    status: 'on_duty' | 'off_duty' | 'on_call';
    email: string;
    phone: string;
    avatar: string;
    // Shift Management
    shiftStart?: string;
    shiftEnd?: string;
}

export interface Service {
    id: string;
    name: string;
    floor: string;
    color: string;
}

export interface Bed {
    id: string;
    deptId: string;
    number: string;
    status: 'available' | 'occupied' | 'cleaning' | 'maintenance';
    patient: {
        name: string;
        condition: string;
        admissionTime: string;
    } | null;
}

export interface Appointment {
    id: string | number;
    title: string;
    type: 'surgery' | 'consultation' | 'urgent' | 'meeting' | 'google' | 'exam' | 'followup';
    start: Date;
    duration: number; // in hours
    doctor: string; // name or id
    room: string;
    source?: 'Internal' | 'Google';
    // HIL - Intelligent Scheduling Fields
    patientId?: string;
    urgency?: 'low' | 'normal' | 'high' | 'critical';
    equipment?: string[]; // Required equipment for the appointment
    constraints?: string[]; // Special constraints (e.g., "needs wheelchair access")
    status?: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
}

interface HospitalState {
    patients: Patient[];
    staff: Staff[];
    services: Service[];
    beds: Bed[];
    appointments: Appointment[];

    // Actions
    addPatient: (patient: Omit<Patient, 'id'>) => void;
    updatePatient: (id: string, updates: Partial<Patient>) => void;

    addStaff: (staff: Omit<Staff, 'id'>) => void;
    updateStaffStatus: (id: string, status: Staff['status']) => void;

    addService: (service: Omit<Service, 'id'>) => void;
    addBed: (bed: Omit<Bed, 'id'>) => void;
    updateBedStatus: (bedId: string, status: Bed['status'], patientInfo?: Bed['patient']) => void;

    addAppointment: (appointment: Appointment) => void;
    updateAppointment: (id: string | number, updates: Partial<Appointment>) => void;
}

// Initial Mock Data Loading
// We cast the mock data to our stricter types where necessary or ensure mockData.ts complies
const initialPatients: Patient[] = mockPatients.map(p => ({
    ...p,
    gender: p.gender as 'M' | 'F',
    status: p.status as 'admitted' | 'outpatient' | 'discharged',
    diagnosis: p.diagnosis || "Observation"
}));

const initialStaff: Staff[] = [
    {
        id: '1', name: 'Dr. Gregory House', role: 'Doctor', specialty: 'Diagnosticien', status: 'on_duty',
        email: 'g.house@cloud-hopital.fr', phone: '+33 6 12 34 56 78', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=House'
    },
    {
        id: '2', name: 'Dr. James Wilson', role: 'Doctor', specialty: 'Oncologie', status: 'on_call',
        email: 'j.wilson@cloud-hopital.fr', phone: '+33 6 98 76 54 32', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Wilson'
    },
    // ... we can add more from the StaffPage mock later or consolidate
];

// Combine mock beds with correct typing
const initialBeds: Bed[] = mockHospitalBeds.map(b => ({
    ...b,
    status: b.status as Bed['status']
}));

const initialAppointments: Appointment[] = [
    { id: 1, title: 'Chirurgie Cardiaque - M. Dupont', type: 'surgery', start: addHours(startOfDay(new Date()), 9), duration: 2, doctor: 'Dr. House', room: 'Bloc A' },
    { id: 2, title: 'Consultation Suivi - Mme. Petit', type: 'consultation', start: addHours(startOfDay(new Date()), 11), duration: 0.5, doctor: 'Dr. Wilson', room: 'Cab. 12' },
    { id: 3, title: 'Urgence - Arrivée SAMU', type: 'urgent', start: addHours(startOfDay(new Date()), 14), duration: 1.5, doctor: 'Dr. Cuddy', room: 'Urgences' },
    { id: 4, title: 'Staff Meeting', type: 'meeting', start: addHours(startOfDay(new Date()), 8), duration: 1, doctor: 'Tous', room: 'Salle Conf.' },
];

export const useHospitalStore = create<HospitalState>((set) => ({
    patients: initialPatients,
    staff: initialStaff,
    services: mockDepartments,
    beds: initialBeds,
    appointments: initialAppointments,

    addPatient: (newPatient) => set((state) => ({
        patients: [...state.patients, { ...newPatient, id: `pat-${Date.now()}` }]
    })),

    updatePatient: (id, updates) => set((state) => ({
        patients: state.patients.map(p => p.id === id ? { ...p, ...updates } : p)
    })),

    addStaff: (newStaff) => set((state) => ({
        staff: [...state.staff, { ...newStaff, id: `staff-${Date.now()}` }]
    })),

    updateStaffStatus: (id, status) => set((state) => ({
        staff: state.staff.map(s => s.id === id ? { ...s, status } : s)
    })),

    addService: (newService) => set((state) => ({
        services: [...state.services, { ...newService, id: `dept-${Date.now()}` }]
    })),

    addBed: (newBed) => set((state) => ({
        beds: [...state.beds, { ...newBed, id: `bed-${Date.now()}` }]
    })),

    updateBedStatus: (bedId, status, patientInfo) => set((state) => ({
        beds: state.beds.map(b => b.id === bedId ? {
            ...b,
            status,
            patient: patientInfo !== undefined ? patientInfo : b.patient
        } : b)
    })),

    // Appointment Actions
    addAppointment: (newAppointment) => set((state) => ({
        appointments: [...state.appointments, newAppointment]
    })),

    updateAppointment: (id, updates) => set((state) => ({
        appointments: state.appointments.map(a => a.id === id ? { ...a, ...updates } : a)
    })),
}));

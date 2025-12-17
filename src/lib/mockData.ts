// Mock data to replace Supabase backend - Local storage based

export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[];

// Generate unique IDs
export const generateId = (): string => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

export interface MockUser {
    id: string;
    email: string;
    user_metadata?: Record<string, unknown>;
    reference: string;
    created_at: string;
}

export interface MockSession {
    access_token: string;
    refresh_token: string;
    expires_at: number;
    expires_in: number;
    token_type: string;
    user: MockUser;
}

export interface UserProfile {
    id: string;
    user_id: string;
    full_name: string;
    email: string;
    avatar_url: string | null;
    company: string | null;
    phone: string | null;
    created_at: string;
    updated_at: string;
}

export interface UserDashboard {
    id: string;
    user_id: string;
    layout: Json;
    widgets: Json;
    theme: Json;
    created_at: string;
    updated_at: string;
}

export interface UserStats {
    id: string;
    user_id: string;
    total_incidents: number | null;
    ai_queries: number | null;
    workflows_count: number | null;
    digital_twins_count: number | null;
    last_active: string | null;
    created_at: string;
    updated_at: string;
}

export interface Product {
    id: string;
    name: string;
    description: string | null;
    price: number;
    category: string | null;
    image_url: string | null;
    stock: number | null;
    approved: boolean | null;
    seller_id: string | null;
    created_at: string;
    updated_at: string;
}

export interface Customer {
    id: string;
    user_id: string;
    name: string;
    email: string;
    phone: string | null;
    company: string | null;
    status: string;
    value: number | null;
    created_at: string;
    updated_at: string;
}

export interface Deal {
    id: string;
    user_id: string;
    title: string;
    value: number;
    stage: string;
    probability: number | null;
    close_date: string | null;
    contact: string | null;
    company_id: string | null;
    product_id: string | null;
    created_at: string | null;
    updated_at: string | null;
}

export interface Task {
    id: string;
    user_id: string;
    title: string;
    description: string | null;
    status: string;
    priority: string;
    due_date: string | null;
    assigned_to: string | null;
    created_at: string;
    updated_at: string;
}

export interface Sale {
    id: string;
    user_id: string;
    product_id: string;
    customer_id: string | null;
    quantity: number;
    unit_price: number;
    total_price: number;
    sale_date: string;
    created_at: string | null;
}

export interface AIRecommendation {
    id: string;
    user_id: string;
    title: string;
    description: string;
    type: string;
    priority: string;
    is_read: boolean | null;
    data: Json | null;
    created_at: string;
}

export interface MockInvoice {
    id: string;
    user_id: string;
    client_name: string;
    amount: number;
    status: 'paid' | 'pending' | 'overdue' | 'draft';
    due_date: string;
    ref_number: string;
}

export interface MockDocument {
    id: string;
    title: string;
    type: 'contract' | 'invoice' | 'proposal' | 'spec';
    size: string;
    author: string;
    last_modified: string;
    status: 'signed' | 'pending_signature' | 'draft' | 'final';
    created_at: string;
}

export type MessageType = 'text' | 'file' | 'invoice_request' | 'system';

export interface MockMessage {
    id: string;
    sender: string;
    avatar?: string;
    content: string;
    timestamp: string;
    unread: boolean;
    channel: string;
    channel_id?: string; // Linked to Project ID
    type: MessageType;
    attachment?: {
        name: string;
        size: string;
        type: string;
        url?: string;
    };
    is_encrypted: boolean; // Visual indicator for "Secure Chat"
    hash?: string; // Proof timestamp
}

// PROMPT 6: SÉCURITÉ & AUDIT
export interface AuditLog {
    id: string;
    action: string;
    actor: string;
    resource: string;
    status: 'success' | 'failure' | 'warning';
    ip_address: string;
    timestamp: string;
    details?: string;
}

export interface SecurityAlert {
    id: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    message: string;
    status: 'active' | 'resolved';
    timestamp: string;
}

// HOSPITAL MODULES - NEW INTERFACES (V2)

export interface MockPatient {
    id: string;
    first_name: string;
    last_name: string;
    dob: string;
    gender: 'M' | 'F' | 'Other';
    blood_group: string;
    address: string;
    phone: string;
    email: string;
    insurance_provider: string;
    policy_number: string;
    status: 'admitted' | 'outpatient' | 'discharged';
    last_visit: string;
    diagnosis?: string;
}

export interface MockStaff {
    id: string;
    full_name: string;
    role: 'Doctor' | 'Nurse' | 'Admin' | 'Support';
    specialty?: string;
    department: string;
    status: 'active' | 'on_break' | 'off_duty';
    email: string;
    phone: string;
    schedule_today: string;
}

// Demo user for local mode
export const demoUser: MockUser = {
    id: "demo-user-" + generateId(),
    email: "demo@cloudindustrie.fr",
    user_metadata: {
        full_name: "Utilisateur Demo"
    },
    reference: "REF-DEMO-001",
    created_at: new Date().toISOString()
};

// ... (rest of the file content until transactions list) ...



// Mock Audit Logs (Prompt 6)
export const mockAuditLogs: AuditLog[] = [
    {
        id: "log-001",
        action: "LOGIN_ATTEMPT",
        actor: "jean.dupont@company.com",
        resource: "Auth Service",
        status: "success",
        ip_address: "192.168.1.42",
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 mins ago
        details: "Login via 2FA"
    },
    {
        id: "log-002",
        action: "DOCUMENT_ACCESS",
        actor: "marie.martin@partner.com",
        resource: "Contrat_Cadre_V2.pdf",
        status: "success",
        ip_address: "10.0.0.12",
        timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        details: "Read access"
    },
    {
        id: "log-003",
        action: "PAYMENT_INITIATED",
        actor: "system",
        resource: "Wallet",
        status: "warning",
        ip_address: "INTERNAL",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        details: "Large transaction detected > 5000€"
    },
    {
        id: "log-004",
        action: "API_KEY_ROTATION",
        actor: "admin",
        resource: "API Settings",
        status: "success",
        ip_address: "192.168.1.100",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
    },
    {
        id: "log-005",
        action: "LOGIN_FAILED",
        actor: "unknown",
        resource: "Auth Service",
        status: "failure",
        ip_address: "45.32.12.99",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 25).toISOString(),
        details: "Invalid password (3 attempts)"
    }
];

export const mockSecurityAlerts: SecurityAlert[] = [
    {
        id: "alert-1",
        severity: "medium",
        message: "Tentative de connexion depuis une nouvelle IP (Marseille, FR)",
        status: "active",
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString()
    },
    {
        id: "alert-2",
        severity: "low",
        message: "Certificat SSL expire dans 15 jours",
        status: "active",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString()
    }
];

// HOSPITAL MOCK DATA (V2)

export interface MockHospitalStats {
    total_beds: number;
    occupied_beds: number;
    available_beds: number;
    occupancy_rate: number;
    admissions_today: number;
    discharges_today: number;
    emergency_wait_time: number; // minutes
    doctors_on_duty: number;
    nurses_on_duty: number;
}

export const mockHospitalStats: MockHospitalStats = {
    total_beds: 150,
    occupied_beds: 112,
    available_beds: 38,
    occupancy_rate: 74.6,
    admissions_today: 14,
    discharges_today: 8,
    emergency_wait_time: 45,
    doctors_on_duty: 12,
    nurses_on_duty: 35
};

export interface MockBed {
    id: string;
    room_number: string;
    department: 'Urgences' | 'Cardiologie' | 'Pédiatrie' | 'Réanimation' | 'Chirurgie';
    status: 'available' | 'occupied' | 'cleaning' | 'maintenance';
    patient_id?: string;
}


// --- Hospital Management Mocks ---

export const mockDepartments = [
    { id: 'dept-1', name: 'Urgences', floor: 'RDC', color: 'red' },
    { id: 'dept-2', name: 'Cardiologie', floor: 'Étage 1', color: 'blue' },
    { id: 'dept-3', name: 'Pédiatrie', floor: 'Étage 2', color: 'green' },
    { id: 'dept-4', name: 'Neurologie', floor: 'Étage 3', color: 'purple' },
];

export const mockHospitalBeds = [
    // Urgences
    { id: 'bed-u1', deptId: 'dept-1', number: 'U-01', status: 'occupied', patient: { name: 'Sophie Martin', condition: 'Stable', admissionTime: '10:30' } },
    { id: 'bed-u2', deptId: 'dept-1', number: 'U-02', status: 'occupied', patient: { name: 'Paul Bernard', condition: 'Critique', admissionTime: '11:15' } },
    { id: 'bed-u3', deptId: 'dept-1', number: 'U-03', status: 'available', patient: null },
    { id: 'bed-u4', deptId: 'dept-1', number: 'U-04', status: 'cleaning', patient: null },

    // Cardiologie
    { id: 'bed-c1', deptId: 'dept-2', number: 'C-101', status: 'occupied', patient: { name: 'Jean Dubois', condition: 'Post-Op', admissionTime: 'Yesterday' } },
    { id: 'bed-c2', deptId: 'dept-2', number: 'C-102', status: 'available', patient: null },
    { id: 'bed-c3', deptId: 'dept-2', number: 'C-103', status: 'occupied', patient: { name: 'Marie Petit', condition: 'Observation', admissionTime: '09:00' } },
    { id: 'bed-c4', deptId: 'dept-2', number: 'C-104', status: 'maintenance', patient: null },

    // Pédiatrie
    { id: 'bed-p1', deptId: 'dept-3', number: 'P-201', status: 'occupied', patient: { name: 'Lucas Thomas', condition: 'Fièvre', admissionTime: '08:45' } },
    { id: 'bed-p2', deptId: 'dept-3', number: 'P-202', status: 'available', patient: null },
];
export const mockBeds: MockBed[] = [
    { id: "bed-101", room_number: "101", department: "Urgences", status: "occupied", patient_id: "pat-001" },
    { id: "bed-102", room_number: "101", department: "Urgences", status: "available" },
    { id: "bed-103", room_number: "102", department: "Urgences", status: "occupied", patient_id: "pat-005" },
    { id: "bed-201", room_number: "201", department: "Cardiologie", status: "occupied", patient_id: "pat-002" },
    { id: "bed-202", room_number: "201", department: "Cardiologie", status: "occupied", patient_id: "pat-008" },
    { id: "bed-203", room_number: "202", department: "Cardiologie", status: "cleaning" },
    { id: "bed-301", room_number: "301", department: "Pédiatrie", status: "available" },
    { id: "bed-302", room_number: "302", department: "Pédiatrie", status: "maintenance" },
];

export const mockPatients: MockPatient[] = [
    {
        id: "pat-001",
        first_name: "Jean",
        last_name: "Dupont",
        dob: "1980-05-15",
        gender: "M",
        blood_group: "O+",
        address: "12 Rue de la Paix, Paris",
        phone: "+33 6 12 34 56 78",
        email: "jean.dupont@email.com",
        insurance_provider: "AXA",
        policy_number: "AX-99887766",
        status: "admitted",
        last_visit: new Date().toISOString(),
        diagnosis: "Pneumonie Aiguë"
    },
    {
        id: "pat-002",
        first_name: "Marie",
        last_name: "Curie",
        dob: "1992-11-07",
        gender: "F",
        blood_group: "A-",
        address: "5 Avenue des Champs, Lyon",
        phone: "+33 6 98 76 54 32",
        email: "marie.curie@email.com",
        insurance_provider: "Allianz",
        policy_number: "AL-11223344",
        status: "outpatient",
        last_visit: new Date(Date.now() - 86400000 * 2).toISOString(),
        diagnosis: "Consultation Suivi"
    },
    {
        id: "pat-003",
        first_name: "Pierre",
        last_name: "Martin",
        dob: "1955-03-22",
        gender: "M",
        blood_group: "B+",
        address: "8 Boulevard Victor Hugo, Nice",
        phone: "+33 6 55 44 33 22",
        email: "pierre.m@email.com",
        insurance_provider: "Generali",
        policy_number: "GE-55667788",
        status: "discharged",
        last_visit: new Date(Date.now() - 86400000 * 10).toISOString(),
        diagnosis: "Fracture Tibia"
    }
];

export const mockStaff: MockStaff[] = [
    {
        id: "stf-001",
        full_name: "Dr. Sophie Bernard",
        role: "Doctor",
        specialty: "Cardiologie",
        department: "Cardiologie",
        status: "active",
        email: "s.bernard@hospital.com",
        phone: "+33 6 00 00 00 01",
        schedule_today: "08:00 - 16:00"
    },
    {
        id: "stf-002",
        full_name: "Inf. Thomas Petit",
        role: "Nurse",
        department: "Urgences",
        status: "active",
        email: "t.petit@hospital.com",
        phone: "+33 6 00 00 00 02",
        schedule_today: "06:00 - 14:00"
    },
    {
        id: "stf-003",
        full_name: "Dr. Marc Dubois",
        role: "Doctor",
        specialty: "Neurologie",
        department: "Neurologie",
        status: "off_duty",
        email: "m.dubois@hospital.com",
        phone: "+33 6 00 00 00 03",
        schedule_today: "Off"
    }
];

// Niveau d'identification (KYC)
export type KYCLevel = 'none' | 'basic' | 'verified' | 'corporate';

export interface UserIdentity {
    id: string; // Linked to Auth User
    legal_name: string;
    birth_date?: string;
    nationality?: string;
    kyc_level: KYCLevel;
    kyc_documents_status: {
        id_card: 'missing' | 'pending' | 'verified' | 'rejected';
        proof_of_address: 'missing' | 'pending' | 'verified' | 'rejected';
    };
    last_verification: string;
}

export interface FinancialProfile {
    id: string; // Distinct from UserIdentity
    identity_id: string; // Link to Identity
    currency: 'EUR' | 'USD';
    wallet_balance: number; // Available funds
    escrow_balance: number; // Blocked funds
    iban?: string; // Encrypted in real app
    tax_id?: string;
    stripe_connect_id?: string;
    status: 'active' | 'frozen' | 'limited';
}

export interface Transaction {
    id: string;
    financial_profile_id: string;
    amount: number;
    currency: string;
    type: 'deposit' | 'withdrawal' | 'escrow_lock' | 'escrow_release' | 'payment';
    status: 'pending' | 'completed' | 'failed';
    counterparty?: string;
    reference: string;
    created_at: string;
}



// Mock products data
export const mockProducts: Product[] = [
    {
        id: generateId(),
        name: "Cloud Serveur Entreprise",
        description: "Serveur cloud haute performance pour entreprises avec 99.99% de disponibilité",
        price: 299.99,
        category: "Infrastructure",
        image_url: "/placeholder.svg",
        stock: 100,
        approved: true,
        seller_id: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        id: generateId(),
        name: "Stockage Cloud Sécurisé",
        description: "Solution de stockage cloud avec chiffrement de bout en bout",
        price: 49.99,
        category: "Stockage",
        image_url: "/placeholder.svg",
        stock: 500,
        approved: true,
        seller_id: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        id: generateId(),
        name: "Suite Collaboration Pro",
        description: "Outils de collaboration en temps réel pour équipes distribuées",
        price: 19.99,
        category: "Collaboration",
        image_url: "/placeholder.svg",
        stock: 1000,
        approved: true,
        seller_id: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        id: generateId(),
        name: "Protection Cyber Avancée",
        description: "Protection cybersécurité multicouche avec IA intégrée",
        price: 149.99,
        category: "Sécurité",
        image_url: "/placeholder.svg",
        stock: 200,
        approved: true,
        seller_id: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        id: generateId(),
        name: "API Gateway Cloud",
        description: "Passerelle API haute performance avec load balancing automatique",
        price: 99.99,
        category: "Infrastructure",
        image_url: "/placeholder.svg",
        stock: 300,
        approved: true,
        seller_id: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        id: generateId(),
        name: "Analytics Suite Business",
        description: "Plateforme d'analyse de données avec tableaux de bord personnalisables",
        price: 79.99,
        category: "Analytics",
        image_url: "/placeholder.svg",
        stock: 250,
        approved: true,
        seller_id: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    }
];

// Mock customers data
export const mockCustomers: Customer[] = [
    {
        id: generateId(),
        user_id: "demo-user",
        name: "Tech Solutions SA",
        email: "contact@techsolutions.fr",
        phone: "+33 1 23 45 67 89",
        company: "Tech Solutions",
        status: "active",
        value: 25000,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        id: generateId(),
        user_id: "demo-user",
        name: "Innovation Labs",
        email: "hello@innovationlabs.fr",
        phone: "+33 1 98 76 54 32",
        company: "Innovation Labs",
        status: "active",
        value: 45000,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        id: generateId(),
        user_id: "demo-user",
        name: "Digital Factory",
        email: "info@digitalfactory.com",
        phone: "+33 1 11 22 33 44",
        company: "Digital Factory",
        status: "prospect",
        value: 15000,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        id: generateId(),
        user_id: "demo-user",
        name: "Cloud Masters",
        email: "contact@cloudmasters.io",
        phone: "+33 1 55 66 77 88",
        company: "Cloud Masters",
        status: "active",
        value: 75000,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    }
];

// Mock deals data
export const mockDeals: Deal[] = [
    {
        id: generateId(),
        user_id: "demo-user",
        title: "Migration Cloud Enterprise",
        value: 50000,
        stage: "negotiation",
        probability: 75,
        close_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        contact: "Jean Dupont",
        company_id: null,
        product_id: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        id: generateId(),
        user_id: "demo-user",
        title: "Contrat Cybersécurité Annuel",
        value: 25000,
        stage: "qualification",
        probability: 50,
        close_date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
        contact: "Marie Martin",
        company_id: null,
        product_id: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        id: generateId(),
        user_id: "demo-user",
        title: "Suite Collaboration PME",
        value: 12000,
        stage: "proposal",
        probability: 80,
        close_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
        contact: "Pierre Durand",
        company_id: null,
        product_id: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        id: generateId(),
        user_id: "demo-user",
        title: "Infrastructure Cloud Start-up",
        value: 8000,
        stage: "lead",
        probability: 25,
        close_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
        contact: "Sophie Bernard",
        company_id: null,
        product_id: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    }
];

// Mock tasks data
export const mockTasks: Task[] = [
    {
        id: generateId(),
        user_id: "demo-user",
        title: "Appel client Tech Solutions",
        description: "Discuter du renouvellement de contrat",
        status: "pending",
        priority: "high",
        due_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        assigned_to: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        id: generateId(),
        user_id: "demo-user",
        title: "Préparer présentation Cloud",
        description: "Créer slides pour nouveau prospect",
        status: "in_progress",
        priority: "medium",
        due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        assigned_to: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        id: generateId(),
        user_id: "demo-user",
        title: "Revue trimestrielle Analytics",
        description: "Analyser les métriques du Q4",
        status: "completed",
        priority: "low",
        due_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        assigned_to: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    }
];

// Mock sales data generator
export const generateMockSales = (): Sale[] => {
    const sales: Sale[] = [];
    const now = new Date();

    for (let i = 0; i < 30; i++) {
        const saleDate = new Date(now);
        saleDate.setDate(saleDate.getDate() - i);

        const product = mockProducts[Math.floor(Math.random() * mockProducts.length)];
        const quantity = Math.floor(Math.random() * 10) + 1;

        sales.push({
            id: generateId(),
            user_id: "demo-user",
            product_id: product.id,
            customer_id: mockCustomers[Math.floor(Math.random() * mockCustomers.length)].id,
            quantity,
            unit_price: product.price,
            total_price: product.price * quantity,
            sale_date: saleDate.toISOString(),
            created_at: saleDate.toISOString()
        });
    }

    return sales;
};

// Mock AI recommendations
export const mockRecommendations: AIRecommendation[] = [
    {
        id: generateId(),
        user_id: "demo-user",
        title: "Opportunité de vente identifiée",
        description: "Tech Solutions SA a un pattern d'achat qui suggère un intérêt pour la Suite Collaboration Pro",
        type: "sales",
        priority: "high",
        is_read: false,
        data: null,
        created_at: new Date().toISOString()
    },
    {
        id: generateId(),
        user_id: "demo-user",
        title: "Client à risque détecté",
        description: "Digital Factory n'a pas été contacté depuis 45 jours. Recommandation: appel de suivi",
        type: "retention",
        priority: "medium",
        is_read: false,
        data: null,
        created_at: new Date().toISOString()
    },
    {
        id: generateId(),
        user_id: "demo-user",
        title: "Optimisation pricing suggérée",
        description: "Analyse de marché: augmentation possible de 10% sur Protection Cyber Avancée",
        type: "pricing",
        priority: "low",
        is_read: true,
        data: null,
        created_at: new Date().toISOString()
    }
];

// Mock Invoices
export const mockInvoices: MockInvoice[] = [
    {
        id: "inv-001",
        user_id: "demo-user",
        client_name: "Tech Solutions SA",
        amount: 4500.00,
        status: "paid",
        due_date: "2024-03-15",
        ref_number: "INV-2024-001"
    },
    {
        id: "inv-002",
        user_id: "demo-user",
        client_name: "Innovation Labs",
        amount: 12500.00,
        status: "pending",
        due_date: "2024-06-20",
        ref_number: "INV-2024-042"
    },
    {
        id: "inv-003",
        user_id: "demo-user",
        client_name: "Digital Factory",
        amount: 2300.00,
        status: "overdue",
        due_date: "2024-05-10",
        ref_number: "INV-2024-038"
    }
];

// Mock Documents
export const mockDocuments: MockDocument[] = [
    {
        id: "doc-1",
        title: "Contrat de Prestation - Tech Solutions",
        type: "contract",
        size: "2.4 MB",
        author: "Jean Dupont",
        last_modified: "2h ago",
        status: "signed",
        created_at: new Date().toISOString()
    },
    {
        id: "doc-2",
        title: "Spécifications Techniques V2",
        type: "spec",
        size: "4.1 MB",
        author: "Sophie Bernard",
        last_modified: "5h ago",
        status: "final",
        created_at: new Date().toISOString()
    },
    {
        id: "doc-3",
        title: "Facture INV-2024-042",
        type: "invoice",
        size: "156 KB",
        author: "System",
        last_modified: "1d ago",
        status: "pending_signature",
        created_at: new Date().toISOString()
    }
];

// Mock Messages
// Mock Messages (Enhanced for Prompt 5)
export const mockMessages: MockMessage[] = [
    {
        id: "msg-1",
        sender: "Marie Martin",
        content: "On valide le devis ce matin ?",
        timestamp: "10:23",
        unread: true,
        channel: "Projet Alpha",
        channel_id: "proj-001",
        type: 'text',
        is_encrypted: true
    },
    {
        id: "msg-2",
        sender: "Pierre Durand",
        content: "Voici les spécifications techniques mises à jour.",
        timestamp: "09:15",
        unread: true,
        channel: "Infra Team",
        type: 'file',
        attachment: {
            name: "specs_v2.pdf",
            size: "2.4 MB",
            type: "pdf"
        },
        is_encrypted: true
    },
    {
        id: "msg-3",
        sender: "System",
        content: "Facture INV-2024-001 générée automatiquement.",
        timestamp: "Yesterday",
        unread: false,
        channel: "System",
        type: 'system',
        is_encrypted: false
    },
    {
        id: "msg-4",
        sender: "Jean Dupont",
        content: "Pouvez-vous me renvoyer la facture du mois dernier ?",
        timestamp: "11:30",
        unread: false,
        channel: "Projet Alpha",
        channel_id: "proj-001",
        type: 'text',
        is_encrypted: true
    }
];

// Demo user profile and stats
export const demoProfile: UserProfile = {
    id: generateId(),
    user_id: demoUser.id,
    full_name: "Utilisateur Demo",
    email: "demo@cloudindustrie.fr",
    avatar_url: null,
    company: "Cloud Industrie",
    phone: "+33 1 00 00 00 00",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
};

export const demoDashboard: UserDashboard = {
    id: generateId(),
    user_id: demoUser.id,
    layout: { type: "default" },
    widgets: ["stats", "deals", "tasks", "chart"],
    theme: { mode: "dark" },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
};

export const demoStats: UserStats = {
    id: generateId(),
    user_id: demoUser.id,
    total_incidents: 12,
    ai_queries: 156,
    workflows_count: 8,
    digital_twins_count: 3,
    last_active: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
};

// Mock Identity (Prompt 3)
export const mockUserIdentity: UserIdentity = {
    id: "id-demo-001",
    legal_name: "Jean Dupont Management",
    kyc_level: "verified",
    kyc_documents_status: {
        id_card: "verified",
        proof_of_address: "verified"
    },
    last_verification: "2024-01-15"
};

// Mock Financial Profile (Strict Separation)
export const mockFinancialProfile: FinancialProfile = {
    id: "fin-demo-001",
    identity_id: "id-demo-001",
    currency: "EUR",
    wallet_balance: 12450.00,
    escrow_balance: 5000.00, // Argent bloqué pour projets en cours
    iban: "FR76 3000 4000 5000 6000 7000 89",
    tax_id: "FR00123456789",
    status: "active"
};

// Mock Transactions
export const mockTransactions: Transaction[] = [
    {
        id: "tx-101",
        financial_profile_id: "fin-demo-001",
        amount: 5000.00,
        currency: "EUR",
        type: "escrow_lock",
        status: "completed",
        counterparty: "Projet Alpha - Acompte",
        reference: "ESC-2024-889",
        created_at: "2024-03-10T10:00:00Z"
    },
    {
        id: "tx-102",
        financial_profile_id: "fin-demo-001",
        amount: 2500.00,
        currency: "EUR",
        type: "payment",
        status: "completed",
        counterparty: "Tech Solutions SA",
        reference: "PAY-2024-001",
        created_at: "2024-03-12T14:30:00Z"
    },
    {
        id: "tx-103",
        financial_profile_id: "fin-demo-001",
        amount: -150.00,
        currency: "EUR",
        type: "withdrawal",
        status: "pending",
        counterparty: "Virement sortant",
        reference: "WITH-2024-022",
        created_at: "2024-03-14T09:15:00Z"
    }
];

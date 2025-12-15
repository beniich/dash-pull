# Spécifications Produit : Cloud Industrie - Enterprise Edition
*Analyse et synthèse de la vision produit "CRM Hub V2" basée sur les 6 prompts stratégiques.*

## 1. Vision & Philosophie Produit
L'objectif est de créer une application web professionnelle "Tier-1" qui centralise la gestion d'entreprise (CRM, Projets, Finances, Documents) avec une rigueur digne des systèmes bancaires et une expérience utilisateur digne des meilleurs outils de productivité (Linear, Notion).

### Principes Directeurs
- **Productivité Radicale** : Information dense mais lisible. Pas de clicks inutiles. Navigation clavier.
- **Confiance Absolue** : Design sobre, "sérieux", inspirant la sécurité et la robustesse.
- **Zero Trust & GDPR** : Séparation stricte des données (Identité vs Finance vs Métier). Sécurité "By Design".
- **Centralisation** : Un dashboard unique pour voir l'état de santé de l'activité (Projets, Cash, Messages).

---

## 2. Architecture & Sécurité (Backend & Data)
*Basé sur Prompts 3, 4 et 6.*

Même dans une version locale/mockée, l'architecture des données doit refléter la séparation stricte des préoccupations pour préparer une future migration backend.

### Séparation des Services (Logique)
1.  **Identity Service (IAM)** : Gère uniquement `User`, `AuthToken`, `Permissions`. Ne connait pas les projets.
2.  **Financial Service** : Gère `Invoices`, `Payments`, `Wallet`, `BankAccounts`. Données sensibles isolées.
3.  **Core Business Service** : Gère `Projects`, `Tasks`, `Documents`.
4.  **Communication Service** : Gère `Messages`, `Notifications`, `Chat`.

### Modèle de Sécurité
- **Identité** : Authentification forte (simulée pour l'instant), sessions courtes.
- **Paiements** : Pas de stockage de cartes en clair. Conformité PCI-DSS (via intégration future Stripe/LemonWay).
- **Audit Logs** : Chaque action critique (paiement, suppression doc) est logguée avec horodatage et IP.

---

## 3. Interface & Expérience Utilisateur (UI/UX)
*Basé sur Prompts 1 et 2.*

# Hospital Management Platform - Product Specification

## 1. Vision & Architecture
Une plateforme de gestion hospitalière complète (Dossier Patient, Ressources, Staff, Finance) unifiée, sécurisée et "AI-ready".

## 1.1 Architecture Logique
- **Auth & Sécurité** : RBAC, Audit Logs (Supabase/Mock)
- **Core Dashboard** : Vue d'ensemble stratégique (Lits, Urgences, Staff)
- **Patients** : Gestion administrative et clinique
- **Dossier Médical (EMR)** : Historique, Consultations, Ordonnances
- **Personnel** : Gestion RH et Planning
- **Rendez-vous & Agenda** : Planification intelligente
- **Services & Ressources** : Gestion des lits et équipements
- **Facturation** : Gestion financière et assurance

## 2. Structure Fonctionnelle (Modules)

### 2.1 Authentification & Sécurité
- Connexion sécurisée
- Rôles : Super Admin, Médecin, Infirmier, Admin, Comptable
- Journal d'audit complet

### 2.2 Dashboard Central
- KPI Temps réel (Taux d'occupation, Rendez-vous du jour)
- Système d'alertes critiques

### 2.3 & 2.4 Patients & EMR
- Identité, Assurance, Contacts
- Historique médical, Constantes, Documents

### 2.5 & 2.6 Personnel & Agenda
- Profils staff et affectation services
- Agenda multi-vues (Médecin/Salle)

### 2.7 Services & Ressources
- Gestion des chambres et lits (Disponible / Occupé / Nettoyage)

### 2.8 Facturation
- Actes médicaux, Factures, Gestion Tiers-Payant

## 3. Stack Technique
- **Frontend** : React / TypeScript / Vite / Shadcn UI ("Professional Glass" Theme)
- **Backend/Data** : Supabase (Mocked for existing V1)
- **State** : React Query + Zustand

## 4. UX / Navigation (Sidebar)
1. **Dashboard** (Vue d'ensemble)
2. **Patients** (Liste & Dossiers)
3. **Agenda** (Rendez-vous)
4. **Personnel** (Staff & Planning)
5. **Services** (Lits & Chambres)
6. **Facturation** (Finance)
7. **Rapports** (Analytics)
8. **Paramètres** (Admin) 

### Phase 2 : Rigueur des Données
- Refactoring du `mockData.ts` pour séparer les stores (IdentityStore, FinanceStore, ProjectStore).
- Implémentation des types stricts pour les entités financières.

### Phase 3 : Modules Avancés
- Implémentation du Chat contextuel.
- Système de factures et paiements (UI).
- Centre de sécurité et Logs.

---

*Document généré par l'Assistant IA - 14 Décembre 2025*

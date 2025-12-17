# Historique du Chat et Architecture - Adam Architecture Base

Ce document consolide l'historique des modifications, l'architecture technique, et l'état d'avancement du projet Hospital Management Platform au 16 Décembre 2025.

---

## 1. Résumé de la Session (Chat History)

### Objectifs
L'objectif principal était de stabiliser les modules hospitaliers et de corriger les bugs bloquants signalés par l'utilisateur :
1.  **Erreur d'affichage sur la page "Dossier Médical" (Patients)**.
2.  **Impossibilité d'ajouter des patients** (le formulaire ne sauvegardait pas).
3.  **Impossibilité d'ajouter des membres du personnel** (bouton inactif ou erreur).
4.  **Modification de l'Agenda** (impossible de modifier les rendez-vous).
5.  **Problèmes de types TypeScript** stricts bloquant la compilation.

### Actions Réalisées
-   **Correction `PatientsPage.tsx`** : Déplacement des imports `Sheet` qui étaient incorrectement placés à l'intérieur du composant, causant des erreurs de rendu.
-   **Correction `PatientForm.tsx`** : Résolution des incompatibilités de types entre le formulaire (champs optionnels) et le store global (`Zustand`), assurant que les données envoyées respectent l'interface `Patient`.
-   **Correction `StaffPage.tsx` & `StaffForm.tsx`** : Même correction que pour les patients (imports et types), permettant l'ouverture de la modal et l'ajout de personnel.
-   **Correction `AgendaView.tsx`** : Nettoyage des imports dupliqués et implémentation de la logique d'état (`useState`) pour permettre l'édition des rendez-vous existants (changement de salle, médecin).
-   **Vérification** : Une série de tests automatisés (browser subagent) a confirmé que les pages chargent correctement et que les formulaires s'ouvrent.

---

## 2. Architecture Technique (Base)

Voir ci-dessous le contenu du fichier `ARCHITECTURE.md` original, décrivant la structure mise en place.

```markdown
# Architecture Technique : Modules Avancés & Intégrations

Ce document décrit l'architecture des nouvelles fonctionnalités demandées : Formulaire Patient Détaillé, CRUD Services/Staff, et Agenda Avancé.

## 1. Gestion des Patients (Dossier Médical)

### A. Nouveau Formulaire Patient (`PatientForm.tsx`)
**Objectif :** Remplacer le simple bouton par un formulaire complet.
**Stack :** `react-hook-form` + `zod` pour la validation.
**Champs Détaillés :**
- **Identité :** Nom, Prénom, Date de Naissance, Séc. Sociale, Contact (Tél/Email).
- **Médical :** 
    - **Motif d'admission / Nature de la maladie** (Select + Textarea).
    - Antécédents (Tags).
    - Allergies.
- **Administratif :** Mutuelle, Médecin Traitant.

**Flux :**
1.  Clic sur "Nouveau Patient".
2.  Ouverture `Sheet` (Panneau latéral) ou `Dialog` (Modal).
3.  Validation -> Mise à jour du `mockData` (ou Backend).

### B. Vue Dossier Patient (`PatientDetails.tsx`)
**Intégration :** Lier la liste des patients à une page de détail (Route dynamique `/patients/:id`).
**Onglets :** Synthèse, Historique, Documents (integration pdf), Prescriptions.

---

## 2. Gestion Dynamique (Services & Personnel)

### A. Gestion des Services & Lits (`ServiceManager.tsx`)
**Problème actuel :** Données statiques (`mockData` hardcodé).
**Solution :**
- Créer un store local (Zustand) `useHospitalStore` pour manipuler l'état des services/lits.
- **Actions :**
    - `addService(name, floor, color)`
    - `addBed(serviceId, number)`
    - `updateBedStatus(bedId, status)`
- **UI :** Boutons "Ajouter un Service" et "Ajouter un Lit" dans `BedManagementPage` ouvrant des modales de création.

### B. Gestion du Personnel (`StaffManager.tsx`)
**Actions :**
- `addStaffMember(profile)`
- **Formulaire :** Photo (Upload/URL), Spécialité, Rôle, Horaire.

---

## 3. Agenda Avancé & Google Calendar

### A. Refonte de l'Agenda (`SchedulePage.tsx`)
**Améliorations Globales :**
- Utilisation d'un moteur de calendrier robuste (ex: `react-big-calendar` ou version custom améliorée).
- Vues : Mois, Semaine (par heure), Jour (par ressource).

### B. Intégration Google Calendar (`GoogleCalendarService.ts`)
**Stratégie :**
1.  **OAuth React :** Bouton "Connecter Google Calendar".
2.  **Sync Unidirectionnel (Google -> App) :** Récupérer les événements Google et les afficher comme blocks "Occupé".
3.  **Sync Bidirectionnel (App -> Google) :** Pousser les RDV médicaux sur l'agenda du médecin.

> **Note :** Sans backend réel, nous simulerons l'échange OAuth et utiliserons l'API Google Calendar côté client (gapi).

---

## 4. Intégration Externe (`mydoc`)
Si le dépôt `mydoc` contient des interfaces spécifiques (ex: chat patient, téléconsultation), nous extrairons **uniquement** les composants React concernés vers `src/components/external/` pour ne pas polluer l'architecture principale.
```

---

## 3. État d'Avancement (Tasks)

```markdown
- [ ] **Fix & Verification**
    - [ ] Verify routing for `/schedule` and `/resources` <!-- id: 0 -->
    - [ ] Resolve any runtime errors preventing page load <!-- id: 1 -->

- [ ] **Bed Management (Services & Lits)**
    - [ ] Design `BedManagementPage` layout <!-- id: 2 -->
    - [ ] Create `DepartmentGrid` component <!-- id: 3 -->
    - [ ] Create `BedCard` component with status indicators (Occupied, Free, Cleaning) <!-- id: 4 -->
    - [ ] Integrate mock data for beds and departments <!-- id: 5 -->

- [ ] **Agenda (Planning)**
    - [ ] Design `SchedulePage` layout <!-- id: 6 -->
    - [ ] Integrate `FullCalendar` or similar React scheduler <!-- id: 7 -->
    - [ ] Implement views (Daily, Weekly, Resource-based) <!-- id: 8 -->
    - [ ] Add "New Appointment" modal <!-- id: 9 -->

- [ ] **Staff (Personnel)**
    - [x] Design `StaffPage` layout <!-- id: 10 -->
    - [x] Create `StaffCard` component <!-- id: 11 -->
    - [x] Implement filtering (Doctors, Nurses, Admin) <!-- id: 12 -->

- [ ] **Phase 3: Advanced Features & Integrations**
    - [x] **Patient Management**
        - [x] Create detailed `PatientForm` (React Hook Form + Zod) <!-- id: 13 -->
        - [x] Implement "Add Patient" modal with comprehensive fields (Medical, Admin) <!-- id: 14 -->
        - [ ] Create `PatientDetails` page (Dynamic Route) <!-- id: 15 -->
        - [x] Establish backend connection (simulated)
    - [x] **Bug Fixes & Stabilization**
        - [x] Fix `PatientsPage` imports and "display error"
        - [x] Fix `StaffPage` imports and "add staff" functionality
        - [x] Fix `AgendaView` editing and state logic
        - [x] resolve strict type mismatches in forms
    - [x] **Dynamic Management (CRUD)**
        - [x] Create `ServiceManager` store & modal (Add Service/Bed) <!-- id: 16 -->
        - [x] Create `StaffManager` modal (Add Member) <!-- id: 17 -->
        - [x] **NEW:** Implement Staff Team Schedule (Shift View, On-Call visualization) <!-- id: 20 -->
    - [x] **Agenda Enhancements**
        - [x] Integrate Google Calendar API (OAuth simulation) <!-- id: 18 -->
        - [x] Improve Agenda View (Week/Month) with real interactivity <!-- id: 19 -->
```

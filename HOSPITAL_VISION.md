# Vision de Transformation: Cloud Hospital Platform

Ce document détaille la feuille de route pour finaliser la transformation de la plateforme en un système de gestion hospitalier complet (« Cloud Hôpital »).

## 1. Philosophie & Architecture
**Objectif :** Créer un "Cockpit" centralisé pour la gestion médicale, administrative et financière.
**Multi-Tenancy & Rôles (Multi-Admin) :**
- **Super Admin :** Accès global à tous les paramètres techniques du SaaS.
- **Admin Hôpital (Directeur) :** Gestion complète de son établissement (staff, finances, lits).
- **Médecins :** Accès au dossier patient (EMR), Agenda, Prescription.
- **Infirmiers :** Accès à la "Gestion des Lits", Soins, Agenda Visites.
- **Secrétariat / Comptabilité :** Accès Facturation, Admissions.

> **Note Technique :** L'architecture actuelle `mockData` / `AuthProvider` sera étendue pour inclure un champ `role: 'admin' | 'doctor' | 'nurse' | 'accountant'` dans le profil utilisateur.

---

## 2. Refonte des Modules Clés ("Mal Gérés" -> "Excellents")

### A. Agenda (Planification Avancée)
**État actuel :** Redirection vers Dashboard (Inexistant).
**Vision Cible :** 
- **Calendrier Interactif (FullCalendar) :** Vues Jour/Semaine/Mois.
- **Filtrage par Ressource :** Voir le planning d'un Médecin ou d'une Salle d'Opération.
- **Prise de RV :** Drag & drop pour déplacer un patient. Code couleur par type (Consultation, Chirurgie, Urgence).

### B. Gestion des Lits (Bed Management)
**État actuel :** Widget simple sur le Dashboard.
**Vision Cible :**
- **Carte Visuelle des Services :** Grille représentant les chambres par étage/service.
- **Statut en Temps Réel :** Libre (Vert), Occupé (Rouge), Nettoyage (Jaune), Maintenance (Gris).
- **Drag & Drop Patient :** Déplacer un patient d'une chambre à une autre (ex: Urgences -> Cardiologie).

### C. Personnel (Staff Management)
**État actuel :** Redirection vers Dashboard.
**Vision Cible :**
- **Annuaire Trombinoscope :** Cartes profils avec photo, spécialité, contact.
- **Gestion des Gardes :** Qui est de garde ce soir ?
- **Assignation :** Lier des médecins à des services spécifiques.

### D. Dossier Patient (Patients)
**État actuel :** Liste tableau basique.
**Vision Cible :** 
- **Vue 360° du Patient :** Une page détail riche (`StudentView` style).
- **Onglets :** Historique Médical, Prescriptions, Imagerie, Factures, Notes.
- **Timeline :** Chronologie des soins reçus.

---

## 3. Focus : Facturation & Paiement Patient
**Demande Spécifique :** "Chacun sa facture, modifiable, bien présentée".

**Solution Proposée : Le Générateur de Facture Intelligent**
1.  **Facture par Patient :** Chaque patient a un onglet "Finances".
2.  **Éditeur WYSIWYG :** Une interface où l'on voit la facture telle qu'elle sera imprimée (PDF).
3.  **Lignes Modifiables :**
    *   Ajouter un acte (ex: "Consultation Spécialiste").
    *   Modifier le prix unitaire ou la quantité.
    *   Appliquer une couverture mutuelle/assurance (ex: -70%).
4.  **Design Premium :** En-tête avec logo de l'hôpital, tableau clair, totaux calculés automatiquement.

---

## 4. Plan d'Action Immédiat
1.  **Création du Module Facturation :** Mise en place de `BillingPage` avec l'éditeur de facture.
2.  **Scaffolding des Pages Manquantes :** Création des structures pour Agenda, Staff, Lits.
3.  **Mise à jour du Menu :** Pointage des routes vers les vraies pages.

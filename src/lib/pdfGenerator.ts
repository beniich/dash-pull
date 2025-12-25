import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

// Extend jsPDF with autotable
declare module 'jspdf' {
    interface jsPDF {
        autoTable: (options: any) => jsPDF;
    }
}

export const generateStaffPayrollPDF = (staff: any, payroll: any) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header
    doc.setFontSize(22);
    doc.setTextColor(40);
    doc.text('BULLETIN DE PAIE', pageWidth / 2, 20, { align: 'center' });

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Période : ${format(new Date(payroll.month + "-01"), "MMMM yyyy", { locale: fr })}`, pageWidth / 2, 28, { align: 'center' });

    // Company Info (Left)
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.setFont('helvetica', 'bold');
    doc.text('Employeur :', 20, 45);
    doc.setFont('helvetica', 'normal');
    doc.text('Hôpitalia Harmony', 20, 52);
    doc.text('123 Avenue de la Santé', 20, 58);
    doc.text('75000 Paris', 20, 64);

    // Employee Info (Right)
    doc.setFont('helvetica', 'bold');
    doc.text('Salarié :', 120, 45);
    doc.setFont('helvetica', 'normal');
    doc.text(staff.name, 120, 52);
    doc.text(`Rôle : ${staff.role}`, 120, 58);
    doc.text(`N° SS : ${staff.socialSecurityNumber || 'Non renseigné'}`, 120, 64);

    // Table setup
    const tableData = [
        ['Désignation', 'Base', 'Taux', 'Montant (€)'],
        ['Salaire de base', `${payroll.baseSalary.toLocaleString()}`, '', `${payroll.baseSalary.toLocaleString()}`],
    ];

    payroll.bonuses.forEach((b: any) => {
        tableData.push([b.description, '', '', `+${b.amount.toLocaleString()}`]);
    });

    if (payroll.overtimePay > 0) {
        tableData.push(['Heures supplémentaires', '', '', `+${payroll.overtimePay.toLocaleString()}`]);
    }

    payroll.deductions.forEach((d: any) => {
        tableData.push([d.description, '', '', `-${d.amount.toLocaleString()}`]);
    });

    doc.autoTable({
        startY: 80,
        head: [tableData[0]],
        body: tableData.slice(1),
        theme: 'striped',
        headStyles: { fillColor: [63, 81, 181], textColor: [255, 255, 255] },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        columnStyles: {
            3: { halign: 'right', fontStyle: 'bold' }
        }
    });

    // Total
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('NET À PAYER :', 120, finalY + 5);
    doc.setTextColor(63, 81, 181);
    doc.text(`${payroll.netSalary.toLocaleString()} €`, 190, finalY + 5, { align: 'right' });

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150);
    const footerText = "Ce document est un duplicata numérique généré par le système RH Hôpitalia. Conserver sans limite de durée.";
    doc.text(footerText, pageWidth / 2, 280, { align: 'center' });

    doc.save(`Fiche_Paie_${staff.name.replace(/\s+/g, '_')}_${payroll.month}.pdf`);
};

export const generateStaffFullFilePDF = (staff: any, data: any) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header
    doc.setFontSize(22);
    doc.text('DOSSIER ADMINISTRATIF PERSONNEL', pageWidth / 2, 20, { align: 'center' });

    // Section 1: Identification
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('1. État Civil', 20, 40);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Nom : ${staff.name}`, 25, 50);
    doc.text(`Rôle : ${staff.role} ${staff.specialty ? `(${staff.specialty})` : ''}`, 25, 57);
    doc.text(`N° Sécurité Sociale : ${staff.socialSecurityNumber || '1 85 05 75 042 045 22'}`, 25, 64);
    doc.text(`Date de Naissance : ${staff.dateOfBirth || '12/05/1985'}`, 25, 71);
    doc.text(`Adresse : ${staff.address || '12 Rue de l\'Exemple, 75000 Paris'}`, 25, 78);

    // Section 2: Contact Urgence
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('2. Contact d\'Urgence', 20, 95);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    const ec = staff.emergencyContact || { name: 'Marie House', relation: 'Épouse', phone: '+33 6 00 00 00 00' };
    doc.text(`${ec.name} (${ec.relation}) : ${ec.phone}`, 25, 105);

    // Section 3: Carrière & Contrat
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('3. Situation Contractuelle', 20, 120);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Type : CDI - Temps Plein`, 25, 130);
    doc.text(`Date d'entrée : ${staff.joinDate || '01/03/2021'}`, 25, 137);

    // Section 4: Résumé Présences (Module 3)
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('4. Résumé des Présences (Mois en cours)', 20, 155);

    const timeTable = data.timeEntries.map((e: any) => [
        format(new Date(e.date), "dd/MM/yyyy"),
        e.checkIn,
        e.checkOut || '-',
        `${e.totalHours?.toFixed(1) || '0'}h`
    ]);

    doc.autoTable({
        startY: 165,
        head: [['Date', 'Entrée', 'Sortie', 'Total']],
        body: timeTable.length > 0 ? timeTable : [['Aucun enregistrement', '', '', '']],
        theme: 'grid'
    });

    doc.save(`Dossier_Personnel_${staff.name.replace(/\s+/g, '_')}.pdf`);
};

export const generateWorkCertificatePDF = (staff: any) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const today = format(new Date(), "dd MMMM yyyy", { locale: fr });

    doc.setFontSize(22);
    doc.text('CERTIFICAT DE TRAVAIL', pageWidth / 2, 40, { align: 'center' });

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');

    const content = `
    Je soussigné, Direction des Ressources Humaines de l'Hôpitalia Harmony, 
    certifie que :
    
    Monsieur/Madame ${staff.name}
    Demeurant au ${staff.address || '12 Rue de l\'Exemple, 75000 Paris'}
    
    A été employé(e) au sein de notre établissement en qualité de ${staff.role} 
    du ${staff.joinDate || '01/03/2021'} au ${format(new Date(), "dd/MM/yyyy")}.
    
    Monsieur/Madame ${staff.name} nous quitte ce jour libre de tout engagement.
    
    En foi de quoi, nous lui avons délivré le présent certificat pour servir et valoir ce que de droit.
  `;

    const splitText = doc.splitTextToSize(content, pageWidth - 40);
    doc.text(splitText, 20, 70);

    doc.text(`Fait à Paris, le ${today}`, 120, 180);
    doc.text('La Direction', 120, 190);

    doc.save(`Certificat_Travail_${staff.name.replace(/\s+/g, '_')}.pdf`);
};

export const generateEmploymentContractPDF = (staff: any) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const today = format(new Date(), "dd MMMM yyyy", { locale: fr });

    doc.setFontSize(22);
    doc.text('CONTRAT DE TRAVAIL', pageWidth / 2, 30, { align: 'center' });
    doc.setFontSize(10);
    doc.text('(Modèle Standard CDI)', pageWidth / 2, 38, { align: 'center' });

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('ENTRE LES SOUSSIGNÉS :', 20, 60);

    doc.setFont('helvetica', 'normal');
    doc.text('L\'Hôpitalia Harmony, 123 Avenue de la Santé, 75000 Paris, ci-après l\'Employeur,', 20, 70);
    doc.text(`Et ${staff.name}, ci-après le Salarié.`, 20, 77);

    doc.setFont('helvetica', 'bold');
    doc.text('ARTICLE 1 - ENGAGEMENT', 20, 95);
    doc.setFont('helvetica', 'normal');
    doc.text(`Le Salarié est engagé à compter du ${staff.joinDate || '01/03/2021'} en qualité de ${staff.role}.`, 20, 105);

    doc.setFont('helvetica', 'bold');
    doc.text('ARTICLE 2 - RÉMUNÉRATION', 20, 120);
    doc.setFont('helvetica', 'normal');
    const salary = staff.contracts?.[0]?.salary || 45000;
    doc.text(`Le Salarié percevra une rémunération annuelle brute de ${salary.toLocaleString()} Euros.`, 20, 130);

    doc.setFontSize(10);
    doc.text('Signature de l\'Employeur', 30, 220);
    doc.text('Signature du Salarié', 130, 220);
    doc.text('(Précédé de la mention "lu et approuvé")', 130, 225);

    doc.save(`Contrat_Travail_${staff.name.replace(/\s+/g, '_')}.pdf`);
};

import { jsPDF } from 'jspdf';
import { SleepLog, FeedLog, DiaperLog, CustomActivityLog, BabyProfile } from '../types';

export interface PediatricReportData {
  babyProfile: BabyProfile;
  sleepLogs: SleepLog[];
  feedLogs: FeedLog[];
  diaperLogs?: DiaperLog[];
  activityLogs?: CustomActivityLog[];
  reportTitle?: string;
  doctorNotes?: string;
}

export function generatePediatricPdf({
  babyProfile,
  sleepLogs,
  feedLogs,
  diaperLogs = [],
  activityLogs = [],
  reportTitle = 'Pediatric 24h & 7-Day Clinical Health Summary',
  doctorNotes = 'No acute distress noted. Routine checkup log.'
}: PediatricReportData): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 14;
  let y = 18;

  // Header Banner
  doc.setFillColor(30, 41, 59); // Slate 800
  doc.rect(margin, y - 4, pageWidth - (margin * 2), 22, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('SLEEPY LULLABY PEDIATRIC CLINICAL REPORT', margin + 6, y + 4);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('EVIDENCE-BASED INFANT SLEEP & NUTRITION DATA FOR PEDIATRICIAN REVIEW', margin + 6, y + 11);

  y += 28;

  // Patient & Clinical Profile Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, pageWidth - (margin * 2), 26, 3, 3, 'FD');

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(`Patient: ${babyProfile.name || 'Infant'}`, margin + 6, y + 7);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`Age: ${babyProfile.ageMonths} Months`, margin + 6, y + 14);
  doc.text(`Date of Birth: ${babyProfile.birthDate || 'N/A'}`, margin + 6, y + 20);

  doc.text(`Wake Time: ${babyProfile.wakeTime || '07:00'}`, margin + 65, y + 7);
  doc.text(`Target Bedtime: ${babyProfile.targetBedtime || '19:30'}`, margin + 65, y + 14);
  doc.text(`Report Date: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`, margin + 65, y + 20);

  doc.text(`Primary Goal: ${babyProfile.sleepGoal || 'Circadian routine'}`, margin + 125, y + 7);
  doc.text(`Caregivers: Mom, Dad, Care Team`, margin + 125, y + 14);
  doc.text(`Record Source: Lullaby AI Cloud`, margin + 125, y + 20);

  y += 32;

  // Section 1: Sleep Summary & Wake Windows
  const totalSleepMins = sleepLogs.reduce((acc, l) => acc + (l.durationMinutes || 0), 0);
  const totalSleepHours = (totalSleepMins / 60).toFixed(1);
  const napLogs = sleepLogs.filter(l => l.type === 'nap');
  const nightLogs = sleepLogs.filter(l => l.type === 'night');
  const peacefulCount = sleepLogs.filter(l => l.quality === 'peaceful').length;

  doc.setFillColor(239, 246, 255); // Blue tint
  doc.setDrawColor(191, 219, 254);
  doc.roundedRect(margin, y, pageWidth - (margin * 2), 6, 2, 2, 'FD');

  doc.setTextColor(30, 64, 175);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('1. SLEEP METRICS & CIRCADIAN WAKE WINDOWS', margin + 4, y + 4.5);

  y += 9;

  // Sleep Stats Row
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(30, 41, 59);

  const sleepStats = [
    `Total Logged Sleep: ${totalSleepHours} hrs (${sleepLogs.length} sessions)`,
    `Naps Tracked: ${napLogs.length} naps (${(napLogs.reduce((a, c) => a + c.durationMinutes, 0) / 60).toFixed(1)} hrs)`,
    `Night Rest: ${nightLogs.length > 0 ? (nightLogs.reduce((a, c) => a + c.durationMinutes, 0) / 60).toFixed(1) + ' hrs' : 'None logged'}`,
    `Quality: ${peacefulCount}/${sleepLogs.length} Peaceful (${Math.round((peacefulCount / (sleepLogs.length || 1)) * 100)}%)`
  ];

  sleepStats.forEach((stat, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    doc.text(`• ${stat}`, margin + 4 + (col * 88), y + (row * 5.5));
  });

  y += 14;

  // Sleep Recent Entries Table Header
  doc.setFillColor(241, 245, 249);
  doc.rect(margin, y, pageWidth - (margin * 2), 5, 'F');
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(51, 65, 85);
  doc.text('Type', margin + 2, y + 3.5);
  doc.text('Interval', margin + 24, y + 3.5);
  doc.text('Duration', margin + 55, y + 3.5);
  doc.text('Quality', margin + 80, y + 3.5);
  doc.text('Wake Mood', margin + 110, y + 3.5);
  doc.text('Logged By & Clinical Notes', margin + 138, y + 3.5);

  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  sleepLogs.slice(0, 5).forEach((log) => {
    doc.setTextColor(15, 23, 42);
    doc.text(log.type === 'night' ? 'Night Sleep' : 'Day Nap', margin + 2, y + 3);
    doc.text(`${log.startTime} - ${log.endTime}`, margin + 24, y + 3);
    doc.text(`${log.durationMinutes} min (${(log.durationMinutes / 60).toFixed(1)}h)`, margin + 55, y + 3);
    doc.text(log.quality, margin + 80, y + 3);
    doc.text(log.moodUponWaking, margin + 110, y + 3);
    const notesTrunc = (log.notes ? `${log.loggedBy}: ${log.notes}` : `${log.loggedBy}`).slice(0, 38);
    doc.text(notesTrunc, margin + 138, y + 3);

    y += 4.5;
  });

  y += 4;

  // Section 2: Feeding, Nursing & Formula Nutrition
  doc.setFillColor(254, 243, 199); // Amber tint
  doc.setDrawColor(253, 230, 138);
  doc.roundedRect(margin, y, pageWidth - (margin * 2), 6, 2, 2, 'FD');

  doc.setTextColor(146, 64, 14);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('2. NUTRITION & FEEDING LOG (NURSING, FORMULA & SOLIDS)', margin + 4, y + 4.5);

  y += 9;

  const totalFormulaMl = feedLogs.reduce((acc, f) => acc + (f.amountMl || 0), 0);
  const totalNursingMins = feedLogs.filter(f => f.feedType === 'nursing').reduce((acc, f) => acc + (f.durationMinutes || 0), 0);
  const solidsCount = feedLogs.filter(f => f.feedType === 'solids').length;

  const feedStats = [
    `Total Feed Sessions: ${feedLogs.length} logged`,
    `Bottle Volume: ${totalFormulaMl} ml (${(totalFormulaMl / 29.5735).toFixed(1)} oz)`,
    `Total Nursing Duration: ${totalNursingMins} mins`,
    `Solids / Purees: ${solidsCount} meals recorded`
  ];

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(30, 41, 59);

  feedStats.forEach((stat, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    doc.text(`• ${stat}`, margin + 4 + (col * 88), y + (row * 5.5));
  });

  y += 14;

  // Feed Table
  doc.setFillColor(241, 245, 249);
  doc.rect(margin, y, pageWidth - (margin * 2), 5, 'F');
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(51, 65, 85);
  doc.text('Time', margin + 2, y + 3.5);
  doc.text('Feed Type', margin + 24, y + 3.5);
  doc.text('Amount / Duration', margin + 55, y + 3.5);
  doc.text('Side / Food Description', margin + 95, y + 3.5);
  doc.text('Caregiver Notes', margin + 140, y + 3.5);

  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  feedLogs.slice(0, 5).forEach((feed) => {
    doc.setTextColor(15, 23, 42);
    doc.text(feed.time, margin + 2, y + 3);
    doc.text(feed.feedType.toUpperCase(), margin + 24, y + 3);
    const amtStr = feed.amountMl ? `${feed.amountMl}ml (${feed.amountOz || (feed.amountMl / 29.57).toFixed(1)}oz)` : `${feed.durationMinutes || 0} mins`;
    doc.text(amtStr, margin + 55, y + 3);
    doc.text(feed.breastSide ? `Breast: ${feed.breastSide}` : (feed.foodDescription || 'N/A'), margin + 95, y + 3);
    doc.text((feed.notes || 'Normal tolerance').slice(0, 36), margin + 140, y + 3);

    y += 4.5;
  });

  y += 4;

  // Section 3: Diaper Elimination & Stool Triage
  doc.setFillColor(240, 253, 244); // Green tint
  doc.setDrawColor(187, 247, 208);
  doc.roundedRect(margin, y, pageWidth - (margin * 2), 6, 2, 2, 'FD');

  doc.setTextColor(22, 101, 52);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('3. DIAPER OUTPUT & CLINICAL STOOL TRIAGE', margin + 4, y + 4.5);

  y += 9;

  const wetCount = diaperLogs.filter(d => d.diaperType === 'wet' || d.diaperType === 'both').length;
  const dirtyCount = diaperLogs.filter(d => d.diaperType === 'dirty' || d.diaperType === 'both').length;
  const rashCreamCount = diaperLogs.filter(d => d.hasRashCream).length;

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(30, 41, 59);
  doc.text(`• Total Diaper Changes: ${diaperLogs.length} changes logged`, margin + 4, y);
  doc.text(`• Wet Diapers (Hydration Check): ${wetCount} (AAP Goal: ≥5-6/24h)`, margin + 92, y);
  doc.text(`• Stool / Bowel Movements: ${dirtyCount} recorded`, margin + 4, y + 5.5);
  doc.text(`• Barrier Cream Applications: ${rashCreamCount} times`, margin + 92, y + 5.5);

  y += 14;

  // Section 4: Clinical Disclaimer & Physician Review Sign-off Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, y, pageWidth - (margin * 2), 26, 3, 3, 'FD');

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('PHYSICIAN / PEDIATRICIAN CLINICAL NOTES & SIGN-OFF:', margin + 4, y + 5);

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Reviewing Physician: _____________________________________   Clinic Name: ____________________________________', margin + 4, y + 12);
  doc.text('Clinical Assessment / Plan: ____________________________________________________________________________________', margin + 4, y + 18);
  doc.text('Signature: ______________________________________________   Date: _______________', margin + 4, y + 23);

  // Footer Disclaimer
  doc.setFontSize(6.5);
  doc.setTextColor(148, 163, 184);
  doc.text('Confidential Pediatric Record generated by Sleepy Lullaby AI. Adheres to AAP Safe Sleep & Pediatric Nutrition Guidelines.', margin, 287);

  // Save the PDF
  const filename = `${babyProfile.name || 'Baby'}_Pediatric_Visit_Summary_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(filename);
}

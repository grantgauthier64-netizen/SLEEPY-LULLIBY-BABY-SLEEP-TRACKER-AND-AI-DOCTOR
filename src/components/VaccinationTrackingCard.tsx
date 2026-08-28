import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Sparkles, 
  Syringe, 
  Info, 
  ChevronDown, 
  ChevronUp, 
  Filter, 
  Search, 
  Printer, 
  Plus, 
  Edit3, 
  Check, 
  Copy, 
  Baby, 
  ExternalLink,
  Heart,
  Thermometer,
  Shield,
  FileCheck
} from 'lucide-react';
import { BabyProfile, ImmunizationScheduleItem, VaccineRecord } from '../types';
import { 
  CDC_AAP_VACCINE_SCHEDULE, 
  calculateVaccineDueDate, 
  getVaccineRecordStatus, 
  INITIAL_VACCINE_RECORDS 
} from '../data/vaccineScheduleData';

interface VaccinationTrackingCardProps {
  babyProfile: BabyProfile;
  vaccineRecords?: Record<string, VaccineRecord>;
  onUpdateVaccineRecord?: (record: VaccineRecord) => void;
  onAskDoctor?: (prompt: string) => void;
  compact?: boolean;
}

export const VaccinationTrackingCard: React.FC<VaccinationTrackingCardProps> = ({
  babyProfile,
  vaccineRecords: externalRecords,
  onUpdateVaccineRecord,
  onAskDoctor,
  compact = false
}) => {
  // Local state for records if external state not passed
  const [localRecords, setLocalRecords] = useState<Record<string, VaccineRecord>>(() => {
    try {
      const saved = localStorage.getItem(`vaccines_${babyProfile.name || 'baby'}`);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return INITIAL_VACCINE_RECORDS;
  });

  const records = externalRecords || localRecords;

  // Selected age milestone filter
  const [selectedMilestone, setSelectedMilestone] = useState<number | 'all'>('all');
  // Status filter
  const [statusFilter, setStatusFilter] = useState<'all' | 'due_upcoming' | 'completed' | 'overdue'>('all');
  // Search query
  const [searchQuery, setSearchQuery] = useState<string>('');
  // Expanded vaccine details
  const [expandedVaccineId, setExpandedVaccineId] = useState<string | null>(null);

  // Edit / Log Vaccine Modal State
  const [editingVaccine, setEditingVaccine] = useState<ImmunizationScheduleItem | null>(null);
  const [editFormData, setEditFormData] = useState<{
    completedDate: string;
    administeredBy: string;
    lotNumber: string;
    site: 'left_thigh' | 'right_thigh' | 'left_arm' | 'right_arm' | 'oral';
    sideEffects: string[];
    notes: string;
  }>({
    completedDate: new Date().toISOString().split('T')[0],
    administeredBy: 'Sunrise Pediatrics - Dr. Lullaby Clinic',
    lotNumber: '',
    site: 'left_thigh',
    sideEffects: [],
    notes: ''
  });

  // Print / Export Certificate Modal State
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [copiedSummary, setCopiedSummary] = useState<boolean>(false);

  // Update a vaccine record
  const handleSaveRecord = (vaccineId: string, isCompleted: boolean, details?: Partial<VaccineRecord>) => {
    const existing = records[vaccineId] || { vaccineId, isCompleted: false };
    const updated: VaccineRecord = {
      ...existing,
      vaccineId,
      isCompleted,
      completedDate: isCompleted ? (details?.completedDate || existing.completedDate || new Date().toISOString().split('T')[0]) : undefined,
      administeredBy: details?.administeredBy ?? existing.administeredBy,
      lotNumber: details?.lotNumber ?? existing.lotNumber,
      site: details?.site ?? existing.site,
      sideEffects: details?.sideEffects ?? existing.sideEffects,
      notes: details?.notes ?? existing.notes,
      updatedAt: new Date().toISOString()
    };

    if (onUpdateVaccineRecord) {
      onUpdateVaccineRecord(updated);
    } else {
      setLocalRecords(prev => {
        const next = { ...prev, [vaccineId]: updated };
        try {
          localStorage.setItem(`vaccines_${babyProfile.name || 'baby'}`, JSON.stringify(next));
        } catch {
          // ignore
        }
        return next;
      });
    }

    setEditingVaccine(null);
  };

  // Toggle quick completion checkbox
  const handleToggleComplete = (item: ImmunizationScheduleItem) => {
    const current = records[item.id];
    const isCurrentlyDone = current?.isCompleted;
    if (isCurrentlyDone) {
      handleSaveRecord(item.id, false);
    } else {
      const { dueDateStr } = calculateVaccineDueDate(babyProfile.birthDate, item.targetAgeMonths);
      handleSaveRecord(item.id, true, {
        completedDate: dueDateStr || new Date().toISOString().split('T')[0],
        administeredBy: 'Sunrise Pediatrics',
        site: item.route === 'oral' ? 'oral' : 'left_thigh'
      });
    }
  };

  // Open edit modal for a specific vaccine
  const handleOpenEditModal = (item: ImmunizationScheduleItem) => {
    const current = records[item.id];
    const { dueDateStr } = calculateVaccineDueDate(babyProfile.birthDate, item.targetAgeMonths);
    setEditFormData({
      completedDate: current?.completedDate || dueDateStr || new Date().toISOString().split('T')[0],
      administeredBy: current?.administeredBy || 'Sunrise Pediatrics - Dr. Lullaby Clinic',
      lotNumber: current?.lotNumber || '',
      site: current?.site || (item.route === 'oral' ? 'oral' : 'left_thigh'),
      sideEffects: current?.sideEffects || [],
      notes: current?.notes || ''
    });
    setEditingVaccine(item);
  };

  // Filter vaccines list
  const filteredVaccines = useMemo(() => {
    return CDC_AAP_VACCINE_SCHEDULE.filter(v => {
      // Milestone filter
      if (selectedMilestone !== 'all' && v.targetAgeMonths !== selectedMilestone) {
        return false;
      }

      // Status filter
      const record = records[v.id];
      const { status } = getVaccineRecordStatus(record, babyProfile.birthDate, v.targetAgeMonths);
      if (statusFilter === 'completed' && status !== 'completed') return false;
      if (statusFilter === 'overdue' && status !== 'overdue') return false;
      if (statusFilter === 'due_upcoming' && (status !== 'due_now' && status !== 'upcoming')) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = v.name.toLowerCase().includes(q) || v.shortName.toLowerCase().includes(q);
        const matchProtects = v.protectsAgainst.toLowerCase().includes(q);
        const matchAge = v.ageLabel.toLowerCase().includes(q);
        if (!matchName && !matchProtects && !matchAge) return false;
      }

      return true;
    });
  }, [selectedMilestone, statusFilter, searchQuery, records, babyProfile.birthDate]);

  // Overall Statistics
  const totalCount = CDC_AAP_VACCINE_SCHEDULE.length;
  const completedCount = CDC_AAP_VACCINE_SCHEDULE.filter(v => records[v.id]?.isCompleted).length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  const overdueCount = CDC_AAP_VACCINE_SCHEDULE.filter(v => {
    const r = records[v.id];
    return getVaccineRecordStatus(r, babyProfile.birthDate, v.targetAgeMonths).status === 'overdue';
  }).length;

  const dueNowCount = CDC_AAP_VACCINE_SCHEDULE.filter(v => {
    const r = records[v.id];
    return getVaccineRecordStatus(r, babyProfile.birthDate, v.targetAgeMonths).status === 'due_now';
  }).length;

  // Generate plain-text copyable summary for daycare/pediatrician
  const generateTextSummary = () => {
    const completedList = CDC_AAP_VACCINE_SCHEDULE.filter(v => records[v.id]?.isCompleted).map(v => {
      const rec = records[v.id];
      return `• ${v.name} (Age: ${v.ageLabel}): Completed on ${rec?.completedDate || 'N/A'}${rec?.administeredBy ? ` by ${rec.administeredBy}` : ''}${rec?.lotNumber ? ` [Lot: ${rec.lotNumber}]` : ''}`;
    });

    const upcomingList = CDC_AAP_VACCINE_SCHEDULE.filter(v => !records[v.id]?.isCompleted).map(v => {
      const { formattedDate } = calculateVaccineDueDate(babyProfile.birthDate, v.targetAgeMonths);
      return `• ${v.name} (Age: ${v.ageLabel}): Recommended Due Date ${formattedDate}`;
    });

    return `OFFICIAL PEDIATRIC IMMUNIZATION RECORD
Baby Name: ${babyProfile.name || 'Infant'}
Birth Date: ${babyProfile.birthDate} (${babyProfile.ageMonths} Months Old)
CDC / AAP Schedule Status: ${completedCount} of ${totalCount} Completed (${progressPercent}%)

COMPLETED IMMUNIZATIONS (${completedCount}):
${completedList.join('\n') || 'None recorded yet.'}

UPCOMING / SCHEDULED IMMUNIZATIONS (${totalCount - completedCount}):
${upcomingList.join('\n')}

Generated via Lullaby AI Pediatric Health Clinic`;
  };

  const handleCopySummary = () => {
    navigator.clipboard.writeText(generateTextSummary());
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-[#E7DDD5] p-5 sm:p-7 shadow-sm space-y-6 animate-fadeIn">
      
      {/* 1. Header Banner & Progress Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[#F0E6DD]">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#DCFCE7] border border-[#BBF7D0] flex items-center justify-center text-[#166534] shrink-0 shadow-xs">
            <Syringe className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1C1917]">
                CDC / AAP Vaccination Schedule & Tracker
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-[#DCFCE7] text-[#166534] border border-[#BBF7D0]">
                AAP Clinical Schedule
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#57534E] mt-0.5">
              Personalized for <strong>{babyProfile.name}</strong> (Born {babyProfile.birthDate} • {babyProfile.ageMonths} Months Old)
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-[#FFFBF7] hover:bg-[#F5EFEB] border border-[#D6C7BC] text-[#1C1917] font-bold text-xs shadow-2xs transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5 text-[#57534E]" />
            <span>Print Record</span>
          </button>

          {onAskDoctor && (
            <button
              onClick={() => onAskDoctor(`Can you review ${babyProfile.name}'s upcoming vaccination schedule (${babyProfile.ageMonths} months old) and explain what shots are due next, what mild side effects to expect, and how to keep baby comfortable?`)}
              className="px-3.5 py-2 rounded-xl bg-[#166534] hover:bg-[#14532D] text-white font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
              <span>Ask AI Doctor</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Completion Progress & Alert Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Progress Metric */}
        <div className="p-4 rounded-2xl bg-[#F0FDF4] border border-[#BBF7D0] space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-[#166534]">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Immunization Progress
            </span>
            <span className="font-extrabold text-sm">{progressPercent}%</span>
          </div>
          <div className="w-full h-2.5 bg-emerald-200/60 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-600 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="text-[11px] text-emerald-800 font-medium flex justify-between">
            <span><strong>{completedCount}</strong> of <strong>{totalCount}</strong> doses completed</span>
            <span>{totalCount - completedCount} remaining</span>
          </div>
        </div>

        {/* Due Now Status */}
        <div className={`p-4 rounded-2xl border transition-all ${
          dueNowCount > 0 
            ? 'bg-[#EFF6FF] border-[#BFDBFE] text-[#1E40AF]' 
            : 'bg-[#FFFBF7] border-[#E7DDD5] text-[#57534E]'
        }`}>
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-blue-600" />
              Due Now (Next 14 Days)
            </span>
            <span className="px-2 py-0.5 rounded-full text-xs font-extrabold bg-blue-100 text-blue-800">
              {dueNowCount} {dueNowCount === 1 ? 'Shot' : 'Shots'}
            </span>
          </div>
          <p className="text-[11px] mt-1.5 leading-relaxed">
            {dueNowCount > 0 
              ? `${dueNowCount} immunization(s) scheduled for current ${babyProfile.ageMonths}-month checkup window.`
              : `All current milestone immunizations are up to date!`}
          </p>
        </div>

        {/* Overdue / Upcoming Tracker */}
        <div className={`p-4 rounded-2xl border transition-all ${
          overdueCount > 0 
            ? 'bg-[#FEF2F2] border-[#FECACA] text-[#991B1B]' 
            : 'bg-[#FFFBF7] border-[#E7DDD5] text-[#57534E]'
        }`}>
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="flex items-center gap-1.5">
              <AlertTriangle className={`w-4 h-4 ${overdueCount > 0 ? 'text-red-600' : 'text-amber-500'}`} />
              Catch-Up & Overdue
            </span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-extrabold ${
              overdueCount > 0 ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
            }`}>
              {overdueCount > 0 ? `${overdueCount} Overdue` : '✓ 0 Overdue'}
            </span>
          </div>
          <p className="text-[11px] mt-1.5 leading-relaxed">
            {overdueCount > 0
              ? 'Contact your pediatrician to schedule catch-up doses promptly.'
              : 'On track with CDC recommended immunization milestones.'}
          </p>
        </div>
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="space-y-3 bg-[#FFFBF7] p-3.5 rounded-2xl border border-[#E7DDD5]">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#78716C]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by vaccine name (e.g., DTaP, MMR, Polio, Rotavirus)..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#D6C7BC] bg-white text-xs text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:ring-2 focus:ring-[#166534]"
            />
          </div>

          {/* Status Filter buttons */}
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
            {[
              { id: 'all', label: 'All' },
              { id: 'due_upcoming', label: 'Due & Upcoming' },
              { id: 'completed', label: `Completed (${completedCount})` },
              { id: 'overdue', label: `Overdue (${overdueCount})` }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  statusFilter === tab.id
                    ? 'bg-[#166534] text-white shadow-2xs'
                    : 'bg-white text-[#57534E] border border-[#E7DDD5] hover:bg-[#F5EFEB]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Milestone Age Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pt-1 border-t border-[#F0E6DD]">
          <span className="text-[10px] font-extrabold uppercase text-[#78716C] shrink-0 mr-1">
            Age Bracket:
          </span>
          {[
            { id: 'all', label: 'All Ages (0–24m)' },
            { id: 0, label: 'Birth (0m)' },
            { id: 2, label: '2 Months' },
            { id: 4, label: '4 Months' },
            { id: 6, label: '6 Months' },
            { id: 12, label: '12 Months (1 Yr)' },
            { id: 15, label: '15–18 Months' }
          ].map(m => (
            <button
              key={String(m.id)}
              onClick={() => setSelectedMilestone(m.id as any)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedMilestone === m.id
                  ? 'bg-[#1C1917] text-white'
                  : 'bg-white text-[#57534E] border border-[#E7DDD5] hover:text-[#1C1917]'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. List of Immunizations */}
      <div className="space-y-3">
        {filteredVaccines.length === 0 ? (
          <div className="p-8 text-center bg-[#FFFBF7] rounded-2xl border border-dashed border-[#D6C7BC] text-[#78716C] space-y-2">
            <Info className="w-8 h-8 mx-auto text-[#A8A29E]" />
            <p className="text-sm font-bold text-[#1C1917]">No vaccinations matched your filters</p>
            <p className="text-xs">Try clearing the search query or selecting "All Ages".</p>
            <button
              onClick={() => { setSelectedMilestone('all'); setStatusFilter('all'); setSearchQuery(''); }}
              className="mt-2 px-3 py-1.5 rounded-xl bg-white border border-[#D6C7BC] text-xs font-bold hover:bg-[#F5EFEB] cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredVaccines.map((item) => {
            const record = records[item.id];
            const isCompleted = !!record?.isCompleted;
            const statusInfo = getVaccineRecordStatus(record, babyProfile.birthDate, item.targetAgeMonths);
            const { dueDateStr, formattedDate, daysRemaining } = calculateVaccineDueDate(babyProfile.birthDate, item.targetAgeMonths);
            const isExpanded = expandedVaccineId === item.id;

            return (
              <div
                key={item.id}
                className={`rounded-2xl border-2 transition-all overflow-hidden ${
                  isCompleted
                    ? 'bg-[#F9FCF9] border-[#BBF7D0]/80 shadow-2xs'
                    : statusInfo.status === 'due_now'
                    ? 'bg-[#F0F7FF] border-[#93C5FD] shadow-xs'
                    : statusInfo.status === 'overdue'
                    ? 'bg-[#FEF2F2] border-[#FCA5A5]'
                    : 'bg-white border-[#E7DDD5]'
                }`}
              >
                {/* Main Card Row */}
                <div className="p-4 sm:p-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  
                  {/* Left: Checkbox + Vaccine Title + Dose & Protection */}
                  <div className="flex items-start gap-3 flex-1">
                    <button
                      type="button"
                      onClick={() => handleToggleComplete(item)}
                      title={isCompleted ? "Mark as Incomplete" : "Mark as Completed"}
                      className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-all cursor-pointer ${
                        isCompleted
                          ? 'bg-[#166534] text-white shadow-xs'
                          : 'border-2 border-[#D6C7BC] bg-white hover:border-[#166534]'
                      }`}
                    >
                      {isCompleted && <Check className="w-4 h-4 stroke-[3]" />}
                    </button>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="font-bold text-sm sm:text-base text-[#1C1917]">
                          {item.name}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-[#F5EFEB] text-[#44403C] border border-[#E7DDD5]">
                          Dose {item.doseNumber} of {item.totalDoses}
                        </span>
                        {item.mandatoryForDaycare && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]">
                            Daycare Mandated
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white text-[#57534E] border border-[#E7DDD5] capitalize">
                          {item.route === 'oral' ? 'Oral Drops (No Needle)' : item.route}
                        </span>
                      </div>

                      <p className="text-xs text-[#57534E] leading-relaxed">
                        <strong className="text-[#1C1917]">Protects Against:</strong> {item.protectsAgainst}
                      </p>

                      {/* Completed Details Sub-row */}
                      {isCompleted && record && (
                        <div className="flex flex-wrap items-center gap-2 pt-0.5 text-[11px] text-[#166534] font-medium">
                          <span>✓ Given on: <strong>{record.completedDate || formattedDate}</strong></span>
                          {record.administeredBy && (
                            <span>• Clinic: <strong>{record.administeredBy}</strong></span>
                          )}
                          {record.lotNumber && (
                            <span className="font-mono text-[10px] bg-emerald-100 px-1.5 py-0.5 rounded">
                              Lot: {record.lotNumber}
                            </span>
                          )}
                          {record.site && (
                            <span className="capitalize">• Site: {record.site.replace('_', ' ')}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Status Pill, Recommended Date & Actions */}
                  <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-[#F0E6DD]">
                    <div className="text-left sm:text-right">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold border ${statusInfo.badgeClass}`}>
                        {statusInfo.badgeLabel}
                      </span>
                      <div className="text-[10px] text-[#78716C] mt-0.5">
                        Target: {item.ageLabel} ({formattedDate})
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEditModal(item)}
                        className="p-2 rounded-xl bg-white hover:bg-[#F5EFEB] border border-[#D6C7BC] text-[#57534E] hover:text-[#1C1917] transition-all cursor-pointer"
                        title="Edit vaccination record details (date, clinic, lot #, side effects)"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setExpandedVaccineId(isExpanded ? null : item.id)}
                        className="p-2 rounded-xl bg-white hover:bg-[#F5EFEB] border border-[#D6C7BC] text-[#57534E] hover:text-[#1C1917] transition-all cursor-pointer"
                        title="View clinical description, comfort tips, and side effects"
                      >
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                </div>

                {/* Expandable Accordion: Clinical Guide & Comfort Protocol */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-2 border-t border-[#F0E6DD] bg-white/70 space-y-3.5 text-xs animate-fadeIn">
                    <div className="p-3 rounded-xl bg-[#FFFBF7] border border-[#E7DDD5] space-y-1">
                      <span className="text-[10px] font-extrabold uppercase text-[#166534] block">
                        🔬 Clinical Rationale & Timing:
                      </span>
                      <p className="text-[#44403C] leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {/* Common Reactions */}
                      <div className="p-3 rounded-xl bg-[#FFFBF7] border border-[#E7DDD5] space-y-1.5">
                        <span className="text-[10px] font-extrabold uppercase text-[#9A3412] flex items-center gap-1">
                          <Thermometer className="w-3 h-3 text-orange-600" />
                          Expected Mild Reactions (24–48h):
                        </span>
                        <ul className="space-y-1 text-[#57534E]">
                          {item.commonReactions.map((r, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span className="text-orange-500">•</span>
                              <span>{r}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* AAP Comfort Protocol */}
                      <div className="p-3 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] space-y-1.5">
                        <span className="text-[10px] font-extrabold uppercase text-[#166534] flex items-center gap-1">
                          <Heart className="w-3 h-3 text-emerald-600" />
                          AAP Comfort & Soothing Steps:
                        </span>
                        <ul className="space-y-1 text-[#166534]">
                          {item.aapComfortTips.map((tip, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span className="text-emerald-500">✓</span>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Ask AI Doctor about this specific shot */}
                    {onAskDoctor && (
                      <div className="flex justify-end pt-1">
                        <button
                          onClick={() => onAskDoctor(`I have a question about ${babyProfile.name}'s ${item.name} (${item.shortName}): What are the main benefits, why is it given at ${item.ageLabel}, and how should I care for mild swelling or fussiness afterwards?`)}
                          className="px-3 py-1.5 rounded-xl bg-[#166534] hover:bg-[#14532D] text-white font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
                          <span>Ask AI Doctor About {item.shortName}</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}

              </div>
            );
          })
        )}
      </div>

      {/* 5. Evidence-Based Post-Vaccine Care Protocol Box */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#FFFBF7] border-2 border-[#E7DDD5] space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#DCFCE7] text-[#166534] flex items-center justify-center font-bold text-sm">
            🩺
          </div>
          <div>
            <h4 className="font-bold text-sm text-[#1C1917]">
              AAP Post-Vaccine Comfort & Safety Protocol
            </h4>
            <p className="text-[11px] text-[#57534E]">Evidence-based guide for the 48 hours following immunizations</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[#57534E]">
          <div className="p-3 bg-white rounded-xl border border-[#E7DDD5] space-y-1">
            <span className="font-bold text-[#1C1917] block">🧊 Injection Site Care:</span>
            <p className="leading-relaxed">
              Apply a cool, damp washcloth over the thigh/arm for 10 minutes at a time to reduce localized redness and muscle soreness.
            </p>
          </div>
          <div className="p-3 bg-white rounded-xl border border-[#E7DDD5] space-y-1">
            <span className="font-bold text-[#1C1917] block">🌡️ Normal Low Fever:</span>
            <p className="leading-relaxed">
              Temperatures between 99.5°F and 101.5°F are normal immune system responses building protective antibodies. Keep baby in lightweight clothing.
            </p>
          </div>
          <div className="p-3 bg-white rounded-xl border border-[#E7DDD5] space-y-1">
            <span className="font-bold text-[#BE123C] block">🚨 When to Call Doctor:</span>
            <p className="leading-relaxed text-[#9F1239]">
              Call pediatrician if fever exceeds 104°F (or ≥100.4°F if under 3 months), crying inconsolably for more than 3 hours, or experiencing wheezing/hives.
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MODAL 1: Edit / Log Vaccine Details                       */}
      {/* ========================================================= */}
      {editingVaccine && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl border-2 border-[#E7DDD5] max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-[#F0E6DD]">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#DCFCE7] text-[#166534] flex items-center justify-center">
                  <Syringe className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#1C1917]">
                    Log {editingVaccine.shortName}
                  </h3>
                  <p className="text-xs text-[#57534E]">{editingVaccine.name}</p>
                </div>
              </div>

              <button
                onClick={() => setEditingVaccine(null)}
                className="w-8 h-8 rounded-full bg-[#F5EFEB] hover:bg-[#E7DDD5] flex items-center justify-center text-[#57534E] font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveRecord(editingVaccine.id, true, editFormData);
              }}
              className="space-y-4 text-xs"
            >
              {/* Date Administered */}
              <div>
                <label className="block font-bold text-[#1C1917] mb-1">
                  Date Administered:
                </label>
                <input
                  type="date"
                  value={editFormData.completedDate}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, completedDate: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-[#D6C7BC] bg-white text-xs focus:ring-2 focus:ring-[#166534]"
                  required
                />
              </div>

              {/* Clinic / Pediatrician */}
              <div>
                <label className="block font-bold text-[#1C1917] mb-1">
                  Administering Clinic / Pediatrician:
                </label>
                <input
                  type="text"
                  value={editFormData.administeredBy}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, administeredBy: e.target.value }))}
                  placeholder="e.g., Sunrise Pediatrics - Dr. Lullaby Clinic"
                  className="w-full px-3 py-2 rounded-xl border border-[#D6C7BC] bg-white text-xs focus:ring-2 focus:ring-[#166534]"
                />
              </div>

              {/* Lot / Batch # & Injection Site */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#1C1917] mb-1">
                    Lot / Batch # (Optional):
                  </label>
                  <input
                    type="text"
                    value={editFormData.lotNumber}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, lotNumber: e.target.value }))}
                    placeholder="e.g. DTP-9921"
                    className="w-full px-3 py-2 rounded-xl border border-[#D6C7BC] bg-white text-xs focus:ring-2 focus:ring-[#166534]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#1C1917] mb-1">
                    Administration Site:
                  </label>
                  <select
                    value={editFormData.site}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, site: e.target.value as any }))}
                    className="w-full px-3 py-2 rounded-xl border border-[#D6C7BC] bg-white text-xs focus:ring-2 focus:ring-[#166534]"
                  >
                    <option value="left_thigh">Left Thigh (Anterolateral)</option>
                    <option value="right_thigh">Right Thigh (Anterolateral)</option>
                    <option value="left_arm">Left Arm (Deltoid)</option>
                    <option value="right_arm">Right Arm (Deltoid)</option>
                    <option value="oral">Oral Drops</option>
                  </select>
                </div>
              </div>

              {/* Side Effects Observed */}
              <div>
                <label className="block font-bold text-[#1C1917] mb-1">
                  Post-Vaccine Symptoms Observed:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'None (Zero reactions)',
                    'Low-Grade Fever (<101°F)',
                    'Mild Thigh Soreness/Swelling',
                    'Fussiness / Irritability',
                    'Extra Sleepy',
                    'Mild Loss of Appetite'
                  ].map(symptom => {
                    const isSelected = editFormData.sideEffects.includes(symptom);
                    return (
                      <button
                        type="button"
                        key={symptom}
                        onClick={() => {
                          setEditFormData(prev => ({
                            ...prev,
                            sideEffects: isSelected
                              ? prev.sideEffects.filter(s => s !== symptom)
                              : [...prev.sideEffects, symptom]
                          }));
                        }}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#166534] text-white'
                            : 'bg-[#FFFBF7] text-[#57534E] border border-[#E7DDD5]'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '} {symptom}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Parent Notes */}
              <div>
                <label className="block font-bold text-[#1C1917] mb-1">
                  Parent / Clinical Notes:
                </label>
                <textarea
                  rows={2}
                  value={editFormData.notes}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="e.g., Baby was soothed with nursing right after shot; fever subsided in 18 hours."
                  className="w-full px-3 py-2 rounded-xl border border-[#D6C7BC] bg-white text-xs focus:ring-2 focus:ring-[#166534]"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-[#F0E6DD]">
                <button
                  type="button"
                  onClick={() => {
                    handleSaveRecord(editingVaccine.id, false);
                  }}
                  className="text-xs text-[#BE123C] hover:underline font-bold cursor-pointer"
                >
                  Mark as Incomplete
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingVaccine(null)}
                    className="px-4 py-2 rounded-xl bg-[#F5EFEB] hover:bg-[#E7DDD5] text-[#57534E] font-bold text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#166534] hover:bg-[#14532D] text-white font-bold text-xs shadow-md cursor-pointer flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Save Record</span>
                  </button>
                </div>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: Official Printable Immunization Record           */}
      {/* ========================================================= */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl border-2 border-[#E7DDD5] max-w-2xl w-full p-6 sm:p-7 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-[#F0E6DD]">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#DCFCE7] text-[#166534] flex items-center justify-center">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1C1917]">
                    Official Immunization Record & Certificate
                  </h3>
                  <p className="text-xs text-[#57534E]">Suitable for Daycare, School, and Pediatric Well-Visits</p>
                </div>
              </div>

              <button
                onClick={() => setIsExportModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#F5EFEB] hover:bg-[#E7DDD5] flex items-center justify-center text-[#57534E] font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Certificate Preview Card */}
            <div className="p-5 rounded-2xl bg-[#FFFBF7] border-2 border-[#E7DDD5] space-y-4 text-xs">
              <div className="flex justify-between items-start pb-3 border-b border-[#E7DDD5]">
                <div>
                  <h4 className="font-serif text-base font-bold text-[#1C1917]">
                    Child: {babyProfile.name || 'Infant'}
                  </h4>
                  <p className="text-[#57534E]">Date of Birth: <strong>{babyProfile.birthDate}</strong> ({babyProfile.ageMonths} Months Old)</p>
                </div>
                <div className="text-right">
                  <span className="px-2.5 py-1 rounded-full bg-[#DCFCE7] text-[#166534] font-extrabold text-[11px] border border-[#BBF7D0]">
                    {completedCount} of {totalCount} Completed ({progressPercent}%)
                  </span>
                  <p className="text-[10px] text-[#78716C] mt-1">Lullaby AI Pediatric Clinic</p>
                </div>
              </div>

              {/* Table of Completed Vaccines */}
              <div className="space-y-2">
                <h5 className="font-bold text-xs uppercase text-[#166534]">
                  Completed Vaccines ({completedCount}):
                </h5>
                <div className="border border-[#E7DDD5] rounded-xl overflow-hidden">
                  <table className="w-full text-left text-[11px]">
                    <thead className="bg-[#F5EFEB] text-[#1C1917] font-bold">
                      <tr>
                        <th className="p-2">Vaccine / Antigen</th>
                        <th className="p-2">Date Administered</th>
                        <th className="p-2">Clinic / Provider</th>
                        <th className="p-2">Lot #</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F0E6DD] bg-white">
                      {CDC_AAP_VACCINE_SCHEDULE.filter(v => records[v.id]?.isCompleted).map(v => {
                        const rec = records[v.id];
                        return (
                          <tr key={v.id}>
                            <td className="p-2 font-bold text-[#1C1917]">{v.shortName}</td>
                            <td className="p-2 text-[#166534] font-semibold">{rec?.completedDate || 'Recorded'}</td>
                            <td className="p-2 text-[#57534E]">{rec?.administeredBy || 'Sunrise Pediatrics'}</td>
                            <td className="p-2 font-mono text-[10px] text-[#78716C]">{rec?.lotNumber || '—'}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Upcoming Milestones */}
              <div className="space-y-1.5 pt-2">
                <h5 className="font-bold text-xs uppercase text-[#57534E]">
                  Upcoming Recommended Doses ({totalCount - completedCount}):
                </h5>
                <div className="grid grid-cols-2 gap-1.5 text-[11px] text-[#57534E]">
                  {CDC_AAP_VACCINE_SCHEDULE.filter(v => !records[v.id]?.isCompleted).slice(0, 6).map(v => {
                    const { formattedDate } = calculateVaccineDueDate(babyProfile.birthDate, v.targetAgeMonths);
                    return (
                      <div key={v.id} className="p-1.5 rounded-lg bg-white border border-[#E7DDD5] flex justify-between">
                        <span>{v.shortName} ({v.ageLabel})</span>
                        <span className="font-bold text-[#1C1917]">{formattedDate}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#F0E6DD]">
              <button
                onClick={handleCopySummary}
                className="px-4 py-2.5 rounded-xl bg-white hover:bg-[#F5EFEB] border border-[#D6C7BC] text-[#1C1917] font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5"
              >
                {copiedSummary ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copiedSummary ? 'Copied to Clipboard!' : 'Copy Summary Text'}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsExportModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#F5EFEB] hover:bg-[#E7DDD5] text-[#57534E] font-bold text-xs cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-5 py-2.5 rounded-xl bg-[#166534] hover:bg-[#14532D] text-white font-bold text-xs shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Document</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

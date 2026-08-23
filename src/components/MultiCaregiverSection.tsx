import React, { useState } from 'react';
import { Users, UserPlus, Check, Bell, Share2, MessageSquare } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CAREGIVERS_LIST } from '../data/sleepData';
import { Caregiver } from '../types';

export const MultiCaregiverSection: React.FC = () => {
  const [caregivers, setCaregivers] = useState<Caregiver[]>(CAREGIVERS_LIST);
  const [activeCaregiverId, setActiveCaregiverId] = useState<string>('caregiver-1');
  const [shiftNote, setShiftNote] = useState<string>(
    'Baby Maya woke happy at 2:15 PM from Nap 2. Ate 140ml formula at 2:30 PM, clean diaper changed. Next nap sweet-spot window opens at 4:30 PM.'
  );
  const [copiedHandover, setCopiedHandover] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteRole, setInviteRole] = useState<'Mom' | 'Dad' | 'Nanny' | 'Grandparent' | 'Night Nurse'>('Nanny');

  const activeCaregiver = caregivers.find((c) => c.id === activeCaregiverId) || caregivers[0];

  const handleCopyHandover = () => {
    navigator.clipboard.writeText(`🍼 Sleepy Lullaby Dreams Shift Handover (${activeCaregiver.name}):\n${shiftNote}\n✨ Target next wake window: 4:30 PM`);
    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.8 },
      colors: ['#FF5A5F', '#38BDF8', '#C084FC', '#FDE047']
    });
    setCopiedHandover(true);
    setTimeout(() => setCopiedHandover(false), 2500);
  };

  const handleAddCaregiver = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim()) return;

    const newC: Caregiver = {
      id: `caregiver-${Date.now()}`,
      name: `${inviteName.trim()} (${inviteRole})`,
      role: inviteRole,
      avatarBg: inviteRole === 'Nanny' ? 'bg-[#E8F5E9] text-[#1E7B28] border-[#C8E6C9]' : 'bg-[#E0F2FE] text-[#0369A1] border-[#BAE6FD]',
      avatarEmoji: inviteRole === 'Mom' ? '👩‍🦰' : inviteRole === 'Dad' ? '👨‍🦱' : inviteRole === 'Nanny' ? '👩‍⚕️' : '👵',
      lastActive: 'Just invited to family team',
      isCurrentShift: false
    };

    setCaregivers([...caregivers, newC]);
    setInviteName('');
    setInviteModalOpen(false);
  };

  return (
    <section id="multi-caregiver" className="py-20 bg-[#FFFBF7]/60 backdrop-blur-[1px] relative overflow-hidden border-t border-[#F0E6DD]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <div className="inline-block px-4 py-1.5 bg-[#E8F5E9] text-[#1E7B28] rounded-full text-xs font-extrabold uppercase tracking-widest shadow-xs border border-[#C8E6C9]">
            Multi-Caregiver Support • Family Teamwork
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#1C1917] tracking-tight">
            Never ask "When did they last nap?" <span className="text-[#FF5A5F] italic">ever again</span>
          </h2>
          <p className="text-base sm:text-lg text-[#292524] font-normal leading-relaxed">
            Seamless multi-device sync for Moms, Dads, Nannies, Grandparents, and Babysitters.
            Instant handovers eliminate guesswork and protect your baby’s routine.
          </p>
        </div>

        {/* Interactive Caregiver Simulation Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Caregiver Team Roster */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-white rounded-[36px] border-2 border-[#E7DDD5] p-6 sm:p-8 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#F0E6DD]">
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#1C1917]">
                    Connected Family Team
                  </h3>
                  <p className="text-xs text-[#57534E] font-medium">
                    Real-time push sync across iOS, Android & Web
                  </p>
                </div>
                <button
                  onClick={() => setInviteModalOpen(true)}
                  className="px-4 py-2 rounded-full text-xs font-extrabold text-white bg-[#FF5A5F] hover:bg-[#FF4147] transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-[#FF5A5F]/35"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>+ Invite</span>
                </button>
              </div>

              {/* List of Caregivers */}
              <div className="space-y-2.5">
                {caregivers.map((cg) => {
                  const isSelected = activeCaregiverId === cg.id;
                  return (
                    <button
                      key={cg.id}
                      onClick={() => setActiveCaregiverId(cg.id)}
                      className={`w-full p-4 rounded-2xl border-2 transition-all text-left flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-[#FFFBF7] border-[#FF5A5F] shadow-sm ring-1 ring-[#FF5A5F]/30'
                          : 'bg-[#FFFBF7]/50 border-[#E7DDD5] hover:bg-white hover:border-[#D6C7BC]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xl border-2 ${cg.avatarBg}`}>
                          {cg.avatarEmoji}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-serif font-bold text-sm text-[#1C1917]">
                              {cg.name}
                            </span>
                            {isSelected && (
                              <span className="px-2.5 py-0.5 rounded-full bg-[#FF5A5F] text-white text-[10px] font-extrabold shadow-2xs">
                                Active Shift
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-[#57534E] font-semibold mt-0.5">
                            {cg.lastActive}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-xs text-[#1E7B28] font-bold bg-[#E8F5E9] border border-[#C8E6C9] px-2.5 py-1 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#1E7B28]" />
                        <span>Synced</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Caregiver Features Checklist */}
              <div className="pt-3 border-t border-[#F0E6DD] space-y-2 text-xs font-semibold text-[#44403C]">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#16A34A] stroke-[3]" />
                  <span>Unlimited caregivers on every account</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#16A34A] stroke-[3]" />
                  <span>Granular privacy permissions for nannies & sitters</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#16A34A] stroke-[3]" />
                  <span>Instant sleep window push notifications</span>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Live Shift Handover Console */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-[36px] border-2 border-[#E7DDD5] p-6 sm:p-8 shadow-sm space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F0E6DD]">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-xl font-bold text-[#1C1917]">
                      Smart Shift Handover Generator
                    </h3>
                    <span className="px-3 py-0.5 rounded-full bg-[#FEF3C7] text-[#B45309] text-xs font-extrabold border border-[#FDE68A]">
                      Auto-Compiled
                    </span>
                  </div>
                  <p className="text-xs text-[#57534E] font-semibold mt-0.5">
                    Logging as: <strong className="text-[#1C1917]">{activeCaregiver.name}</strong>
                  </p>
                </div>

                <button
                  onClick={handleCopyHandover}
                  className="px-5 py-2.5 rounded-full text-xs font-extrabold text-white bg-[#FF5A5F] hover:bg-[#FF4147] transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-[#FF5A5F]/35 self-start sm:self-auto"
                >
                  <Share2 className="w-4 h-4" />
                  <span>{copiedHandover ? 'Copied Handover!' : 'Copy Shift Summary'}</span>
                </button>
              </div>

              {/* Quick Status Cards Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-[#FFFBF7] border-2 border-[#E7DDD5]">
                  <p className="text-[11px] font-extrabold text-[#57534E] uppercase">Last Nap Finished</p>
                  <p className="font-serif text-base font-bold text-[#1C1917] mt-0.5">2:15 PM (1h 15m)</p>
                  <p className="text-[10px] text-[#1E7B28] font-bold">Awake 45 mins</p>
                </div>
                <div className="p-4 rounded-2xl bg-[#FFFBF7] border-2 border-[#E7DDD5]">
                  <p className="text-[11px] font-extrabold text-[#57534E] uppercase">Last Feeding</p>
                  <p className="font-serif text-base font-bold text-[#1C1917] mt-0.5">2:30 PM (140ml)</p>
                  <p className="text-[10px] text-[#57534E] font-bold">Next feed ~5:30 PM</p>
                </div>
                <div className="p-4 rounded-2xl bg-[#FFFBF7] border-2 border-[#E7DDD5]">
                  <p className="text-[11px] font-extrabold text-[#57534E] uppercase">Next Sweet Spot</p>
                  <p className="font-serif text-base font-bold text-[#FF5A5F] mt-0.5">4:30 – 4:45 PM</p>
                  <p className="text-[10px] text-[#FF5A5F] font-bold">Catnap 30 mins</p>
                </div>
              </div>

              {/* Handover Message Box */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#1C1917] flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-[#FF5A5F]" />
                    <span>Caregiver Handover Note (Shareable to WhatsApp / SMS):</span>
                  </label>
                  <span className="text-[11px] text-[#57534E] font-semibold">Editable</span>
                </div>
                <textarea
                  value={shiftNote}
                  onChange={(e) => setShiftNote(e.target.value)}
                  rows={4}
                  className="w-full p-4 rounded-2xl bg-[#FFFBF7] border-2 border-[#D6C7BC] text-sm text-[#1C1917] font-medium focus:outline-none focus:ring-2 focus:ring-[#FF5A5F] leading-relaxed resize-none"
                />
              </div>

              {/* Caregiver Notification Preferences Simulation */}
              <div className="p-4 rounded-2xl bg-[#EDE9FE] border border-[#DDD6FE] flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white text-[#6D28D9] flex items-center justify-center shadow-xs">
                    <Bell className="w-4 h-4 text-[#6D28D9]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#5B21B6]">15-Minute Sweet Spot Alert</p>
                    <p className="text-[11px] text-[#6D28D9] font-medium">Notify partner when nap window is approaching</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#6D28D9] text-white text-xs font-extrabold shadow-2xs">
                  Enabled
                </span>
              </div>

            </div>
          </div>

        </div>

        {/* Invite Caregiver Modal */}
        {inviteModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <form
              onSubmit={handleAddCaregiver}
              className="bg-white rounded-[36px] border-2 border-[#E7DDD5] max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl animate-scaleUp"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#F0E6DD]">
                <h3 className="font-serif text-xl font-bold text-[#1C1917]">
                  Invite a Family Caregiver
                </h3>
                <button
                  type="button"
                  onClick={() => setInviteModalOpen(false)}
                  className="text-xs text-[#57534E] hover:text-[#1C1917] font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-[#1C1917] mb-1.5">
                  Caregiver Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. David, Grandma Joan, Nurse Lily"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#FFFBF7] rounded-xl border-2 border-[#D6C7BC] text-sm text-[#1C1917] font-medium focus:outline-none focus:ring-2 focus:ring-[#FF5A5F]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-[#1C1917] mb-1.5">
                  Role in Family
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as any)}
                  className="w-full px-4 py-2.5 bg-[#FFFBF7] rounded-xl border-2 border-[#D6C7BC] text-sm text-[#1C1917] font-medium focus:outline-none focus:ring-2 focus:ring-[#FF5A5F]"
                >
                  <option value="Mom">Mom</option>
                  <option value="Dad">Dad</option>
                  <option value="Nanny">Nanny / Au Pair</option>
                  <option value="Grandparent">Grandparent</option>
                  <option value="Night Nurse">Night Nurse / Doula</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setInviteModalOpen(false)}
                  className="px-5 py-2 rounded-full text-xs font-bold text-[#1C1917] border border-[#D6C7BC] hover:bg-[#F0E6DD]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full text-xs font-extrabold text-white bg-[#FF5A5F] hover:bg-[#FF4147] shadow-lg shadow-[#FF5A5F]/35 cursor-pointer"
                >
                  Send Invite & Sync
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </section>
  );
};

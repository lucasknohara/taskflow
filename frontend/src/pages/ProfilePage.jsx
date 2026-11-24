import { useCallback, useEffect, useMemo, useState } from 'react';
import { CalendarDays, Check, LoaderCircle, Mail, RotateCcw, Save, UserRound } from 'lucide-react';
import AppShell from '../components/AppShell';
import Toast from '../components/Toast';
import { useAuth } from '../contexts/AuthContext';
import { getErrorMessage } from '../lib/api';
import { profileService } from '../services/profile';

function getInitials(name = '') {
  return name.trim().split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || 'U';
}

function formatDate(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }).format(date);
}

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [fieldError, setFieldError] = useState('');
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success') => setToast({ message, type }), []);

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      const currentProfile = await profileService.getMe();
      setProfile(currentProfile);
      setForm({ name: currentProfile.name, email: currentProfile.email });
      updateUser({ name: currentProfile.name, email: currentProfile.email });
    } catch (error) {
      setLoadError(getErrorMessage(error, 'Não foi possível carregar seu perfil.'));
    } finally {
      setLoading(false);
    }
  }, [updateUser]);

  useEffect(() => { loadProfile(); }, [loadProfile]);

  const changed = useMemo(() => (
    form.name.trim() !== (profile?.name || '') || form.email.trim() !== (profile?.email || '')
  ), [form, profile]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setFieldError('');
  };

  const handleReset = () => {
    setForm({ name: profile?.name || '', email: profile?.email || '' });
    setFieldError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const name = form.name.trim();
    const email = form.email.trim();

    if (!name) {
      setFieldError('Informe seu nome.');
      return;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFieldError('Informe um e-mail válido.');
      return;
    }
    if (!changed) return;

    setSaving(true);
    setFieldError('');
    try {
      const updated = await profileService.updateMe({ name, email });
      const nextProfile = { ...profile, ...updated, name: updated.name || name, email: updated.email || email };
      setProfile(nextProfile);
      setForm({ name: nextProfile.name, email: nextProfile.email });
      updateUser({ name: nextProfile.name, email: nextProfile.email });
      showToast('Perfil atualizado.');
    } catch (error) {
      setFieldError(getErrorMessage(error, 'Não foi possível atualizar seu perfil.'));
    } finally {
      setSaving(false);
    }
  };

  const joinedAt = formatDate(profile?.createdAt);

  return (
    <AppShell>
      <div className="mx-auto max-w-[1040px] px-5 pb-14 pt-9 sm:px-8 sm:pt-11">
        <div className="mb-8">
          <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.11em] text-[#8b958c]">Conta</p>
          <h1 className="text-[27px] font-semibold tracking-[-0.05em] text-ink sm:text-[30px]">Meu perfil</h1>
          <p className="mt-1.5 text-[13px] text-muted">Visualize e atualize suas informações pessoais.</p>
        </div>

        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-36 rounded-xl border border-line bg-white" />
            <div className="h-[310px] rounded-xl border border-line bg-white" />
          </div>
        ) : loadError ? (
          <section className="rounded-xl border border-[#eadbd7] bg-white px-6 py-10 text-center">
            <h2 className="text-sm font-semibold text-ink">Não foi possível carregar seu perfil</h2>
            <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-muted">{loadError}</p>
            <button type="button" onClick={loadProfile} className="btn-secondary mt-4">Tentar novamente</button>
          </section>
        ) : (
          <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
            <div className="space-y-5">
              <section className="rounded-xl border border-line bg-white p-5 shadow-[0_1px_2px_rgba(24,34,25,0.025)] sm:p-6">
                <div className="flex items-center gap-4">
                  <div className="grid h-[58px] w-[58px] shrink-0 place-items-center rounded-full bg-[#e5ede5] text-[17px] font-semibold tracking-[-0.04em] text-[#365a43]">
                    {getInitials(profile?.name)}
                  </div>
                  <div className="min-w-0">
                    <h2 className="truncate text-[16px] font-semibold tracking-[-0.025em] text-ink">{profile?.name || 'Seu nome'}</h2>
                    <p className="mt-1 truncate text-[12px] text-muted">{profile?.email || 'Seu e-mail'}</p>
                  </div>
                </div>
              </section>

              <section className="rounded-xl border border-line bg-white p-5 shadow-[0_1px_2px_rgba(24,34,25,0.025)] sm:p-6">
                <div className="mb-6 border-b border-line pb-4">
                  <h2 className="text-[14px] font-semibold tracking-[-0.02em] text-ink">Informações pessoais</h2>
                  <p className="mt-1 text-[11px] text-muted">Essas informações identificam sua conta no Taskflow.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="profile-name" className="field-label mb-1.5">Nome</label>
                    <div className="relative">
                      <UserRound size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#929c93]" />
                      <input id="profile-name" name="name" value={form.name} onChange={handleChange} maxLength={100} autoComplete="name" className="field-control pl-9" placeholder="Seu nome" required />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="profile-email" className="field-label mb-1.5">E-mail</label>
                    <div className="relative">
                      <Mail size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#929c93]" />
                      <input id="profile-email" name="email" type="email" value={form.email} onChange={handleChange} maxLength={160} autoComplete="email" className="field-control pl-9" placeholder="voce@exemplo.com" required />
                    </div>
                  </div>

                  {fieldError && <p role="alert" className="rounded-lg border border-[#f0d9d4] bg-[#fcf5f3] px-3 py-2.5 text-xs leading-5 text-[#934b42]">{fieldError}</p>}

                  <div className="flex flex-col-reverse gap-2 border-t border-line pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <button type="button" onClick={handleReset} disabled={!changed || saving} className="btn-secondary"><RotateCcw size={13} />Descartar alterações</button>
                    <button type="submit" disabled={!changed || saving} className="btn-primary">
                      {saving ? <LoaderCircle size={14} className="animate-spin" /> : <Save size={14} />}
                      {saving ? 'Salvando...' : 'Salvar alterações'}
                    </button>
                  </div>
                </form>
              </section>
            </div>

            <aside className="rounded-xl border border-line bg-white p-5">
              <h2 className="text-[13px] font-semibold text-ink">Sua conta</h2>
              <p className="mt-1 text-[11px] leading-5 text-muted">Mantenha seus dados atualizados para que suas informações estejam corretas.</p>
              {joinedAt && <div className="mt-5 flex items-start gap-2.5 border-t border-line pt-4">
                <CalendarDays size={15} className="mt-0.5 text-[#7c8d7e]" />
                <div>
                  <p className="text-[11px] font-medium text-ink">Membro desde</p>
                  <p className="mt-0.5 text-[11px] text-muted">{joinedAt}</p>
                </div>
              </div>}
              <div className="mt-5 flex items-start gap-2.5 border-t border-line pt-4">
                <Check size={15} className="mt-0.5 text-[#66816c]" />
                <p className="text-[11px] leading-5 text-muted">As alterações são aplicadas à sua conta depois que a API confirma a atualização.</p>
              </div>
            </aside>
          </div>
        )}
      </div>
      <Toast toast={toast} onClose={() => setToast(null)} />
    </AppShell>
  );
}

import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import AuthFrame from '../components/AuthFrame';
import { useAuth } from '../contexts/AuthContext';
import { getErrorMessage } from '../lib/api';

export default function RegisterPage() {
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  if (user) return <Navigate to="/boards" replace />;

  const change = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    if (form.password.length < 8) return setError('Use uma senha com pelo menos 8 caracteres.');
    setBusy(true);
    try {
      await register({ ...form, name: form.name.trim(), email: form.email.trim() });
      navigate('/boards', { replace: true });
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'Não foi possível criar sua conta.'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthFrame title="Crie sua conta" subtitle="Comece com um espaço simples para organizar suas ideias." footer={<>Já tem uma conta? <Link to="/login" className="ml-1 font-semibold text-accent hover:underline">Entrar</Link></>}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="field-label">Nome
          <input required maxLength={120} autoComplete="name" value={form.name} onChange={change('name')} placeholder="Seu nome" className="field-control mt-1.5" />
        </label>
        <label className="field-label">E-mail
          <input type="email" required autoComplete="email" value={form.email} onChange={change('email')} placeholder="voce@exemplo.com" className="field-control mt-1.5" />
        </label>
        <label className="field-label">Senha
          <span className="relative mt-1.5 block">
            <input type={showPassword ? 'text' : 'password'} required minLength={8} autoComplete="new-password" value={form.password} onChange={change('password')} placeholder="Pelo menos 8 caracteres" className="field-control pr-11" />
            <button type="button" onClick={() => setShowPassword((show) => !show)} aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'} className="absolute inset-y-0 right-0 grid w-10 place-items-center text-[#929b93] hover:text-ink">{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button>
          </span>
        </label>
        {error && <p role="alert" className="rounded-lg bg-[#fbf2f0] px-3 py-2.5 text-xs leading-5 text-[#9a5149]">{error}</p>}
        <button type="submit" disabled={busy} className="btn-primary mt-2 w-full justify-center py-2.5">{busy ? 'Criando conta...' : 'Criar conta'}</button>
      </form>
    </AuthFrame>
  );
}

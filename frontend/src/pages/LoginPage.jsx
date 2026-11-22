import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import AuthFrame from '../components/AuthFrame';
import { useAuth } from '../contexts/AuthContext';
import { getErrorMessage } from '../lib/api';

export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  if (user) return <Navigate to="/boards" replace />;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      await login({ email: email.trim(), password });
      navigate('/boards', { replace: true });
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'E-mail ou senha incorretos.'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthFrame title="Bem-vindo de volta" subtitle="Entre para continuar de onde você parou." footer={<>Ainda não tem uma conta? <Link to="/register" className="ml-1 font-semibold text-accent hover:underline">Criar conta</Link></>} note="Ao continuar, você concorda com os termos de uso e a política de privacidade.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="field-label">E-mail
          <input type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="voce@exemplo.com" className="field-control mt-1.5" />
        </label>
        <label className="field-label">Senha
          <span className="relative mt-1.5 block">
            <input type={showPassword ? 'text' : 'password'} required autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Sua senha" className="field-control pr-11" />
            <button type="button" onClick={() => setShowPassword((show) => !show)} aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'} className="absolute inset-y-0 right-0 grid w-10 place-items-center text-[#929b93] hover:text-ink">{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button>
          </span>
        </label>
        {error && <p role="alert" className="rounded-lg bg-[#fbf2f0] px-3 py-2.5 text-xs leading-5 text-[#9a5149]">{error}</p>}
        <button type="submit" disabled={busy} className="btn-primary mt-2 w-full justify-center py-2.5">{busy ? 'Entrando...' : 'Entrar'}</button>
      </form>
    </AuthFrame>
  );
}

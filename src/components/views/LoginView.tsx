import React, { useState } from 'react';
import { useRefillContext } from '../../context/RefillContext';
import { DEMO_USERS } from '../../data/initialData';
import { Logo } from '../common/Logo';
import {
  Shield,
  Lock,
  ArrowRight,
  UserCheck,
  Stethoscope,
  Building,
  Store,
  Mail,
  User as UserIcon,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Hospital,
} from 'lucide-react';
import { Role } from '../../types';

interface LoginViewProps {
  onSuccess: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onSuccess }) => {
  const { setCurrentUser, switchRole, showToast } = useRefillContext();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');

  // Sign In State
  const [email, setEmail] = useState('sjohnson@northsidehealth.org');
  const [password, setPassword] = useState('Password123!');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Sign Up State
  const [fullName, setFullName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [signupRole, setSignupRole] = useState<Role>('PRACTICE_STAFF');
  const [organizationName, setOrganizationName] = useState('');
  const [organizationType, setOrganizationType] = useState<'PRACTICE' | 'PHARMACY' | 'HEALTH_SYSTEM'>('PRACTICE');
  const [jobTitle, setJobTitle] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // Form error & loading states
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle Standard Sign In
  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      const matched = DEMO_USERS.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
      if (matched) {
        setCurrentUser(matched);
        showToast(`Welcome back, ${matched.name}`, 'success');
      } else {
        // Auto-create a session for arbitrary healthcare email
        const initials = email
          .split('@')[0]
          .split('.')
          .map((n) => n[0]?.toUpperCase() || '')
          .join('')
          .slice(0, 2) || 'RX';

        setCurrentUser({
          id: `user-${Date.now()}`,
          name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
          email: email.trim(),
          role: 'PRACTICE_STAFF',
          organizationId: 'org-external',
          organizationName: 'Regional Health Network',
          organizationType: 'PRACTICE',
          title: 'Care Coordinator',
          avatarInitials: initials,
        });
        showToast('Signed in successfully', 'success');
      }
      onSuccess();
    }, 400);
  };

  // Handle Sign Up Registration
  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!signupEmail.trim() || !signupEmail.includes('@')) {
      setErrorMsg('Please provide a valid enterprise or practice email address.');
      return;
    }
    if (signupPassword.length < 8) {
      setErrorMsg('Password must be at least 8 characters long for HIPAA security compliance.');
      return;
    }
    if (signupPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    if (!organizationName.trim()) {
      setErrorMsg('Please enter your clinic, practice, or pharmacy name.');
      return;
    }
    if (!acceptedTerms) {
      setErrorMsg('Please agree to the HIPAA Business Associate Agreement (BAA) and Terms.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      const initials = fullName
        .trim()
        .split(' ')
        .map((p) => p[0]?.toUpperCase())
        .join('')
        .slice(0, 2) || 'RX';

      const newUser = {
        id: `user-${Date.now()}`,
        name: fullName.trim(),
        email: signupEmail.trim(),
        role: signupRole,
        organizationId: `org-${Date.now()}`,
        organizationName: organizationName.trim(),
        organizationType: organizationType,
        title: jobTitle.trim() || (signupRole === 'PROVIDER' ? 'Attending Clinician' : 'Healthcare Staff'),
        avatarInitials: initials,
      };

      setCurrentUser(newUser);
      showToast(`Account created for ${newUser.name}!`, 'success');
      onSuccess();
    }, 500);
  };

  const handleQuickDemoLogin = (role: Role) => {
    switchRole(role);
    onSuccess();
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-md w-full space-y-5">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex justify-center mb-1">
            <Logo size="lg" white showTagline />
          </div>
          <p className="text-xs text-slate-400">
            Enterprise Inter-Professional Refill Coordination Network
          </p>
        </div>

        {/* Card Container */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden">
          {/* Tab Selector: Sign In vs Sign Up */}
          <div className="grid grid-cols-2 border-b border-slate-200 bg-slate-50 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setErrorMsg(null);
              }}
              className={`py-3 text-center transition-colors border-b-2 ${
                mode === 'signin'
                  ? 'border-teal-600 text-teal-800 bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/60'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setErrorMsg(null);
              }}
              className={`py-3 text-center transition-colors border-b-2 ${
                mode === 'signup'
                  ? 'border-teal-600 text-teal-800 bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/60'
              }`}
            >
              Sign Up
            </button>
          </div>

          <div className="p-6 space-y-5 text-xs text-slate-700">
            {errorMsg && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 flex items-start gap-2 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
                <div className="leading-snug">{errorMsg}</div>
              </div>
            )}

            {/* ==================== SIGN IN FORM ==================== */}
            {mode === 'signin' && (
              <>
                <div>
                  <h1 className="text-xl font-bold text-slate-900">Welcome back</h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Sign in with your organization or practice credentials.
                  </p>
                </div>

                <form onSubmit={handleSignIn} className="space-y-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Work Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@healthcare-org.com"
                        className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 pl-9 text-xs text-slate-900 focus:outline-none focus:border-teal-500 focus:bg-white"
                      />
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-semibold text-slate-700">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          showToast('Password reset link sent to registered email address', 'info');
                        }}
                        className="text-[11px] text-teal-600 hover:text-teal-700 hover:underline"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 pl-9 pr-9 text-xs text-slate-900 focus:outline-none focus:border-teal-500 focus:bg-white"
                      />
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                      />
                      <span className="text-slate-600 text-xs">Remember this device</span>
                    </label>
                    <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                      <Shield className="w-3 h-3 text-emerald-500" />
                      HIPAA Guarded
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <span>{isSubmitting ? 'Verifying Credentials...' : 'Sign In'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>

                {/* Switch to Sign Up */}
                <div className="text-center text-xs text-slate-500">
                  New to RxBridge?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signup');
                      setErrorMsg(null);
                    }}
                    className="font-semibold text-teal-600 hover:text-teal-700 hover:underline"
                  >
                    Create an organization account
                  </button>
                </div>
              </>
            )}

            {/* ==================== SIGN UP FORM ==================== */}
            {mode === 'signup' && (
              <>
                <div>
                  <h1 className="text-xl font-bold text-slate-900">Create your account</h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Register your clinic, pharmacy, or provider seat on the network.
                  </p>
                </div>

                <form onSubmit={handleSignUp} className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Full Name & Credentials *
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Dr. Jane Smith, MD"
                        className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-teal-500 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Professional Role *
                      </label>
                      <select
                        value={signupRole}
                        onChange={(e) => {
                          const r = e.target.value as Role;
                          setSignupRole(r);
                          if (r === 'PHARMACY_STAFF') setOrganizationType('PHARMACY');
                          else if (r === 'ADMIN') setOrganizationType('HEALTH_SYSTEM');
                          else setOrganizationType('PRACTICE');
                        }}
                        className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-teal-500 focus:bg-white"
                      >
                        <option value="PRACTICE_STAFF">Practice Staff / Care Coordinator</option>
                        <option value="PROVIDER">Attending Provider / Prescriber</option>
                        <option value="PHARMACY_STAFF">Pharmacy Staff / Technician</option>
                        <option value="ADMIN">Clinical Operations Administrator</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Organization / Practice Name *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={organizationName}
                        onChange={(e) => setOrganizationName(e.target.value)}
                        placeholder="e.g. Northside Family Medicine or Metro Community Pharmacy"
                        className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-1.5 pl-9 text-xs text-slate-900 focus:outline-none focus:border-teal-500 focus:bg-white"
                      />
                      <Building className="w-4 h-4 text-slate-400 absolute left-3 top-2" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Work Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        placeholder="name@organization.com"
                        className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-teal-500 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Job Title
                      </label>
                      <input
                        type="text"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        placeholder="e.g. Lead Refill Specialist"
                        className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-teal-500 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Password *
                      </label>
                      <input
                        type="password"
                        required
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        placeholder="Min 8 characters"
                        className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-teal-500 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Confirm Password *
                      </label>
                      <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Repeat password"
                        className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-teal-500 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div className="pt-1">
                    <label className="flex items-start gap-2 cursor-pointer select-none text-[11px] text-slate-600">
                      <input
                        type="checkbox"
                        checked={acceptedTerms}
                        onChange={(e) => setAcceptedTerms(e.target.checked)}
                        className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 mt-0.5 shrink-0"
                      />
                      <span>
                        I accept the <strong className="text-slate-800">HIPAA Business Associate Agreement (BAA)</strong> and agree to secure clinical message transmission standards.
                      </span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-400 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <span>{isSubmitting ? 'Creating Organization Account...' : 'Complete Registration'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>

                {/* Switch to Sign In */}
                <div className="text-center text-xs text-slate-500">
                  Already registered?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signin');
                      setErrorMsg(null);
                    }}
                    className="font-semibold text-teal-600 hover:text-teal-700 hover:underline"
                  >
                    Sign in to existing account
                  </button>
                </div>
              </>
            )}

            {/* Quick Demo Personas (1-Click for Instant Testing) */}
            <div className="pt-4 border-t border-slate-100 space-y-2.5">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">
                Or Quick Access As Sample Role
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('PRACTICE_STAFF')}
                  className="p-2.5 rounded-lg border border-slate-200 hover:border-teal-400 hover:bg-teal-50/30 text-left transition-colors flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between text-slate-500 mb-1">
                    <span className="text-[10px] font-semibold text-slate-400">PRACTICE STAFF</span>
                    <Building className="w-3.5 h-3.5 text-teal-600" />
                  </div>
                  <div className="font-bold text-slate-900 text-xs">Sarah Johnson</div>
                  <div className="text-[10px] text-slate-500 truncate">Care Coordinator</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('PROVIDER')}
                  className="p-2.5 rounded-lg border border-slate-200 hover:border-teal-400 hover:bg-teal-50/30 text-left transition-colors flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between text-slate-500 mb-1">
                    <span className="text-[10px] font-semibold text-slate-400">PROVIDER</span>
                    <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
                  </div>
                  <div className="font-bold text-slate-900 text-xs">Dr. Priya Patel</div>
                  <div className="text-[10px] text-slate-500 truncate">Attending Physician</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('PHARMACY_STAFF')}
                  className="p-2.5 rounded-lg border border-slate-200 hover:border-teal-400 hover:bg-teal-50/30 text-left transition-colors flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between text-slate-500 mb-1">
                    <span className="text-[10px] font-semibold text-slate-400">PHARMACY</span>
                    <Store className="w-3.5 h-3.5 text-teal-600" />
                  </div>
                  <div className="font-bold text-slate-900 text-xs">Mark Lin, CPhT</div>
                  <div className="text-[10px] text-slate-500 truncate">Lead Tech (Retail)</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('ADMIN')}
                  className="p-2.5 rounded-lg border border-slate-200 hover:border-teal-400 hover:bg-teal-50/30 text-left transition-colors flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between text-slate-500 mb-1">
                    <span className="text-[10px] font-semibold text-slate-400">ADMINISTRATOR</span>
                    <Shield className="w-3.5 h-3.5 text-teal-600" />
                  </div>
                  <div className="font-bold text-slate-900 text-xs">Elena Vance, MHA</div>
                  <div className="text-[10px] text-slate-500 truncate">Clinic Ops Director</div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Security & Sandbox Notice */}
        <div className="text-center text-[11px] text-slate-400 leading-relaxed">
          HIPAA compliant architecture. Standard end-to-end encryption with tenant-level data segregation.
        </div>
      </div>
    </div>
  );
};

'use client'

import { useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { login, signup } from './actions'

export default function LoginPage() {
  const router = useRouter()

  const [loginState, loginAction] = useActionState(login, { error: null, success: false })
  const [signupState, signupAction] = useActionState(signup, { error: null, success: false })

  useEffect(() => {
    if (loginState.success) {
      router.push('/')        // ⬅️ redirect here
    }
  }, [loginState.success, router])

  useEffect(() => {
    if (signupState.success) {
      alert('Signup successful! Please check your email to confirm your account.')
    }
  }, [signupState.success, router])

  function clearLoginError() {
    loginState.error = null
  }

  function clearSignupError() {
    signupState.error = null
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>TrailSpecies</h1>
        <p style={styles.subtitle}>Log in to find trails and explore wildlife!</p>

        <form style={styles.form}>
          <div style={styles.inputGroup}>
            <label htmlFor="email" style={styles.label}>Email</label>
            <input id="email" name="email" type="email" required style={styles.input} />
          </div>

          <div style={styles.inputGroup}>
            <label htmlFor="password" style={styles.label}>Password</label>
            <input id="password" name="password" type="password" required style={styles.input} />
          </div>

          {/* LOGIN ERROR */}
          {loginState.error && (
            <p style={{ color: 'red', fontSize: '14px', marginTop: '-12px' }}>
              {loginState.error}
            </p>
          )}

          <div style={styles.buttonGroup}>
            <button
              formAction={loginAction}
              onClick={clearSignupError}     // 🔥 clears signup errors when logging in
              style={styles.primaryButton}
            >
              Log in
            </button>

            <button
              formAction={signupAction}
              onClick={clearLoginError}      // 🔥 clears login errors when signing up
              style={styles.secondaryButton}
            >
              Sign up
            </button>

            {/* SIGNUP ERROR */}
            {signupState.error && (
              <p style={{ color: 'red', fontSize: '14px' }}>
                {signupState.error}
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}


const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#000000', // Matches the main black background
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif', // Matches the clean sans-serif font in image
    padding: '20px',
  },
  card: {
    width: '100%',
    maxWidth: '400px',
    backgroundColor: '#000000', // Keeping card black to blend in, or could be #111
    padding: '40px',
    borderRadius: '16px', // Slightly more rounded to match the "Search" bar
    border: '1px solid #333333',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: '8px',
    textAlign: 'center' as const,
    letterSpacing: '-0.5px', // Tighter spacing common in modern UI fonts
  },
  subtitle: {
    fontSize: '16px',
    color: '#888888',
    textAlign: 'center' as const,
    marginBottom: '32px',
    marginTop: '0',
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '24px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#cccccc',
    marginLeft: '4px',
  },
  input: {
    padding: '14px 16px',
    borderRadius: '8px', // Matching rounded look
    backgroundColor: '#1a1a1a', // Dark grey input background
    border: '1px solid #333333',
    fontSize: '16px',
    color: '#ffffff',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  buttonGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
    marginTop: '8px',
  },
  primaryButton: {
    display: 'flex',
    justifyContent: 'center',
    padding: '14px',
    backgroundColor: '#10b981', // Matches the Green "Search" button (Emerald-500)
    color: '#ffffff',
    border: 'none',
    borderRadius: '24px', // Fully rounded pill shape like "Search" button
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'opacity 0.2s',
  },
  secondaryButton: {
    display: 'flex',
    justifyContent: 'center',
    padding: '14px',
    backgroundColor: 'transparent',
    color: '#ffffff',
    border: '1px solid #333333',
    borderRadius: '24px', // Fully rounded pill shape
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
}
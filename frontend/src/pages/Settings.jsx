import { useEffect, useState } from 'react';
import api from '../utils/api';
import { useToast } from '../components/Toast.jsx';
import Input from '../components/Input.jsx';
import Button from '../components/Button.jsx';

export default function Settings() {
  const [profile, setProfile] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/user/profile');
        setProfile(data.user);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      await api.put('/user/profile', { name: profile.name });
      showToast('Saved', 'success');
    } catch (e) {
      console.error(e);
      showToast('Save failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    // Removed container to allow full-width AuthShell content
    <div>
      <h2>Settings</h2>
      <div className="section-intro">
        <h3 className="section-title">Manage Your Profile</h3>
        <p className="muted">Update your display name. Your email is shown and locked.</p>
        <ol className="step-list">
          <li>Edit your name for personalized documents.</li>
          <li>Confirm your email for account notifications.</li>
          <li>Save changes to apply across the app.</li>
        </ol>
      </div>
      {loading ? (
        <div className="card">
          <div className="skeleton text" style={{ height: '40px', marginBottom: 'var(--space-3)' }} />
          <div className="skeleton text" style={{ height: '40px', marginBottom: 'var(--space-3)' }} />
          <div className="skeleton text" style={{ height: '40px', width: '120px' }} />
        </div>
      ) : (
        <div className="card" style={{ maxWidth: '600px' }}>
          <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
            <Input
              label="Name"
              value={profile.name || ''}
              onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
              placeholder="Enter your name"
            />
            <Input
              label="Email"
              value={profile.email || ''}
              disabled
              helperText="Email cannot be changed"
            />
            <div>
              <Button 
                onClick={save} 
                loading={saving}
                variant="primary"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
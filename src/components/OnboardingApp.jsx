import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://kbevifhkdpjacnbwxvkn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtiZXZpZmhrZHBqYWNuYnd4dmtuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUzMTI3NTUsImV4cCI6MjA3MDg4ODc1NX0.4D-K8lC12KvYb5HFe7C8DjnF-fkHQBYiW4oZhp_YsXU';

const supabase = createClient(supabaseUrl, supabaseKey);

const OnboardingApp = () => {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [currentView, setCurrentView] = useState('LOGIN');
  const [loading, setLoading] = useState(true);
  
  // Onboarding form state
  const [formData, setFormData] = useState({
    city: '',
    state: '',
    whatsapp: '',
    specialties: [],
    standard_rate: '',
    specific_rates: [],
    available_dates: ''
  });
  
  const [specialtyInput, setSpecialtyInput] = useState('');
  const [specificRate, setSpecificRate] = useState({ role: '', value: '' });

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        
        if (event === 'SIGNED_IN' && session?.user) {
          await handleUserSession(session.user);
        } else if (event === 'SIGNED_OUT') {
          setProfile(null);
          setCurrentView('LOGIN');
        }
        setLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        handleUserSession(session.user);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleUserSession = async (user) => {
    try {
      // Check if profile exists
      const { data: existingProfile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code === 'PGRST116') {
        // Profile doesn't exist, create one
        const newProfile = {
          id: user.id,
          full_name: user.user_metadata?.full_name || '',
          email: user.email,
          avatar_url: user.user_metadata?.avatar_url || '',
          user_type: 'freelancer',
          profile_complete: false
        };

        const { data: createdProfile, error: createError } = await supabase
          .from('profiles')
          .insert([newProfile])
          .select()
          .single();

        if (createError) {
          console.error('Error creating profile:', createError);
          return;
        }

        setProfile(createdProfile);
        setCurrentView('ONBOARDING');
      } else if (existingProfile) {
        setProfile(existingProfile);
        setCurrentView(existingProfile.profile_complete ? 'DASHBOARD' : 'ONBOARDING');
      }
    } catch (error) {
      console.error('Error handling user session:', error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/onboarding-app'
        }
      });
      if (error) throw error;
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const addSpecialty = () => {
    if (specialtyInput.trim() && formData.specialties.length < 10) {
      setFormData(prev => ({
        ...prev,
        specialties: [...prev.specialties, specialtyInput.trim()]
      }));
      setSpecialtyInput('');
    }
  };

  const removeSpecialty = (index) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.filter((_, i) => i !== index)
    }));
  };

  const addSpecificRate = () => {
    if (specificRate.role.trim() && specificRate.value.trim()) {
      setFormData(prev => ({
        ...prev,
        specific_rates: [...prev.specific_rates, { ...specificRate }]
      }));
      setSpecificRate({ role: '', value: '' });
    }
  };

  const removeSpecificRate = (index) => {
    setFormData(prev => ({
      ...prev,
      specific_rates: prev.specific_rates.filter((_, i) => i !== index)
    }));
  };

  const handleProfileUpdate = async () => {
    try {
      const updateData = {
        city: formData.city,
        state: formData.state,
        whatsapp: formData.whatsapp,
        specialties: formData.specialties,
        standard_rate: formData.standard_rate ? parseFloat(formData.standard_rate) : null,
        specific_rates: formData.specific_rates.length > 0 ? formData.specific_rates : null,
        available_dates: formData.available_dates,
        profile_complete: true
      };

      const { data, error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', session.user.id)
        .select()
        .single();

      if (error) throw error;

      setProfile(data);
      setCurrentView('DASHBOARD');
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

  // LOGIN VIEW
  if (currentView === 'LOGIN') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="max-w-md w-full space-y-8 p-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground mb-8">freelaAv</h1>
            <button
              onClick={handleGoogleLogin}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Entrar com o Google
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ONBOARDING VIEW
  if (currentView === 'ONBOARDING') {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-8 text-center">Complete seu Cadastro</h1>
          
          <div className="space-y-6 bg-card p-6 rounded-lg border">
            {/* Location */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Localização</h3>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Cidade"
                  value={formData.city}
                  onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                />
                <input
                  type="text"
                  placeholder="Estado"
                  value={formData.state}
                  onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                />
              </div>
            </div>

            {/* Contact */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Contato</h3>
              <input
                type="text"
                placeholder="Número do WhatsApp"
                value={formData.whatsapp}
                onChange={(e) => setFormData(prev => ({ ...prev, whatsapp: e.target.value }))}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
              />
            </div>

            {/* Specialties */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Especialidades</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Adicione uma especialidade"
                  value={specialtyInput}
                  onChange={(e) => setSpecialtyInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addSpecialty()}
                  className="flex-1 px-3 py-2 border border-border rounded-md bg-background text-foreground"
                />
                <button
                  onClick={addSpecialty}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                >
                  Adicionar
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.specialties.map((specialty, index) => (
                  <span
                    key={index}
                    className={`px-3 py-1 rounded-full text-sm flex items-center gap-2 ${
                      index < 3 ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
                    }`}
                  >
                    {specialty}
                    {index < 3 && <span className="text-xs">(Principal)</span>}
                    <button
                      onClick={() => removeSpecialty(index)}
                      className="ml-1 text-current hover:text-destructive"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Rates */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Cachê</h3>
              <input
                type="number"
                placeholder="Cachê Padrão (R$)"
                value={formData.standard_rate}
                onChange={(e) => setFormData(prev => ({ ...prev, standard_rate: e.target.value }))}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
              />
              
              <div className="space-y-2">
                <h4 className="font-medium text-foreground">Cachês Específicos (Opcional)</h4>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Função"
                    value={specificRate.role}
                    onChange={(e) => setSpecificRate(prev => ({ ...prev, role: e.target.value }))}
                    className="flex-1 px-3 py-2 border border-border rounded-md bg-background text-foreground"
                  />
                  <input
                    type="number"
                    placeholder="Valor (R$)"
                    value={specificRate.value}
                    onChange={(e) => setSpecificRate(prev => ({ ...prev, value: e.target.value }))}
                    className="flex-1 px-3 py-2 border border-border rounded-md bg-background text-foreground"
                  />
                  <button
                    onClick={addSpecificRate}
                    className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90"
                  >
                    Adicionar
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.specific_rates.map((rate, index) => (
                    <div key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                      <span className="text-foreground">{rate.role}: R$ {rate.value}</span>
                      <button
                        onClick={() => removeSpecificRate(index)}
                        className="text-destructive hover:text-destructive/80"
                      >
                        Remover
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Availability */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Disponibilidade</h3>
              <textarea
                placeholder="Datas Disponíveis"
                value={formData.available_dates}
                onChange={(e) => setFormData(prev => ({ ...prev, available_dates: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground resize-none"
              />
            </div>

            <button
              onClick={handleProfileUpdate}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 px-4 rounded-lg transition-colors duration-200"
            >
              Salvar e ir para o Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // DASHBOARD VIEW
  if (currentView === 'DASHBOARD') {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto p-8">
          <div className="bg-card p-6 rounded-lg border">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                {profile?.avatar_url && (
                  <img
                    src={profile.avatar_url}
                    alt="Profile"
                    className="w-16 h-16 rounded-full"
                  />
                )}
                <div>
                  <h1 className="text-2xl font-bold text-foreground">
                    Olá, {profile?.full_name || 'Usuário'}!
                  </h1>
                  <p className="text-muted-foreground">{profile?.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition-colors duration-200"
              >
                Sair
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Informações Pessoais</h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Localização:</strong> {profile?.city}, {profile?.state}</p>
                  <p><strong>WhatsApp:</strong> {profile?.whatsapp}</p>
                  <p><strong>Cachê Padrão:</strong> R$ {profile?.standard_rate || 'Não informado'}</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Especialidades</h3>
                <div className="flex flex-wrap gap-2">
                  {profile?.specialties?.map((specialty, index) => (
                    <span
                      key={index}
                      className={`px-3 py-1 rounded-full text-sm ${
                        index < 3 ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
                      }`}
                    >
                      {specialty}
                      {index < 3 && <span className="ml-1 text-xs">(Principal)</span>}
                    </span>
                  ))}
                </div>
              </div>

              {profile?.specific_rates && profile.specific_rates.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Cachês Específicos</h3>
                  <div className="space-y-2">
                    {profile.specific_rates.map((rate, index) => (
                      <div key={index} className="text-sm">
                        <strong>{rate.role}:</strong> R$ {rate.value}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {profile?.available_dates && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Disponibilidade</h3>
                  <p className="text-sm">{profile.available_dates}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default OnboardingApp;
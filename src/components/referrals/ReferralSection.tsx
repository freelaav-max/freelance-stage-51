import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Copy, Share, Users, TrendingUp } from 'lucide-react';

interface Referral {
  id: string;
  referred_user: {
    full_name: string;
    email: string;
  } | null;
  status: string;
  created_at: string;
}

const ReferralSection: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [referralCode, setReferralCode] = useState<string>('');
  const [clicks, setClicks] = useState<number>(0);
  const [myReferrals, setMyReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const referralLink = referralCode ? `${window.location.origin}/auth?ref=${referralCode}` : '';

  useEffect(() => {
    const fetchReferralData = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        // Get or create referral code
        const { data: codeData, error: codeError } = await supabase
          .rpc('get_or_create_referral_code', { p_user_id: user.id });

        if (codeError) throw codeError;
        
        if (codeData && codeData.length > 0) {
          setReferralCode(codeData[0].code);
          
          // Get referral stats
          const { data: statsData, error: statsError } = await supabase
            .from('referral_codes')
            .select('clicks')
            .eq('user_id', user.id)
            .single();

          if (statsError) throw statsError;
          setClicks(statsData?.clicks || 0);
        }

        // Get my referrals with user details
        const { data: referralsData, error: referralsError } = await supabase
          .from('referrals')
          .select(`
            id,
            status,
            created_at,
            referred_id
          `)
          .eq('referrer_id', user.id)
          .order('created_at', { ascending: false });

        if (referralsError) throw referralsError;

        // Fetch user details for each referral
        const referralsWithUsers = await Promise.all(
          (referralsData || []).map(async (referral) => {
            const { data: userData } = await supabase
              .from('profiles')
              .select('full_name, email')
              .eq('id', referral.referred_id)
              .single();

            return {
              ...referral,
              referred_user: userData
            };
          })
        );

        setMyReferrals(referralsWithUsers);

      } catch (error) {
        console.error('Failed to fetch referral data:', error);
        toast({
          title: "Erro",
          description: "Erro ao carregar dados de indicação.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchReferralData();
  }, [user, toast]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      toast({
        title: "Link copiado!",
        description: "Link de indicação copiado para a área de transferência."
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível copiar o link.",
        variant: "destructive"
      });
    }
  };

  const shareViaWhatsApp = () => {
    const message = `Olá! Conheça o FreelaAV, a melhor plataforma para encontrar ou oferecer serviços de áudio e vídeo. Use meu link para se cadastrar: ${referralLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  const shareViaEmail = () => {
    const subject = 'Convite para o FreelaAV';
    const body = `Olá! Conheça o FreelaAV, a melhor plataforma para encontrar ou oferecer serviços de áudio e vídeo. Use meu link para se cadastrar: ${referralLink}`;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            <Skeleton className="h-6 w-32" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-64" />
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Indique e Ganhe!
        </CardTitle>
        <CardDescription>
          Compartilhe seu link único e ajude outros profissionais ou clientes a descobrirem nossa plataforma.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Cliques:</span>
            <Badge variant="secondary">{clicks}</Badge>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Indicados:</span>
            <Badge variant="secondary">{myReferrals.length}</Badge>
          </div>
        </div>

        {/* Referral Link */}
        <div className="space-y-2">
          <label htmlFor="referral-link" className="text-sm font-medium">
            Seu Link de Indicação
          </label>
          <div className="flex gap-2">
            <Input
              id="referral-link"
              type="text"
              value={referralLink}
              readOnly
              className="flex-1"
            />
            <Button onClick={handleCopyLink} size="sm" variant="outline">
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Share Buttons */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Compartilhe Rapidamente</h3>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={shareViaWhatsApp}
              className="flex items-center gap-2"
            >
              <Share className="h-4 w-4" />
              WhatsApp
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={shareViaEmail}
              className="flex items-center gap-2"
            >
              <Share className="h-4 w-4" />
              E-mail
            </Button>
          </div>
        </div>

        {/* Referrals List */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Suas Indicações</h3>
          {myReferrals.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              Você ainda não fez nenhuma indicação.
            </p>
          ) : (
            <div className="space-y-2">
              {myReferrals.map((referral) => (
                <div
                  key={referral.id}
                  className="flex justify-between items-center p-3 border rounded-lg"
                >
                  <div className="space-y-1">
                    <p className="font-medium text-sm">
                      {referral.referred_user?.full_name || referral.referred_user?.email || 'Usuário'}
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {referral.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(referral.created_at).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReferralSection;
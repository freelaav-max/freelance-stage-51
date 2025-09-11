import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface ExternalReceivable {
  id: string;
  service_title: string;
  client_name: string;
  service_date: string;
  amount: number;
  due_date?: string;
  status: 'pending' | 'received' | 'overdue' | 'cancelled';
  notes?: string;
  created_at: string;
}

export interface ReceivablesSummary {
  total_pending: number;
  total_received: number;
  total_overdue: number;
  platform_pending: number;
  external_pending: number;
}

export const useReceivables = () => {
  const [receivables, setReceivables] = useState<ExternalReceivable[]>([]);
  const [summary, setSummary] = useState<ReceivablesSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchReceivables = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('external_receivables')
        .select('*')
        .eq('freelancer_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReceivables((data || []) as ExternalReceivable[]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar recebíveis';
      setError(errorMessage);
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase.rpc('get_freelancer_receivables_summary', {
        p_freelancer_id: user.id
      });

      if (error) throw error;
      setSummary(data?.[0] || null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar resumo';
      console.error(errorMessage);
    }
  };

  const createReceivable = async (receivableData: {
    service_title: string;
    client_name: string;
    service_date: string;
    amount: number;
    due_date?: string;
    notes?: string;
  }) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase.rpc('create_external_receivable', {
        p_service_title: receivableData.service_title,
        p_client_name: receivableData.client_name,
        p_service_date: receivableData.service_date,
        p_amount: receivableData.amount,
        p_due_date: receivableData.due_date || null,
        p_notes: receivableData.notes || null
      });

      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Pagamento registrado com sucesso"
      });
      
      // Refresh data
      fetchReceivables();
      fetchSummary();
      
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao registrar pagamento';
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive"
      });
      return null;
    }
  };

  const updateReceivableStatus = async (receivableId: string, status: string) => {
    if (!user) return false;

    try {
      const { data, error } = await supabase.rpc('update_external_receivable_status', {
        p_receivable_id: receivableId,
        p_status: status
      });

      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Status atualizado com sucesso"
      });
      
      // Refresh data
      fetchReceivables();
      fetchSummary();
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar status';
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive"
      });
      return false;
    }
  };

  useEffect(() => {
    if (user) {
      fetchReceivables();
      fetchSummary();
    }
  }, [user]);

  return {
    receivables,
    summary,
    loading,
    error,
    fetchReceivables,
    createReceivable,
    updateReceivableStatus,
    refetch: () => {
      fetchReceivables();
      fetchSummary();
    }
  };
};
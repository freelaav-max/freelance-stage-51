import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useReceivables } from '@/hooks/useReceivables';
import { Plus, Calendar, DollarSign, Clock, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const ReceivablesManager: React.FC = () => {
  const { receivables, loading, createReceivable, updateReceivableStatus } = useReceivables();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filter, setFilter] = useState<string>('all');
  const [formData, setFormData] = useState({
    service_title: '',
    client_name: '',
    service_date: '',
    amount: '',
    due_date: '',
    notes: ''
  });

  const filteredReceivables = receivables.filter(receivable => {
    if (filter === 'all') return true;
    return receivable.status === filter;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await createReceivable({
      service_title: formData.service_title,
      client_name: formData.client_name,
      service_date: formData.service_date,
      amount: parseFloat(formData.amount),
      due_date: formData.due_date || undefined,
      notes: formData.notes || undefined
    });

    if (result) {
      setFormData({
        service_title: '',
        client_name: '',
        service_date: '',
        amount: '',
        due_date: '',
        notes: ''
      });
      setIsDialogOpen(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'default',
      received: 'secondary',
      overdue: 'destructive',
      cancelled: 'outline'
    } as const;

    const labels = {
      pending: 'Pendente',
      received: 'Recebido',
      overdue: 'Atrasado',
      cancelled: 'Cancelado'
    };

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'default'}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-muted-foreground" />;
      case 'received':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'overdue':
        return <Clock className="h-4 w-4 text-destructive" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Pagamentos a Receber</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Registrar Pagamento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Registrar Novo Pagamento</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="service_title">Título do Serviço</Label>
                <Input
                  id="service_title"
                  value={formData.service_title}
                  onChange={(e) => setFormData({ ...formData, service_title: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="client_name">Nome do Cliente</Label>
                <Input
                  id="client_name"
                  value={formData.client_name}
                  onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="service_date">Data do Serviço</Label>
                <Input
                  id="service_date"
                  type="date"
                  value={formData.service_date}
                  onChange={(e) => setFormData({ ...formData, service_date: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="amount">Valor (R$)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="due_date">Data de Vencimento (Opcional)</Label>
                <Input
                  id="due_date"
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="notes">Observações (Opcional)</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                />
              </div>
              <Button type="submit" className="w-full">
                Registrar Pagamento
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-2">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="pending">Pendentes</SelectItem>
            <SelectItem value="received">Recebidos</SelectItem>
            <SelectItem value="overdue">Atrasados</SelectItem>
            <SelectItem value="cancelled">Cancelados</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="text-center py-8">Carregando...</div>
      ) : (
        <div className="grid gap-4">
          {filteredReceivables.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center text-muted-foreground">
                  Nenhum pagamento encontrado.
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredReceivables.map((receivable) => (
              <Card key={receivable.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getStatusIcon(receivable.status)}
                        <h3 className="font-semibold">{receivable.service_title}</h3>
                        {getStatusBadge(receivable.status)}
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Cliente: {receivable.client_name}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {format(new Date(receivable.service_date), 'dd/MM/yyyy', { locale: ptBR })}
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          R$ {receivable.amount.toFixed(2)}
                        </div>
                        {receivable.due_date && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            Venc: {format(new Date(receivable.due_date), 'dd/MM/yyyy', { locale: ptBR })}
                          </div>
                        )}
                      </div>
                      {receivable.notes && (
                        <p className="text-sm text-muted-foreground mt-2">
                          {receivable.notes}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {receivable.status === 'pending' && (
                        <Button
                          size="sm"
                          onClick={() => updateReceivableStatus(receivable.id, 'received')}
                        >
                          Marcar como Recebido
                        </Button>
                      )}
                      {receivable.status === 'received' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateReceivableStatus(receivable.id, 'pending')}
                        >
                          Marcar como Pendente
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
};
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useReceivables } from '@/hooks/useReceivables';
import { DollarSign, TrendingUp, Clock, CheckCircle } from 'lucide-react';

export const EarningsSummary: React.FC = () => {
  const { summary, loading } = useReceivables();

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Carregando...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted animate-pulse rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const summaryCards = [
    {
      title: "Total a Receber",
      value: summary?.total_pending || 0,
      icon: Clock,
      color: "text-blue-600"
    },
    {
      title: "Total Recebido",
      value: summary?.total_received || 0,
      icon: CheckCircle,
      color: "text-green-600"
    },
    {
      title: "Em Atraso",
      value: summary?.total_overdue || 0,
      icon: TrendingUp,
      color: "text-red-600"
    },
    {
      title: "Externos Pendentes",
      value: summary?.external_pending || 0,
      icon: DollarSign,
      color: "text-orange-600"
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Resumo Financeiro</h2>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((card, index) => {
          const IconComponent = card.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                <IconComponent className={`h-4 w-4 ${card.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  R$ {card.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {summary && (
        <Card>
          <CardHeader>
            <CardTitle>Análise Rápida</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                • Você tem <strong>R$ {summary.total_pending.toFixed(2)}</strong> em pagamentos pendentes
              </p>
              <p>
                • Já recebeu <strong>R$ {summary.total_received.toFixed(2)}</strong> em pagamentos externos
              </p>
              {summary.total_overdue > 0 && (
                <p className="text-red-600">
                  • <strong>R$ {summary.total_overdue.toFixed(2)}</strong> em pagamentos atrasados precisam de atenção
                </p>
              )}
              <p>
                • Total geral: <strong>R$ {(summary.total_pending + summary.total_received).toFixed(2)}</strong>
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
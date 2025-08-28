import React, { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useAvailability } from '@/hooks/useAvailability';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { format, startOfMonth, endOfMonth, addMonths, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface FreelancerCalendarProps {
  readOnly?: boolean;
  freelancerId?: string;
}

export const FreelancerCalendar: React.FC<FreelancerCalendarProps> = ({ 
  readOnly = false, 
  freelancerId 
}) => {
  const { toast } = useToast();
  const { availability, loading, setAvailabilitySlot, getPublicAvailability } = useAvailability();
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedStatus, setSelectedStatus] = useState<'available' | 'unavailable' | 'partially_available'>('available');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [publicAvailability, setPublicAvailability] = useState<any[]>([]);

  useEffect(() => {
    if (readOnly && freelancerId) {
      loadPublicAvailability();
    }
  }, [readOnly, freelancerId, currentMonth]);

  const loadPublicAvailability = async () => {
    if (!freelancerId) return;
    
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const data = await getPublicAvailability(freelancerId, start, end);
    setPublicAvailability(data);
  };

  const getDateAvailability = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const currentAvailability = readOnly ? publicAvailability : availability;
    return currentAvailability.find(slot => slot.date === dateStr);
  };

  const getDayClassName = (date: Date) => {
    const slot = getDateAvailability(date);
    if (!slot) return '';
    
    switch (slot.status) {
      case 'available':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'unavailable':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'partially_available':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      default:
        return '';
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (readOnly || !date) return;
    setSelectedDate(date);
    
    const slot = getDateAvailability(date);
    if (slot) {
      setSelectedStatus(slot.status);
      setStartTime(slot.start_time || '');
      setEndTime(slot.end_time || '');
    } else {
      setSelectedStatus('available');
      setStartTime('');
      setEndTime('');
    }
  };

  const handleSaveAvailability = async () => {
    if (!selectedDate) return;

    try {
      await setAvailabilitySlot(
        selectedDate,
        selectedStatus,
        startTime || undefined,
        endTime || undefined
      );

      toast({
        title: "Disponibilidade atualizada",
        description: `Data marcada como ${selectedStatus === 'available' ? 'disponível' : 
          selectedStatus === 'unavailable' ? 'indisponível' : 'parcialmente disponível'}`,
      });

      setSelectedDate(undefined);
      setStartTime('');
      setEndTime('');
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a disponibilidade",
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'unavailable':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'partially_available':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'available':
        return 'Disponível';
      case 'unavailable':
        return 'Indisponível';
      case 'partially_available':
        return 'Parcialmente Disponível';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            {readOnly ? 'Disponibilidade' : 'Minha Agenda'}
          </CardTitle>
          <CardDescription>
            {readOnly 
              ? 'Veja a disponibilidade do freelancer'
              : 'Gerencie sua disponibilidade para receber ofertas'
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                month={currentMonth}
                onMonthChange={setCurrentMonth}
                disabled={readOnly}
                className={cn("rounded-md border pointer-events-auto")}
                modifiers={{
                  available: (date) => getDateAvailability(date)?.status === 'available',
                  unavailable: (date) => getDateAvailability(date)?.status === 'unavailable',
                  partial: (date) => getDateAvailability(date)?.status === 'partially_available',
                }}
                modifiersClassNames={{
                  available: 'bg-green-100 text-green-800',
                  unavailable: 'bg-red-100 text-red-800',
                  partial: 'bg-yellow-100 text-yellow-800',
                }}
              />

              <div className="space-y-2">
                <h4 className="font-semibold">Legenda:</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-green-600 border-green-200">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Disponível
                  </Badge>
                  <Badge variant="outline" className="text-red-600 border-red-200">
                    <XCircle className="h-3 w-3 mr-1" />
                    Indisponível
                  </Badge>
                  <Badge variant="outline" className="text-yellow-600 border-yellow-200">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Parcial
                  </Badge>
                </div>
              </div>
            </div>

            {!readOnly && selectedDate && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Configurar Disponibilidade
                  </CardTitle>
                  <CardDescription>
                    {format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select value={selectedStatus} onValueChange={(value: any) => setSelectedStatus(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="available">Disponível</SelectItem>
                        <SelectItem value="unavailable">Indisponível</SelectItem>
                        <SelectItem value="partially_available">Parcialmente Disponível</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedStatus === 'partially_available' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Horário Início</Label>
                        <Input
                          type="time"
                          value={startTime}
                          onChange={(e) => setStartTime(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Horário Fim</Label>
                        <Input
                          type="time"
                          value={endTime}
                          onChange={(e) => setEndTime(e.target.value)}
                        />
                      </div>
                    </div>
                  )}

                  <Button 
                    onClick={handleSaveAvailability} 
                    disabled={loading}
                    className="w-full"
                  >
                    {loading ? 'Salvando...' : 'Salvar Disponibilidade'}
                  </Button>
                </CardContent>
              </Card>
            )}

            {readOnly && selectedDate && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Disponibilidade</CardTitle>
                  <CardDescription>
                    {format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const slot = getDateAvailability(selectedDate);
                    if (!slot) {
                      return <p className="text-muted-foreground">Sem informações de disponibilidade</p>;
                    }
                    
                    return (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(slot.status)}
                          <span className="font-medium">{getStatusLabel(slot.status)}</span>
                        </div>
                        {slot.start_time && slot.end_time && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>{slot.start_time} - {slot.end_time}</span>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
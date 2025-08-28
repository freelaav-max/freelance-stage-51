import React, { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle, Clock } from 'lucide-react';
import { useAvailability } from '@/hooks/useAvailability';
import { cn } from '@/lib/utils';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AvailabilityDisplayProps {
  freelancerId: string;
  onDateSelect?: (date: Date, availability: any) => void;
}

export const AvailabilityDisplay: React.FC<AvailabilityDisplayProps> = ({ 
  freelancerId, 
  onDateSelect 
}) => {
  const { getPublicAvailability } = useAvailability();
  const [availability, setAvailability] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAvailability();
  }, [freelancerId, currentMonth]);

  const loadAvailability = async () => {
    setLoading(true);
    try {
      const start = startOfMonth(currentMonth);
      const end = endOfMonth(currentMonth);
      const data = await getPublicAvailability(freelancerId, start, end);
      setAvailability(data);
    } finally {
      setLoading(false);
    }
  };

  const getDateAvailability = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return availability.find(slot => slot.date === dateStr);
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date && onDateSelect) {
      const slot = getDateAvailability(date);
      onDateSelect(date, slot);
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

  const selectedSlot = selectedDate ? getDateAvailability(selectedDate) : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Disponibilidade</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              month={currentMonth}
              onMonthChange={setCurrentMonth}
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
              <h4 className="font-semibold text-sm">Legenda:</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-green-600 border-green-200 text-xs">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Disponível
                </Badge>
                <Badge variant="outline" className="text-red-600 border-red-200 text-xs">
                  <XCircle className="h-3 w-3 mr-1" />
                  Indisponível
                </Badge>
                <Badge variant="outline" className="text-yellow-600 border-yellow-200 text-xs">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Parcial
                </Badge>
              </div>
            </div>
          </div>

          {selectedDate && (
            <div className="space-y-4">
              <h4 className="font-semibold">
                {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
              </h4>
              
              {selectedSlot ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(selectedSlot.status)}
                    <span className="font-medium">{getStatusLabel(selectedSlot.status)}</span>
                  </div>
                  
                  {selectedSlot.start_time && selectedSlot.end_time && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{selectedSlot.start_time} - {selectedSlot.end_time}</span>
                    </div>
                  )}
                  
                  {selectedSlot.status === 'available' && (
                    <p className="text-sm text-green-600">
                      Este freelancer está disponível nesta data.
                    </p>
                  )}
                  
                  {selectedSlot.status === 'unavailable' && (
                    <p className="text-sm text-red-600">
                      Este freelancer não está disponível nesta data.
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Nenhuma informação de disponibilidade para esta data.
                </p>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
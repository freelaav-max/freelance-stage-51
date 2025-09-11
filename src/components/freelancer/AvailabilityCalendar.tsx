import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { useFreelancerCalendar } from '@/hooks/useFreelancerCalendar';
import { Plus, Calendar as CalendarIcon, Clock, MapPin, Edit, Trash2 } from 'lucide-react';
import { format, startOfMonth, endOfMonth, addMonths, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const AvailabilityCalendar: React.FC = () => {
  const { events, loading, fetchEvents, createEvent, updateEvent, deleteEvent } = useFreelancerCalendar();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [formData, setFormData] = useState({
    type: 'external_commitment',
    title: '',
    description: '',
    location: '',
    start_time: '',
    end_time: ''
  });

  useEffect(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    fetchEvents(start, end);
  }, [currentMonth]);

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.start_datetime);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      const dayEvents = getEventsForDate(date);
      if (dayEvents.length === 0) {
        setIsDialogOpen(true);
        setEditingEvent(null);
        setFormData({
          type: 'external_commitment',
          title: '',
          description: '',
          location: '',
          start_time: '09:00',
          end_time: '17:00'
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate) return;

    const startDateTime = new Date(selectedDate);
    const endDateTime = new Date(selectedDate);
    
    if (formData.start_time) {
      const [startHour, startMinute] = formData.start_time.split(':');
      startDateTime.setHours(parseInt(startHour), parseInt(startMinute));
    }
    
    if (formData.end_time) {
      const [endHour, endMinute] = formData.end_time.split(':');
      endDateTime.setHours(parseInt(endHour), parseInt(endMinute));
    }

    const eventData = {
      start_datetime: startDateTime.toISOString(),
      end_datetime: endDateTime.toISOString(),
      type: formData.type as 'external_commitment' | 'unavailable_period',
      title: formData.title || undefined,
      description: formData.description || undefined,
      location: formData.location || undefined
    };

    let success = false;
    if (editingEvent) {
      success = await updateEvent(editingEvent.id, eventData);
    } else {
      const result = await createEvent(eventData);
      success = !!result;
    }

    if (success) {
      setIsDialogOpen(false);
      setEditingEvent(null);
      // Refresh events
      const start = startOfMonth(currentMonth);
      const end = endOfMonth(currentMonth);
      fetchEvents(start, end);
    }
  };

  const handleEditEvent = (event: any) => {
    setEditingEvent(event);
    setSelectedDate(new Date(event.start_datetime));
    setFormData({
      type: event.type,
      title: event.title || '',
      description: event.description || '',
      location: event.location || '',
      start_time: format(new Date(event.start_datetime), 'HH:mm'),
      end_time: format(new Date(event.end_datetime), 'HH:mm')
    });
    setIsDialogOpen(true);
  };

  const handleDeleteEvent = async (eventId: string) => {
    const success = await deleteEvent(eventId);
    if (success) {
      // Refresh events
      const start = startOfMonth(currentMonth);
      const end = endOfMonth(currentMonth);
      fetchEvents(start, end);
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'platform_booking':
        return 'bg-blue-100 text-blue-800';
      case 'external_commitment':
        return 'bg-green-100 text-green-800';
      case 'unavailable_period':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case 'platform_booking':
        return 'Booking Plataforma';
      case 'external_commitment':
        return 'Compromisso Externo';
      case 'unavailable_period':
        return 'Indisponível';
      default:
        return type;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Minha Agenda</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          >
            Próximo
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>
                {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                month={currentMonth}
                onMonthChange={setCurrentMonth}
                className="rounded-md border"
                modifiers={{
                  hasEvents: (date) => getEventsForDate(date).length > 0
                }}
                modifiersStyles={{
                  hasEvents: { 
                    backgroundColor: 'hsl(var(--primary))', 
                    color: 'hsl(var(--primary-foreground))',
                    fontWeight: 'bold'
                  }
                }}
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          {selectedDate && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  {format(selectedDate, 'dd/MM/yyyy', { locale: ptBR })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {getEventsForDate(selectedDate).map((event) => (
                    <div key={event.id} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <Badge className={getEventTypeColor(event.type)}>
                          {getEventTypeLabel(event.type)}
                        </Badge>
                        {event.type !== 'platform_booking' && (
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEditEvent(event)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteEvent(event.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                      {event.title && (
                        <h4 className="font-medium">{event.title}</h4>
                      )}
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {format(new Date(event.start_datetime), 'HH:mm')} - 
                        {format(new Date(event.end_datetime), 'HH:mm')}
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {event.location}
                        </div>
                      )}
                      {event.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {event.description}
                        </p>
                      )}
                    </div>
                  ))}
                  {getEventsForDate(selectedDate).length === 0 && (
                    <div className="text-center py-4">
                      <p className="text-muted-foreground mb-2">Nenhum evento nesta data</p>
                      <Button onClick={() => setIsDialogOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Adicionar Evento
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingEvent ? 'Editar Evento' : 'Adicionar Evento'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="type">Tipo do Evento</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="external_commitment">Compromisso Externo</SelectItem>
                  <SelectItem value="unavailable_period">Período Indisponível</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="title">Título (Opcional)</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ex: Reunião com cliente"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="start_time">Hora Início</Label>
                <Input
                  id="start_time"
                  type="time"
                  value={formData.start_time}
                  onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="end_time">Hora Fim</Label>
                <Input
                  id="end_time"
                  type="time"
                  value={formData.end_time}
                  onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="location">Local (Opcional)</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Ex: Studio ABC"
              />
            </div>
            <div>
              <Label htmlFor="description">Descrição (Opcional)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                placeholder="Detalhes adicionais..."
              />
            </div>
            <Button type="submit" className="w-full">
              {editingEvent ? 'Atualizar Evento' : 'Adicionar Evento'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
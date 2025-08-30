
export const specialtyTranslations = {
  audio_engineer: 'Técnico de Som',
  camera_operator: 'Operador de Câmera',
  lighting_technician: 'Iluminador',
  video_editor: 'Editor de Vídeo',
  live_streaming: 'Streaming ao Vivo',
  post_production: 'Pós-produção',
  drone_operator: 'Operador de Drone'
} as const;

export const getSpecialtyLabel = (specialty: keyof typeof specialtyTranslations): string => {
  return specialtyTranslations[specialty] || specialty;
};

export const getSpecialtyOptions = () => {
  return Object.entries(specialtyTranslations).map(([value, label]) => ({
    value,
    label
  }));
};

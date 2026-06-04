export interface CustomPersona {
  id: string;
  label: string;
  annualSalaryEuro: number;
  count: number;
}

export const CUSTOM_PERSONA_LIMITS = {
  maxPersonas: 12,
  maxLabelLength: 80,
  maxCount: 50,
  maxAnnualSalary: 50_000_000,
  minAnnualSalary: 0,
  defaultAnnualSalary: 60_000,
} as const;

export function createCustomPersonaId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `persona-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function createCustomPersona(
  partial?: Partial<Omit<CustomPersona, 'id'>>,
): CustomPersona {
  return {
    id: createCustomPersonaId(),
    label: '',
    annualSalaryEuro: CUSTOM_PERSONA_LIMITS.defaultAnnualSalary,
    count: 0,
    ...partial,
  };
}

export function isCustomPersonaValidForMeeting(persona: CustomPersona): boolean {
  if (persona.count === 0) {
    return true;
  }
  const label = persona.label.trim();
  return (
    label.length > 0 &&
    label.length <= CUSTOM_PERSONA_LIMITS.maxLabelLength &&
    Number.isFinite(persona.annualSalaryEuro) &&
    persona.annualSalaryEuro >= CUSTOM_PERSONA_LIMITS.minAnnualSalary &&
    persona.annualSalaryEuro <= CUSTOM_PERSONA_LIMITS.maxAnnualSalary
  );
}

export function getCustomParticipantCount(personas: CustomPersona[]): number {
  return personas.reduce((sum, persona) => sum + persona.count, 0);
}

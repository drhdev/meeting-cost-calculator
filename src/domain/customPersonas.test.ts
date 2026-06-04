import { describe, it, expect } from 'vitest';
import {
  createCustomPersona,
  isCustomPersonaValidForMeeting,
  getCustomParticipantCount,
} from './customPersonas';

describe('custom personas', () => {
  it('creates persona with defaults', () => {
    const persona = createCustomPersona();
    expect(persona.id).toBeTruthy();
    expect(persona.label).toBe('');
    expect(persona.annualSalaryEuro).toBe(60_000);
    expect(persona.count).toBe(0);
  });

  it('allows empty label when count is zero', () => {
    expect(isCustomPersonaValidForMeeting(createCustomPersona())).toBe(true);
  });

  it('requires label when count is positive', () => {
    expect(
      isCustomPersonaValidForMeeting(
        createCustomPersona({ label: '   ', count: 2, annualSalaryEuro: 75_000 }),
      ),
    ).toBe(false);
    expect(
      isCustomPersonaValidForMeeting(
        createCustomPersona({ label: 'DevOps', count: 3, annualSalaryEuro: 60_000 }),
      ),
    ).toBe(true);
  });

  it('sums custom participant counts', () => {
    expect(
      getCustomParticipantCount([
        createCustomPersona({ count: 3 }),
        createCustomPersona({ count: 2 }),
      ]),
    ).toBe(5);
  });
});

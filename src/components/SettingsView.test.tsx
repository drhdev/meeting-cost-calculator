import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { messages } from '../i18n';
import { SettingsView } from './SettingsView';
import { createInitialSession } from '../timer/meetingCalculator';
import type { AppLocale } from '../timer/types';

const TEST_LOCALE: AppLocale = 'de';

function testSession() {
  return { ...createInitialSession(), locale: TEST_LOCALE };
}

describe('SettingsView', () => {
  it('renders standard and custom persona sections', () => {
    render(
      <SettingsView session={testSession()} onUpdateSetup={vi.fn()} onApply={vi.fn()} />,
    );
    expect(screen.getByRole('heading', { name: /standard-personas/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /eigene personas/i })).toBeInTheDocument();
  });

  it('updates participants via stepper', async () => {
    const user = userEvent.setup();
    const onUpdateSetup = vi.fn();
    const session = testSession();

    render(
      <SettingsView session={session} onUpdateSetup={onUpdateSetup} onApply={vi.fn()} />,
    );
    await user.click(screen.getByRole('button', { name: /mehr tarifmitarbeiter/i }));

    expect(onUpdateSetup).toHaveBeenCalledWith({
      participants: { ...session.participants, tariff: 1 },
    });
  });

  it('shows invalid custom persona alert', () => {
    render(
      <SettingsView
        session={{
          ...testSession(),
          customPersonas: [
            {
              id: 'p1',
              label: '',
              annualSalaryEuro: 75_000,
              count: 2,
            },
          ],
        }}
        onUpdateSetup={vi.fn()}
        onApply={vi.fn()}
      />,
    );

    expect(screen.getByRole('alert')).toHaveTextContent(/bezeichnung/i);
  });

  it('updates cost step selection', async () => {
    const user = userEvent.setup();
    const onUpdateSetup = vi.fn();

    render(
      <SettingsView session={testSession()} onUpdateSetup={onUpdateSetup} onApply={vi.fn()} />,
    );
    await user.click(
      screen.getByRole('button', { name: messages[TEST_LOCALE]['setup.costStep.100'] }),
    );
    expect(onUpdateSetup).toHaveBeenCalledWith({ costStepEuro: 100 });
  });
});

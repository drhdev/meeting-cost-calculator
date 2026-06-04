import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SetupView } from './SetupView';
import { createInitialSession } from '../timer/meetingTimer';

describe('SetupView', () => {
  it('disables start when no participants', () => {
    render(
      <SetupView
        session={createInitialSession()}
        onUpdateSetup={vi.fn()}
        onStart={vi.fn()}
      />,
    );
    expect(screen.getByRole('button', { name: /meeting starten/i })).toBeDisabled();
  });

  it('enables start when at least one participant', async () => {
    const user = userEvent.setup();
    const onUpdateSetup = vi.fn();
    const session = createInitialSession();

    const { rerender } = render(
      <SetupView session={session} onUpdateSetup={onUpdateSetup} onStart={vi.fn()} />,
    );

    await user.click(screen.getByRole('button', { name: /mehr tarifmitarbeiter/i }));

    expect(onUpdateSetup).toHaveBeenCalledWith({
      participants: { ...session.participants, tariff: 1 },
    });

    rerender(
      <SetupView
        session={{
          ...session,
          participants: { ...session.participants, tariff: 1 },
        }}
        onUpdateSetup={onUpdateSetup}
        onStart={vi.fn()}
      />,
    );

    expect(screen.getByRole('button', { name: /meeting starten/i })).toBeEnabled();
  });

  it('calls onStart when start clicked with participants', async () => {
    const user = userEvent.setup();
    const onStart = vi.fn();
    const session = {
      ...createInitialSession(),
      participants: {
        tariff: 1,
        non_tariff: 0,
        executive: 0,
        board: 0,
      },
    };

    render(<SetupView session={session} onUpdateSetup={vi.fn()} onStart={onStart} />);
    await user.click(screen.getByRole('button', { name: /meeting starten/i }));
    expect(onStart).toHaveBeenCalledOnce();
  });

  it('switches labels when locale changes', () => {
    const { rerender } = render(
      <SetupView
        session={createInitialSession()}
        onUpdateSetup={vi.fn()}
        onStart={vi.fn()}
      />,
    );
    expect(screen.getByText('Meeting starten')).toBeInTheDocument();

    rerender(
      <SetupView
        session={{ ...createInitialSession(), locale: 'en' }}
        onUpdateSetup={vi.fn()}
        onStart={vi.fn()}
      />,
    );
    expect(screen.getByText('Start meeting')).toBeInTheDocument();
    expect(screen.queryByText('Meeting starten')).not.toBeInTheDocument();
  });

  it('updates cost step selection', async () => {
    const user = userEvent.setup();
    const onUpdateSetup = vi.fn();

    render(
      <SetupView
        session={createInitialSession()}
        onUpdateSetup={onUpdateSetup}
        onStart={vi.fn()}
      />,
    );

    await user.click(screen.getByRole('button', { name: '100 €' }));
    expect(onUpdateSetup).toHaveBeenCalledWith({ costStepEuro: 100 });
  });
});

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import App from '../App';
import { ThemeContext } from './context/themeContext';

vi.mock('react-hot-toast', () => {
  const success = vi.fn();
  const error = vi.fn();
  return {
    default: {
      success: success,
      error: error,
      promise: vi.fn((asyncPromise, messages) => {
        return asyncPromise
          .then((result) => {
            success(messages.success instanceof Function ? messages.success(result) : messages.success);
            return result;
          })
          .catch((err) => {
            error(messages.error instanceof Function ? messages.error(err) : messages.error);
            throw err;
          });
      }),
    },
  };
});
import toast from 'react-hot-toast';

const renderWithTheme = (ui, { darkTheme = false } = {}) => {
  return render(
    <ThemeContext.Provider value={{ darkTheme }}>{ui}</ThemeContext.Provider>,
  );
};



// Cenário HD1-1 
// QUANDO: Tento adicionar uma tarefa com nome vazio ou grande demais. 
// ENTÃO: Vejo erro informando que o nome é inválido. 
describe('História de Usuário: Adicionar uma nova tarefa - Como usuário, quero poder adicionar uma nova tarefa à minha lista. HD1-1', () => {
  beforeEach(() => {
    localStorage.clear();
    toast.success.mockClear();
    toast.error.mockClear();
    toast.promise.mockClear();
  });

  it('Teste TC2 - Adição de Tarefa com um Nome com 255 caracteres - Inserção bem-sucedida  ', async () => {
    renderWithTheme(<App />);
    const user = userEvent.setup();

    const input = await screen.findByRole('textbox', { name: /Todo title/i }, { timeout: 20000 });
    const addButton = screen.getByRole('button', { name: /Add Todo/i });

    const novaTarefaTitulo = '9876543210987654321098765432109876543210987654321098765432109876543210987654321098765432109876543210987654321098765432109876543210987654321098765432109876543210987654321098765432109876543210987654321098765432109876543210987654321098765432109876543210987654321098765432109876543210987654321098765432109876543210987654321098765432109876543210987654321098765432109876543210';

    await user.type(input, novaTarefaTitulo);
    await user.click(addButton);

    expect(screen.getByText(novaTarefaTitulo)).toBeInTheDocument();

    const listItems = screen.queryAllByRole('listitem');
    expect(listItems.length).toBe(1);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalled();
    });
  }, 25000);

  it('Teste TC1: Adição de Tarefa com um Nome Vazio - Bloqueada com alerta ', async () => {
    renderWithTheme(<App />);
    const user = userEvent.setup();

    const input = await screen.findByRole('textbox', { name: /Todo title/i }, { timeout: 20000 });
    const addButton = screen.getByRole('button', { name: /Add Todo/i });

    await user.clear(input);
    const novaTarefaTitulo = ' ';
    await user.type(input, novaTarefaTitulo);

    await user.click(addButton);

    const listItems = screen.queryAllByRole('listitem');
    expect(listItems.length).toBe(0);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('O título não pode estar vazio.');
    });
  }, 25000);

   it('Teste TC2 - Adição de Tarefa com um Nome com 256 caractere - Bloqueada com alerta  ', async () => {
    renderWithTheme(<App />);
    const user = userEvent.setup();

    const input = await screen.findByRole('textbox', { name: /Todo title/i }, { timeout: 20000 });
    const addButton = screen.getByRole('button', { name: /Add Todo/i });

    const novaTarefaTitulo = '19876543210987654321098765432109876543210987654321098765432109876543210987654321098765432109876543210987654321098765432109876543210987654321098765432109876543210987654321098765432109876543210987654321098765432109876543210987654321098765432109876543210987654321098765432109876543210987654321098765432109876543210987654321098765432109876543210987654321098765432109876543210';

    await user.type(input, novaTarefaTitulo);
    await user.click(addButton);
 
    expect(screen.getByText(novaTarefaTitulo)).toBeInTheDocument();

    const listItems = screen.queryAllByRole('listitem');
    expect(listItems.length).toBe(1);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalled();
    });
  }, 25000);

     it('Teste TC2 - Adição de Tarefa com um Nome com 1 caracter - Inserção bem-sucedida ', async () => {
    renderWithTheme(<App />);
    const user = userEvent.setup();

    const input = await screen.findByRole('textbox', { name: /Todo title/i }, { timeout: 20000 });
    const addButton = screen.getByRole('button', { name: /Add Todo/i });

    const novaTarefaTitulo = 'a';

    await user.type(input, novaTarefaTitulo);
    await user.click(addButton);

    expect(screen.getByText(novaTarefaTitulo)).toBeInTheDocument();

    const listItems = screen.queryAllByRole('listitem');
    expect(listItems.length).toBe(1);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalled();
    });
  }, 25000);

    it('Teste TC2 - Adição de Tarefa com um Nome com numero de caracteres negativo - Rejeitada (caso Impossível de acontecer)   ', async () => {
    renderWithTheme(<App />);
    const user = userEvent.setup();

    const input = await screen.findByRole('textbox', { name: /Todo title/i }, { timeout: 20000 });
    const addButton = screen.getByRole('button', { name: /Add Todo/i });

    const novaTarefaTitulo = null;

    await user.type(input, novaTarefaTitulo);
    await user.click(addButton);

    expect(screen.getByText(novaTarefaTitulo)).toBeInTheDocument();

    const listItems = screen.queryAllByRole('listitem');
    expect(listItems.length).toBe(1);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalled();
    });
  }, 25000);
});
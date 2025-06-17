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


// Cenário HD2-1 
// DADO: Endpoint para buscar tarefas por nome. 
// QUANDO: GET ao clicar na tarefa. 
// ENTÃO: O front-end recebe e mostra os dados de uma tarefa. 
describe('Endpoint para buscar tarefas por nome. HD2-1', () => {
  beforeEach(() => { 
    localStorage.clear();
    toast.success.mockClear();
    toast.error.mockClear();
    toast.promise.mockClear();
  });

  it('Teste TC-01  - Buscar tarefa: Revisar Documento de Requisitos - Tarefa encontrada - SUCESSO', async () => {
    renderWithTheme(<App />);
    const user = userEvent.setup();

    const input = await screen.findByRole('textbox', { name: /Todo title/i }, { timeout: 20000 });
    const addButton = screen.getByRole('button', { name: /Add Todo/i });
 
    const novaTarefaTitulo = 'Revisar Documento de Requisitos';

    await user.type(input, novaTarefaTitulo);
    await user.click(addButton);

    const searchInput = screen.getByPlaceholderText(/Search notes.../i);
    await user.type(searchInput, novaTarefaTitulo);

    await user.click(searchInput);
    expect(screen.getByText(novaTarefaTitulo)).toBeInTheDocument();

  }, 25000);

    it('Teste TC-02  - Buscar: Tarefa que nunca existiu - Tarefa não encontrada - ERRO', async () => {
    renderWithTheme(<App />);
    const user = userEvent.setup();

    const input = await screen.findByRole('textbox', { name: /Todo title/i }, { timeout: 20000 });
    const addButton = screen.getByRole('button', { name: /Add Todo/i });
 
    const novaTarefaTitulo = 'Tarefa que nunca existiu';

    const searchInput = screen.getByPlaceholderText(/Search notes.../i);
    await user.type(searchInput, novaTarefaTitulo);

    await user.click(searchInput);
    expect(screen.getByText(novaTarefaTitulo)).toBeInTheDocument();

  }, 25000);

   it('Teste TC-03 - Buscar:  - Inpedir busca - ERRO', async () => {
   renderWithTheme(<App />);
    const user = userEvent.setup();

    const novaTarefaTitulo = ' ';

    const searchInput = screen.getByPlaceholderText(/Search notes.../i);
    await user.type(searchInput, novaTarefaTitulo);

    await user.click(searchInput);
    expect(screen.getByText(novaTarefaTitulo)).toBeInTheDocument();

  }, 25000);
});
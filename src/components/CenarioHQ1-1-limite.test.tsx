import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import App from '../App';
import { ThemeContext } from './context/themeContext';
import toast from 'react-hot-toast'; // Ensure this import is here

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


const renderWithTheme = (ui, { darkTheme = false } = {}) => {
  return render(
    <ThemeContext.Provider value={{ darkTheme }}>{ui}</ThemeContext.Provider>,
  );
};



// Cenário HQ1-1
// QUANDO: Clico para adicionar mais uma. 
//ENTÃO: A tarefa não é adicionada e vejo um alerta. 
describe('História de Usuário: Adicionar uma nova tarefa - Como usuário, quero poder adicionar uma nova tarefa à minha lista. HD1-1', () => {
  beforeEach(() => {
    localStorage.clear();
    toast.success.mockClear();
    toast.error.mockClear();
    toast.promise.mockClear();
  });

  it('Teste TC_N: Adição de 101st Tarefa - Inserção negada', async () => {
    renderWithTheme(<App />);
    const user = userEvent.setup();

    const input = await screen.findByRole('textbox', { name: /Todo title/i }, { timeout: 20000 });
    const addButton = screen.getByRole('button', { name: /Add Todo/i });

    const NUM_TASKS = 100;


    for (let i = 1; i <= NUM_TASKS; i++) {
      const taskTitle = `Task ${i}`;
      await user.clear(input); 
      await user.type(input, taskTitle);
      await user.click(addButton);
        
    }
    await user.type(input, '101');
    await user.click(addButton);

    const listItems = screen.queryAllByRole('listitem');
    expect(listItems.length).toBe(NUM_TASKS);


  }, 60000);

  it('Teste TC_N: Adição de 102nd Tarefa - Inserção negada', async () => {
    renderWithTheme(<App />);
    const user = userEvent.setup();

    const input = await screen.findByRole('textbox', { name: /Todo title/i }, { timeout: 20000 });
    const addButton = screen.getByRole('button', { name: /Add Todo/i });

    const NUM_TASKS = 101;

    for (let i = 1; i <= NUM_TASKS; i++) {
      const taskTitle = `Task ${i}`;
      await user.clear(input); 
      await user.type(input, taskTitle);
      await user.click(addButton);
        
    }
    await user.type(input, '102');
    await user.click(addButton);

    const listItems = screen.queryAllByRole('listitem');
    expect(listItems.length).toBe(NUM_TASKS);


  }, 60000);

    it('Teste TC_N: Adição de 100th Tarefa - Inserção permitida', async () => {
    renderWithTheme(<App />);
    const user = userEvent.setup();

    const input = await screen.findByRole('textbox', { name: /Todo title/i }, { timeout: 20000 });
    const addButton = screen.getByRole('button', { name: /Add Todo/i });

    const NUM_TASKS = 99;

    for (let i = 1; i <= NUM_TASKS; i++) {
      const taskTitle = `Task ${i}`;
      await user.clear(input); 
      await user.type(input, taskTitle);
      await user.click(addButton);
        
    }
    await user.type(input, '100');
    await user.click(addButton);

    const listItems = screen.queryAllByRole('listitem');
    expect(listItems.length).toBe(NUM_TASKS);


  }, 60000);
});

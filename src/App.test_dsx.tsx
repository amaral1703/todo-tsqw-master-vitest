// import { vi } from 'vitest';

// // Mock react-hot-toast with simplified implementation
// vi.mock('react-hot-toast', () => {
//   const toastSuccessMock = vi.fn();
//   const toastErrorMock = vi.fn(); 
//   const toastPromiseMock = vi.fn((promiseCreator, messages) => {
//     // Immediately resolve the promise for testing purposes
//     const promise = promiseCreator();
//     promise
//       .then((result) => {
//         if (messages && messages.success) {
//           toastSuccessMock(typeof messages.success === 'function' ? messages.success(result) : messages.success);
//         }
//       })
//       .catch((error) => {
//         if (messages && messages.error) {
//           toastErrorMock(typeof messages.error === 'function' ? messages.error(error) : messages.error);
//         }
//       });
//     return promise;
//   });

//   return {
//     default: {
//       success: toastSuccessMock,
//       error: toastErrorMock,
//       promise: toastPromiseMock,
//     },
//     Toaster: () => <div data-testid="toaster" />,
//   };
// });

// import { render, screen, waitFor, act } from '@testing-library/react';
// import userEvent from '@testing-library/user-event';
// import App from './App';
// import { ThemeProvider } from './components/context/themeContext';
// // import React from 'react';

// // // Access the mocked toast functions directly
// // const toastSuccessMock = vi.fn();
// // const toastErrorMock = vi.fn();
// // const toast = { 
// //   success: toastSuccessMock, 
// //   error: toastErrorMock,
// //   promise: vi.fn() 
// // };

// // Helper function to render App with ThemeProvider
// const renderAppWithTheme = () => {
//   return render(
//     <ThemeProvider>
//       <App />
//     </ThemeProvider>
//   );
// };

// const MAX_NOTES = 3;

// describe('Componente App - Limite de Tarefas', () => {
//   beforeEach(() => {
//     vi.clearAllMocks();
//     localStorage.clear();
    
//     // Mock setTimeout to skip the loading state
//     vi.useFakeTimers();
//   });

//   afterEach(() => {
//     vi.useRealTimers();
//   });

//   it(`História de Usuário: Adicionar tarefas abaixo do limite - Como usuário, quero poder adicionar tarefas enquanto o total for menor que ${MAX_NOTES}.`, async () => {
//     // Dados predefinidos
//     const initialNotes = [
//       { id: '1', title: 'Tarefa 1', completed: false },
//       { id: '2', title: 'Tarefa 2', completed: false },
//     ];
//     localStorage.setItem('notes', JSON.stringify(initialNotes));

//     renderAppWithTheme();
    
//     // Skip the loading state
//     vi.advanceTimersByTime(5000);

//     const user = userEvent.setup();
    
//     // Find form elements
//     const input = await screen.findByLabelText(/Todo title/i);
//     const addButton = screen.getByRole('button', { name: /Add Todo/i });

//     // Adicionar uma tarefa
//     await act(async () => {
//       await user.type(input, 'Tarefa Nova');
//       await user.click(addButton);
//     });

//     // Verificar se a tarefa foi adicionada
//     await waitFor(() => {
//       expect(screen.getByText('Tarefa Nova')).toBeInTheDocument();
//     }, { timeout: 5000 }); // Reduzir o timeout aqui
//       // Verificar se toast.success foi chamado com a mensagem correta
//       await waitFor(() => {
//         expect(toast.success).toHaveBeenCalledTimes(1);
//         // O argumento é um elemento React: <span>Tarefa Nova Added!</span>
//         // const mockedToastSuccess = toast.success as vi.Mock;
//         const successArg = mockedToastSuccess.mock.calls[0][0];
//         expect(successArg.props.children).toBe('Tarefa Nova Added!');
//       });
//   }, 8000); // Reduzir o timeout geral do teste

//   it(`História de Usuário: Impedir adição no limite - Como usuário, ao tentar adicionar uma tarefa quando já existem ${MAX_NOTES}, quero ser impedido e ver uma mensagem de erro.`, async () => {
//     // Fill localStorage with MAX_NOTES tasks
//     const initialNotes = Array.from({ length: MAX_NOTES }, (_, i) => ({
//       id: `id-${i}`,
//       title: `Tarefa Inicial ${i + 1}`,
//       completed: false,
//     }));
//     localStorage.setItem('notes', JSON.stringify(initialNotes));

//     renderAppWithTheme();
    
//     // Skip the loading state
//     vi.advanceTimersByTime(5000);
    
//     const user = userEvent.setup();
    
//     // Find form elements
//     const input = await screen.findByLabelText(/Todo title/i);
//     const addButton = screen.getByRole('button', { name: /Add Todo/i });

//     // Try to add one more task beyond the limit
//     await act(async () => {
//       await user.type(input, `Tarefa ${MAX_NOTES + 1}`);
//       await user.click(addButton);
//     });

//     // Verify that toast.promise was called
//     // Verificar se toast.error foi chamado com a mensagem de erro correta
//     await waitFor(() => {
//       expect(toast.error).toHaveBeenCalledTimes(1);
//       // O argumento é um elemento React: <span>Limite de X tarefas atingido.</span>
//       //const mockedToastError = toast.error as vi.Mock;
//       const errorArg = mockedToastError.mock.calls[0][0];
//       const expectedErrorMessage = `Limite de ${MAX_NOTES} tarefas atingido.`;
//       expect(errorArg.props.children).toBe(expectedErrorMessage);
//     });

//     // Esperar que a UI reflita que a tarefa não foi adicionada
//     // Wait for the UI to update
//     await waitFor(() => {
//       // Make sure we still have only MAX_NOTES tasks
//       const taskItems = screen.getAllByRole('listitem').filter(item => 
//         !item.textContent?.includes('No Todos available')
//       );
//       expect(taskItems.length).toBe(MAX_NOTES);
//     }, { timeout: 10000 });
    
//     // Make sure the new task was not added
//     expect(screen.queryByText(`Tarefa ${MAX_NOTES + 1}`)).not.toBeInTheDocument();
    
//     // Verify all initial tasks are still there
//     for (let i = 1; i <= MAX_NOTES; i++) {
//       expect(screen.getByText(`Tarefa Inicial ${i}`)).toBeInTheDocument();
//     }
//   }, 10000);
// });
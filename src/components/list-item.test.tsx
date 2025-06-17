import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ListItem from './list-item'
import { ThemeContext } from './context/themeContext'
import { vi } from 'vitest'


// Mock do react-hot-toast para não exibir toasts reais durante os testes
vi.mock('react-hot-toast', () => {
  return {
    default: {
      error: vi.fn(),
    }
  }
})
import toast from 'react-hot-toast';

// Função auxiliar para renderizar o componente com o provedor de tema
function renderWithTheme(ui, { darkTheme = false } = {}) {
  return render(
    <ThemeContext.Provider value={{ darkTheme }}>
      {ui}
    </ThemeContext.Provider>
  )
}

describe('Componente ListItem', () => {
  const id = '1'
  const tituloInicial = 'Tarefa de Teste'
  const concluidaInicialmente = false

  it('História de Usuário: Visualizar uma tarefa - Como usuário, quero ver o título da minha tarefa e uma caixa de seleção para marcar/desmarcar sua conclusão.', () => {
    const toggle = vi.fn()
    const onDelete = vi.fn()
    const onSaveEdit = vi.fn()

    renderWithTheme(
      <ListItem
        id={id}
        title={tituloInicial}
        completed={concluidaInicialmente}
        toggle={toggle}
        onDelete={onDelete}
        onSaveEdit={onSaveEdit}
      />
    )

    expect(screen.getByText(tituloInicial)).toBeInTheDocument()

    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeInTheDocument()
    expect(checkbox).not.toBeChecked()

    fireEvent.click(checkbox)
    expect(toggle).toHaveBeenCalledWith(id)
  })

  it('História de Usuário: Cancelar edição - Como usuário, se eu começar a editar uma tarefa, quero poder cancelar a edição e ver o título original novamente.', async () => {
    const toggle = vi.fn()
    const onDelete = vi.fn()
    const onSaveEdit = vi.fn()

    renderWithTheme(
      <ListItem
        id={id}
        title={tituloInicial}
        completed={concluidaInicialmente}
        toggle={toggle}
        onDelete={onDelete}
        onSaveEdit={onSaveEdit}
      />
    )
    // Dado que o usuário clicou em editar
    const editButton = screen.getByRole('button', { name: /edit/i })
    await userEvent.click(editButton)

    // E modificou o título no input
    const input = screen.getByDisplayValue(tituloInicial)
    fireEvent.change(input, { target: { value: 'Novo título não salvo' } })

    // Quando o usuário clica no botão "Cancelar"
    const cancelButton = screen.getByRole('button', { name: /cancel/i })
    await userEvent.click(cancelButton)

    // Então o título original é exibido novamente e o input desaparece
    expect(screen.getByText(tituloInicial)).toBeInTheDocument()
    expect(screen.queryByDisplayValue('Novo título não salvo')).not.toBeInTheDocument()
  })

  it('História de Usuário: Excluir uma tarefa - Como usuário, quero poder excluir uma tarefa da minha lista.', async () => {
    const toggle = vi.fn()
    const onDelete = vi.fn()
    const onSaveEdit = vi.fn()

    renderWithTheme(
      <ListItem
        id={id}
        title={tituloInicial}
        completed={concluidaInicialmente}
        toggle={toggle}
        onDelete={onDelete}
        onSaveEdit={onSaveEdit}
      />
    )

    const deleteButton = screen.getByRole('button', { name: /delete/i })
    // Quando o usuário clica no botão "Excluir"
    await userEvent.click(deleteButton)

    // Então a função de exclusão é chamada com o ID da tarefa
    expect(onDelete).toHaveBeenCalledWith(id)
  })

})


 
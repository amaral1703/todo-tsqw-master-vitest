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

  it('História de Usuário: Editar uma tarefa - Como usuário, quero poder editar o título de uma tarefa e salvá-lo com sucesso.', async () => {
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

    // Aqui trocamos getByTitle para getByRole com name 'Edit' (case insensitive)
    // Quando o usuário clica no botão "Editar"
    const editButton = screen.getByRole('button', { name: /edit/i })
    await userEvent.click(editButton)

    // Então um campo de input aparece com o título atual
    const input = screen.getByDisplayValue(tituloInicial)
    expect(input).toBeInTheDocument()

    // E o usuário altera o título
    await userEvent.clear(input)
    await userEvent.type(input, 'Tarefa Atualizada')

    // E clica no botão "Salvar"
    const saveButton = screen.getByRole('button', { name: /save/i })
    await userEvent.click(saveButton)

    // Então a função de salvar é chamada com o ID e o novo título
    expect(onSaveEdit).toHaveBeenCalledWith(id, 'Tarefa Atualizada')
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

  it('História de Usuário: Impedir título vazio - Como usuário, ao tentar salvar uma tarefa editada com um título vazio, quero ver uma mensagem de erro e a tarefa não deve ser salva.', async () => {
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
    // Dado que o usuário está editando uma tarefa
    const editButton = screen.getByRole('button', { name: /edit/i })
    await userEvent.click(editButton)

    // E apaga o conteúdo do título (deixando apenas espaços, por exemplo)
    const input = screen.getByDisplayValue(tituloInicial)
    fireEvent.change(input, { target: { value: ' ' } })

    // Quando o usuário tenta salvar
    const saveButton = screen.getByRole('button', { name: /save/i })
    await userEvent.click(saveButton)

    // Então uma mensagem de erro é exibida
    expect(toast.error).toHaveBeenCalledWith('O título não pode estar vazio.') // Ajuste a mensagem conforme a implementação
    // E a função de salvar não é chamada
    expect(onSaveEdit).not.toHaveBeenCalled()
  })

  it('História de Usuário: Lidar com título nulo na edição - Como usuário, se uma tarefa for carregada com título nulo e eu tentar salvá-la (mesmo sem alteração), quero ver uma mensagem de erro.', async () => {
    const onSaveEdit = vi.fn()
    const toggle = vi.fn()
    const onDelete = vi.fn()
    renderWithTheme(
      <ListItem
        id="test-null-id"
        title={null} // Cenário com título inicial nulo
        completed={false}
        toggle={toggle}
        onDelete={onDelete}
        onSaveEdit={onSaveEdit}
      />
    )

    // Dado que o usuário entra no modo de edição de uma tarefa com título inicial nulo
    const editButton = screen.getByRole('button', { name: /edit/i })
    await userEvent.click(editButton)

    // O campo de input deve estar vazio
    const input = screen.getByRole('textbox')
    expect(input).toHaveValue('')

    // Quando o usuário tenta salvar sem modificar o input
    const saveButton = screen.getByRole('button', { name: /save/i })
    await userEvent.click(saveButton)

    // Então uma mensagem de erro é exibida
    expect(toast.error).toHaveBeenCalledWith('O título não pode estar vazio.') // Ajuste a mensagem conforme a implementação
    // E a função de salvar não é chamada
    expect(onSaveEdit).not.toHaveBeenCalled()
  })
})

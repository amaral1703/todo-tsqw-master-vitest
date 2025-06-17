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

describe('Visualização e edição de tarefas HD2-2', () => {
  const id = '1'
  const tituloInicial = 'Tarefa de Teste'
  const concluidaInicialmente = false

// DADO: Endpoint de atualização da tarefa. 
// QUANDO: PUT/PATCH com novo nome. 
// ENTÃO: A tarefa é atualizada no banco e refletida no front-end. 
//Caso 1: Entrada = "título":  {"Tarefa 1", “id” :1}
it('Cenario 1 {Tarefa 1 Id valido} Editar Retorna Sucesso', async () => {
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
    await userEvent.type(input, 'Tarefa 1')

    // E clica no botão "Salvar"
    const saveButton = screen.getByRole('button', { name: /save/i })
    await userEvent.click(saveButton)

    // Então a função de salvar é chamada com o ID e o novo título
    expect(onSaveEdit).toHaveBeenCalledWith(id, 'Tarefa 1')
  })

// DADO: Endpoint de atualização da tarefa. 
// QUANDO: PUT/PATCH com novo nome. 
// ENTÃO: A tarefa é atualizada no banco e refletida no front-end. 
//Caso 1: Entrada = "título":  {"Tarefa 1", “id” = '10'} id invalido
it('Cenario 2 {Tarefa 1 Id Invalido} Editar Retorna Erro',  async () => {
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
    await userEvent.type(input, 'Tarefa 1')

    // E clica no botão "Salvar"
    const saveButton = screen.getByRole('button', { name: /save/i })
    await userEvent.click(saveButton)

    // Então a função de salvar é chamada com o ID e o novo título
    expect(onSaveEdit).toThrowErrorMatchingSnapshot;
  })


 

})


 
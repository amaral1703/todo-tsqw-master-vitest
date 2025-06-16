import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import TodoForm from "./components/todo-form";
import { useContext, useEffect, useState, ChangeEvent, FormEvent } from "react";
import ListItem from "./components/list-item";
import { FaNoteSticky, FaSun, FaTrashCan, FaMoon } from "react-icons/fa6";
import toast, { Toaster } from "react-hot-toast";
import { Card, IconButton } from "@mui/material";
import { ThemeContext } from "./components/context/themeContext";
import Loading from "./components/loading";


export default function App() {
  const { toggleTheme, darkTheme } = useContext(ThemeContext);

  const [notes, setNotes] = useState(() => {
    const value = localStorage.getItem("notes");
    return value ? JSON.parse(value) : [];
  });
  useEffect(()=>{
    window.localStorage.setItem("notes", JSON.stringify(notes));
  },[notes]);
  const [text, setText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const MAX_NOTES = 3; // Defina o limite máximo de tarefas aqui

  // Loading state
  const [isLoading, setIsLoading] = useState(true);

   
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  function handleChange(e) {
    setText(e.target.value);
  }

  function handleSearchChange(e) {
    setSearchTerm(e.target.value);
  }

  function addNote() {
    // A verificação do limite MAX_NOTES agora é feita exclusivamente em handleSubmit
    // antes de chamar addNote.
    setNotes((prevNotes) => [
      ...prevNotes,
      { id: crypto.randomUUID(), title: text, completed: false },
    ]);
  }

  function handleSubmit(e) {
    e.preventDefault(); // Prevent default form submission
    toast.promise(
      new Promise((resolve, reject) => {
        if (notes.length >= MAX_NOTES) {
          reject(new Error(`Limite de ${MAX_NOTES} tarefas atingido.`));
          return;
        }
        addNote(); 
        resolve(text); // Resolve com o texto da nota para usar no toast de sucesso
      }),
      {
        loading: "Adding note...",
        success: (addedText) => <span>{`${addedText} Added!`}</span>,
        error: (err) => <span>{err.message || "Failed to add note"}</span>,
      },
      {
        duration: 8000,
      }
    );
    setText(""); // Limpa o campo de texto independentemente do resultado da promessa, ou pode ser movido para dentro do resolve.
  }
  function handleDelete(id) {
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
    toast.success("Todo  Deleted!");
  }

  function toggleNote(id) {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === id ? { ...note, completed: !note.completed } : note
      )
    );
  }

    function handleSaveNote(id, newTitle) {
    // newTitle is already trimmed and validated by ListItem
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === id ? { ...note, title: newTitle } : note
      )
    );
    toast.success("Note updated successfully!");
  }

  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase())
  );



  return (
    <div
      className={`h-full container-fluid justify-content-center align-items-center ${darkTheme ? "bg" : ""
        }`}
    >
      <div className="d-flex justify-content-evenly align-content-center w-100">
        <center className="mt-5 mb-5">
          <span className={`${darkTheme ? "text-light" : ""} header`}>
            <img src="/icon.png" alt="logo" style={{ width: 200 }} />
            <span>TODO APP</span>
          </span>
        </center>
        <span>
          <button
            onClick={toggleTheme}
            className={darkTheme ? "text-light btn" : "btn"}

          >
            {darkTheme ? <FaSun /> : <FaMoon />}
          </button>
        </span>
      </div>

      <div className="row col-sm-10 d-flex gap-2">
        <Card
          className={`container ${!darkTheme ? "border" : ""
            } col-sm-5 p-5 me-1 rounded ${darkTheme ? "bg-black" : ""}`}
        >
          <TodoForm text={text} change={handleChange} submit={handleSubmit} />
        </Card>
        <Card
          className={`d-flex flex-column col-sm-5 ${!darkTheme ? "border" : ""
            } p-5 gap-2 rounded ${darkTheme ? "bg-black" : ""}`}
        >
          <span
            className={`text-center accordion mb-2 ${darkTheme ? "text-light" : ""
              }`}
          >
            <FaNoteSticky /> <span>Todos </span>
            <span className="badge bg-primary">{notes.length}</span>
          </span>
          <input
            type="text"
            placeholder="Search notes..."
            className={`form-control mb-2 ${darkTheme ? "bg-dark text-light border-secondary" : ""}`}
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {notes.length > 0 && (
            <div className="d-flex justify-content-end">
              <span className={darkTheme ? "text-light accordion" : "accordion"}>
                Remove all{" "}
                <IconButton
                  color="error"
                  size="small"
                  onClick={() => { setNotes([]); toast.success("All todos cleared!"); }}
                >
                  <FaTrashCan />
                </IconButton>{" "}
              </span>
            </div>
          )}
          <ul className="list-group flex-column">
            {notes.length === 0 ? (
              <li className={`list-group-item ${darkTheme ? "text-light bg-black" : ""}`}>
                No Todos available
              </li>
            ) : (
              filteredNotes.map((note) => (
                <ListItem
                  key={note.id}
                  id={note.id}
                  toggle={toggleNote}
                  completed={note.completed}
                  title={note.title}
                  onDelete={handleDelete}
                  onSaveEdit={handleSaveNote} // Pass the new handler here
                />
              ))
            )}
          </ul>
        </Card>
      </div>
    </div>
  )
}



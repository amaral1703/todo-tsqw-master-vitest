import { FaTrashCan } from "react-icons/fa6";
import { FaPencilAlt, FaSave, FaTimes } from "react-icons/fa";
import { Checkbox, Button } from "@mui/material";
import { useContext, useState, useEffect } from "react";
import { ThemeContext } from "./context/themeContext";

import toast from "react-hot-toast";

export default function ListItem({
  title,
  completed,
  id,
  onDelete,
  toggle,
  onSaveEdit,
}) {

  const themeContext = useContext(ThemeContext);
  const { darkTheme } = themeContext;

  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title ?? ''); // Garante que editedTitle seja sempre string

  // Effect to update editedTitle if the title prop changes from outside,
  // but only if not currently editing.
  useEffect(() => {
    if (!isEditing) {
      setEditedTitle(title ?? ''); // Garante que editedTitle seja sempre string
    }
  }, [title, isEditing]);

  const handleEnableEdit = () => {
    setEditedTitle(title ?? ''); // Garante que editedTitle seja sempre string
    setIsEditing(true);
  };

  const handleSaveChanges = () => {
    // Como editedTitle agora é sempre uma string, podemos simplificar a verificação.
    const trimmedTitleValue = editedTitle.trim();
    if (trimmedTitleValue === "") {
      toast.error("O título não pode estar vazio.");
      return; // Stay in editing mode for user to correct or cancel
    }
    onSaveEdit(id, trimmedTitleValue);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedTitle(title ?? ''); // Garante que editedTitle seja sempre string
  };

  const handleTitleChange = (e) => {
    setEditedTitle(e.target.value);
  };

  return (
    <li
      className={`${darkTheme ? "bg" : ""} list-group ${!darkTheme ? "list-group-item" : ""} p-1 m-2`}
    >
      <div className="d-flex justify-content-between align-items-center w-100">
        <Checkbox
          onChange={() => toggle(id)}
          checked={completed}
          sx={{ color: darkTheme ? "white" : undefined }}
        />
        {isEditing ? (
          <input
            type="text"
            value={editedTitle} // Agora editedTitle é sempre uma string
            onChange={handleTitleChange}
            className={`form-control form-control-sm mx-2 flex-grow-1 ${
              darkTheme ? "bg-dark text-light border-secondary" : ""
            }`}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSaveChanges();
              }
              if (e.key === "Escape") {
                e.preventDefault();
                handleCancelEdit();
              }
            }}
          />
        ) : (
          <span
            className={`${darkTheme ? "text-light" : ""} ${completed ? "text-decoration-line-through" : ""} flex-grow-1 mx-2`}
            style={{ cursor: "pointer", wordBreak: "break-word" }}
            onDoubleClick={handleEnableEdit}
            title="Double-click to edit"
          >
            {title ?? ''} {/* Garante que nada quebre se title for null ao renderizar */}
          </span>
        )}
        <div className="d-flex align-items-center">
          {isEditing ? (
            <>
              <Button color="success" variant="contained" onClick={handleSaveChanges} size="small" className="me-1" title="Save">
                <FaSave />
              </Button>
              <Button color="inherit" variant="outlined" onClick={handleCancelEdit} size="small" title="Cancel" sx={{ borderColor: darkTheme ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.23)', color: darkTheme ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.54)' }}>
                <FaTimes />
              </Button>
            </>
          ) : (
            <>
              <Button color="primary" variant="contained" onClick={handleEnableEdit} size="small" className="me-1" title="Edit">
                <FaPencilAlt />
              </Button>
              <Button color="error" variant="contained" onClick={() => onDelete(id)} size="small" title="Delete">
                <FaTrashCan />
              </Button>
            </>
          )}
        </div>
      </div>
    </li>
  );
}

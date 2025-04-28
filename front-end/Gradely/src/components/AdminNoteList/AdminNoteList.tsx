import React from "react";

interface Note {
  id: string | number;
  note_value: number;
  created_at?: string;
  user_id?: string;
  user_name?: string;
  user_surname?: string;
}

interface Props {
  notes: Note[];
  onEdit: (note: Note) => void;
  onDelete: (noteId: string | number) => void;
}

const AdminNoteList: React.FC<Props> = ({ notes, onEdit, onDelete }) => {
  return (
    <div className="note-list-container">
      <h3>Liste des notes</h3>
      {notes.length === 0 ? (
        <p>Aucune note trouvée.</p>
      ) : (
        <ul className="note-list">
          {notes.map(note => (
            <li key={note.id} className="note-item">
              <div className="note-info">
                {note.user_name && (
                  <span className="user-name">
                    {note.user_name} {note.user_surname}:
                  </span>
                )}
                <span className="note-value">{note.note_value}/20</span>
                {note.created_at && (
                  <span className="note-date">
                    {new Date(note.created_at).toLocaleDateString("fr-FR")}
                  </span>
                )}
              </div>
              <div className="note-actions">
                <button onClick={() => onEdit(note)} className="edit-button">
                  ✏️ Modifier
                </button>
                <button onClick={() => onDelete(note.id)} className="delete-button">
                  🗑️ Supprimer
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminNoteList;
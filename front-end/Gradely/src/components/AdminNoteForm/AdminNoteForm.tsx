import React, { useState, useEffect } from "react";

interface Props {
  onSubmit: (noteValue: number, userId?: string) => void;
  initialValue?: number | string;
  isEditing: boolean;
  onCancel: () => void;
  showUserSelect?: boolean;
  users?: Array<{id: string, name: string}>;
}

const AdminNoteForm: React.FC<Props> = ({ 
  onSubmit, 
  initialValue = "", 
  isEditing, 
  onCancel,
  showUserSelect = false,
  users = []
}) => {
  const [noteValue, setNoteValue] = useState<string>("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setNoteValue(initialValue.toString());
  }, [initialValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    const valueNum = parseFloat(noteValue);
    
    if (isNaN(valueNum)) {
      setError("Veuillez entrer un nombre valide");
      return;
    }
    
    if (valueNum < 0 || valueNum > 20) {
      setError("La note doit être entre 0 et 20");
      return;
    }
    
    if (showUserSelect && !selectedUserId) {
      setError("Veuillez sélectionner un élève");
      return;
    }
    
    onSubmit(valueNum, showUserSelect ? selectedUserId : undefined);
    if (!isEditing) {
      setNoteValue("");
      setSelectedUserId("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="note-form">
      {showUserSelect && (
        <select
          value={selectedUserId}
          onChange={(e) => setSelectedUserId(e.target.value)}
          required
          className="user-select"
        >
          <option value="">Sélectionner un élève</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
      )}
      
      <input
        type="number"
        step="0.1"
        min="0"
        max="20"
        value={noteValue}
        onChange={(e) => setNoteValue(e.target.value)}
        placeholder="Note (ex: 14.5)"
        className="note-input"
      />
      
      <button type="submit" className="submit-button">
        {isEditing ? "Modifier" : "Ajouter"} la note
      </button>
      
      {isEditing && (
        <button type="button" onClick={onCancel} className="cancel-button">
          Annuler
        </button>
      )}
      
      {error && <p className="error-text">{error}</p>}
    </form>
  );
};

export default AdminNoteForm;
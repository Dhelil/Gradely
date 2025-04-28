import React, { useState, useEffect } from 'react';

interface Note {
  id: number;
  note_value: number;
  created_at: string;
  updated_at: string;
  user_id?: number;
  user_name?: string;
  user_surname?: string;
}

interface User {
  id: number;
  name: string;
  surname: string;
}

interface AdminNoteManagerProps {
  mode?: 'me' | 'all';
  userId?: string;
}

const AdminNoteManager: React.FC<AdminNoteManagerProps> = ({ mode = 'all', userId = '' }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [noteValue, setNoteValue] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const effectiveUserId = userId || localStorage.getItem('userId') || '0';

  useEffect(() => {
    fetchNotes();
    if (mode === 'all') {
      fetchUsers();
    }
  }, [mode, effectiveUserId]);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const url = mode === 'all' 
        ? 'http://localhost:4000/notes' 
        : `http://localhost:4000/notes/${effectiveUserId}/notes`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Erreur serveur');
      
      const data = await response.json();
      setNotes(Array.isArray(data) ? data : []);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erreur inconnue');
      setError(error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:4000/user', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Erreur serveur');
      
      const data = await response.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erreur inconnue');
      setError(error.message);
      console.error(error);
    }
  };

  const handleSubmitNote = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const targetUserId = mode === 'all' ? selectedUserId : effectiveUserId;
      const noteValueNum = parseFloat(noteValue);

      if (isNaN(noteValueNum) || noteValueNum < 0 || noteValueNum > 20) {
        throw new Error('La note doit être un nombre entre 0 et 20');
      }

      if (editMode && editId) {
        const response = await fetch(
          `http://localhost:4000/notes/${targetUserId}/notes/update/${editId}`, 
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ note_value: noteValueNum }),
          }
        );

        if (!response.ok) throw new Error('Erreur lors de la modification');
      } else {
        const response = await fetch(
          `http://localhost:4000/notes/${targetUserId}/notes/add`, 
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ note_value: noteValueNum }),
          }
        );

        if (!response.ok) throw new Error('Erreur lors de l\'ajout');
      }

      await fetchNotes();
      resetForm();
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erreur inconnue');
      setError(error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNote = async (id: number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette note ?')) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const targetUserId = mode === 'all' 
        ? (notes.find(n => n.id === id)?.user_id?.toString() || effectiveUserId)
        : effectiveUserId;

      const response = await fetch(
        `http://localhost:4000/notes/${targetUserId}/delete/${id}`, 
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) throw new Error('Erreur lors de la suppression');

      await fetchNotes();
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erreur inconnue');
      setError(error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (note: Note) => {
    setNoteValue(note.note_value.toString());
    setSelectedUserId(note.user_id?.toString() || '');
    setEditMode(true);
    setEditId(note.id);
  };

  const resetForm = () => {
    setNoteValue('');
    setSelectedUserId('');
    setEditMode(false);
    setEditId(null);
    setError(null);
  };

  return (
    <div className="admin-note-manager">
      <h1>{mode === 'all' ? 'Gestion de toutes les notes' : 'Mes notes'}</h1>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmitNote}>
        {mode === 'all' && (
          <div className="form-group">
            <label>Utilisateur</label>
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              required
              className="form-control"
              disabled={loading}
            >
              <option value="">Sélectionner un utilisateur</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.name} {user.surname}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="form-group">
          <label>Note (0-20)</label>
          <input
            type="number"
            min="0"
            max="20"
            step="0.1"
            value={noteValue}
            onChange={(e) => setNoteValue(e.target.value)}
            required
            className="form-control"
            disabled={loading}
          />
        </div>

        <button 
          type="submit" 
          className="submit-button"
          disabled={loading}
        >
          {loading ? 'Chargement...' : editMode ? 'Modifier' : 'Ajouter'} Note
        </button>

        {editMode && (
          <button 
            type="button" 
            onClick={resetForm}
            className="cancel-button"
            disabled={loading}
          >
            Annuler
          </button>
        )}
      </form>

      <div className="notes-list">
        <h2>Liste des Notes</h2>
        
        {loading && notes.length === 0 ? (
          <p>Chargement des notes...</p>
        ) : notes.length === 0 ? (
          <p>Aucune note disponible</p>
        ) : (
          <table className="notes-table">
            <thead>
              <tr>
                {mode === 'all' && <th>Utilisateur</th>}
                <th>Note</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {notes.map(note => (
                <tr key={note.id}>
                  {mode === 'all' && (
                    <td>
                      {note.user_name || 'Inconnu'} {note.user_surname || ''}
                    </td>
                  )}
                  <td>{note.note_value}/20</td>
                  <td>{new Date(note.created_at).toLocaleDateString()}</td>
                  <td>
                    <button 
                      onClick={() => handleEdit(note)}
                      disabled={loading}
                    >
                      Modifier
                    </button>
                    <button 
                      onClick={() => handleDeleteNote(note.id)}
                      disabled={loading}
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminNoteManager;
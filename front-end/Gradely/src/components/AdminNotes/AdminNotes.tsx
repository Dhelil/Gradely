import React, { useEffect, useState } from 'react';
import './AdminNotes.css';

interface Note {
  id: number;
  note_value: number;
  created_at: string;
  updated_at: string;
  name: string;
  surname: string;
}


const AdminNotes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotes = async () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');

      if (!token || !userData) {
        setError("Vous n'êtes pas connecté.");
        setLoading(false);
        return;
      }

      try {
        const user = JSON.parse(userData);
        if (user.role !== 'admin') {
          setError("Accès refusé : vous n'êtes pas administrateur.");
          setLoading(false);
          return;
        }

        const response = await fetch('http://localhost:4000/notes', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des notes');
        }

        const data = await response.json();
        setNotes(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  if (loading) return <div className="admin-notes">Chargement...</div>;
  if (error) return <div className="admin-notes-error">{error}</div>;

  return (
    <div className="admin-notes">
      <h2>Liste de toutes les notes</h2>
      {notes.length === 0 ? (
        <p>Aucune note trouvée.</p>
      ) : (
        <table className="notes-table">
          <thead>
            <tr>
              <th>Élève</th>
              <th>Note</th>
              <th>Date d'ajout</th>
              <th>Date de modification</th>
            </tr>
          </thead>
          <tbody>
            {notes.map(note => (
              <tr key={note.id}>
                <td>{note.name} {note.surname}</td>
                <td>{note.note_value}</td>
                <td>{new Date(note.created_at).toLocaleString()}</td>
                <td>{new Date(note.updated_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminNotes;

import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import './NotesUser.css';

interface Note {
    id: string | number;
    subject: string;
    value: number;
    date?: string;
}

const NotesUser: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const [notes, setNotes] = useState<Note[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error("Authentification requise - Veuillez vous connecter");
                }

                console.log(`Fetching notes for user ${userId}...`);
                const response = await fetch(`http://localhost:4000/notes/${userId}/notes`, {
                    headers: { 
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                });

                console.log('Response status:', response.status);
                
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('Error response:', errorText);
                    throw new Error(errorText || "Erreur serveur");
                }

                const data = await response.json();
                console.log('API response data:', data);

                // Adapter les données reçues au bon format
                const receivedNotes = (Array.isArray(data) ? data : data.notes || data.data || []).map((note: any) => ({
                    id: note.id,
                    value: note.note_value,
                    subject: note.subject || "Matière inconnue",
                    date: note.created_at || null
                }));

                setNotes(receivedNotes);
                
            } catch (err) {
                console.error('Fetch error:', err);
                setError(err instanceof Error ? err.message : "Erreur inconnue");
            } finally {
                setIsLoading(false);
            }
        };

        if (userId) {
            fetchNotes();
        } else {
            setError("ID utilisateur manquant");
            setIsLoading(false);
        }
    }, [userId]);

    if (isLoading) {
        return (
            <div className="notes-loading">
                <div className="spinner"></div>
                <p>Chargement de vos notes...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="notes-error">
                <h3>Erreur</h3>
                <p>{error}</p>
                <button 
                    className="retry-button"
                    onClick={() => window.location.reload()}
                >
                    Réessayer
                </button>
            </div>
        );
    }

    return (
        <div className="notes-container">
            <h2 className="notes-header">Mes Notes</h2>
            
            {notes.length === 0 ? (
                <div className="no-notes">
                    <p>Aucune note disponible actuellement</p>
                    <small>Vos notes apparaîtront ici une fois enregistrées</small>
                </div>
            ) : (
                <div className="notes-table-container">
                    <table className="notes-table">
                        <thead>
                            <tr>
                                <th>Matière</th>
                                <th>Note</th>
                                {notes.some(n => n.date) && <th>Date</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {notes.map(note => (
                                <tr key={note.id} className="note-row">
                                    <td className="subject-cell">{note.subject}</td>
                                    <td className={`value-cell ${note.value >= 10 ? 'passing' : 'failing'}`}>
                                        {note.value}/20
                                    </td>
                                    {note.date && (
                                        <td className="date-cell">
                                            {new Date(note.date).toLocaleDateString('fr-FR', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric'
                                            })}
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default NotesUser;

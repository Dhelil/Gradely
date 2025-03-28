import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";

interface Note {
    id: string;
    subject: string;
    value: number;
}

interface ApiResponse {
    notes?: Note[];
    error?: string;
}

const NotesUser: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const [notes, setNotes] = useState<Note[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchNotes = async () => {
            if (!userId) {
                setError("Identifiant utilisateur manquant.");
                return;
            }

            const token = localStorage.getItem('token');
            if (!token) {
                setError("Vous devez être connecté.");
                return;
            }

            try {
                const response = await fetch(`http://localhost:4000/notes/${userId}/notes`, {
                    method: 'GET',
                    headers: { 
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                });

                if (!response.ok) {
                    throw new Error(`Erreur API: ${response.status}`);
                }

                const data: ApiResponse = await response.json().catch(() => ({}));

                if (!data.notes || !Array.isArray(data.notes)) {
                    throw new Error(data.error || "Format de réponse incorrect.");
                }

                setNotes(data.notes);
            } catch (err) {
                setError((err as Error).message);
            }
        };

        fetchNotes();
    }, [userId]);

    return (
        <div className="container">
            <h2 className="header">Mes Notes</h2>
            {error && <p className="error">{error}</p>}
            {notes.length > 0 ? (
                <table className="notesTable">
                    <thead>
                        <tr>
                            <th>Matière</th>
                            <th>Note</th>
                        </tr>
                    </thead>
                    <tbody>
                        {notes.map((note) => (
                            <tr key={note.id}>
                                <td>{note.subject}</td>
                                <td>{note.value}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                !error && <p>Aucune note disponible.</p>
            )}
        </div>
    );
};

export default NotesUser;
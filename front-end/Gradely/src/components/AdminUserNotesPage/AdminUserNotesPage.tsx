import React from 'react';
import { useParams } from 'react-router-dom';
import AdminNoteManager from '../AdminNoteManager/AdminNoteManager';

const AdminUserNotesPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();

  if (!userId) return <p>Aucun ID utilisateur fourni</p>;

  return (
    <div className="user-notes-page">
      <h2>Gestion des notes de l'utilisateur {userId}</h2>
      <AdminNoteManager userId={userId} />
    </div>
  );
};

export default AdminUserNotesPage;
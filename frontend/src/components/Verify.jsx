import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Verify = () => {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const { token } = useParams(); // Token von der URL
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        setLoading(true);
        // Anfrage an das Backend, um das Token zu überprüfen
        const response = await axios.post(`http://localhost:5000/api/users/verify-email`, { token });
        if (response.status === 200) {
          setStatus('E-Mail erfolgreich verifiziert!');
          setLoading(false);
          setTimeout(() => navigate('/login'), 3000); // Weiterleitung zur Login-Seite nach 3 Sekunden
        }
      } catch (error) {
        setStatus('Fehler bei der Verifizierung. Bitte versuche es später erneut.');
        setLoading(false);
      }
    };
    verifyEmail();
  }, [token, navigate]);

  if (loading) {
    return <p>Verifiziere deine E-Mail ...</p>;
  }

  return (
    <div className="verify-container">
      <h2>{status}</h2>
      <p>{status === 'E-Mail erfolgreich verifiziert!' ? 'Du wirst nun weitergeleitet.' : 'Bitte versuche es später erneut.'}</p>
    </div>
  );
};

export default Verify;

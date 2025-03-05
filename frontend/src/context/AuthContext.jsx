import { createContext, useState, useEffect, useMemo } from "react";
import { loginUser, fetchUserProfile } from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Beim ersten Laden: Prüfe, ob ein Token existiert & hole User-Daten
  useEffect(() => {
    const checkUser = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const userData = await fetchUserProfile(token);
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Fehler beim Abrufen des Profils:", err);
        setUser(null);
        setError("Sitzung abgelaufen. Bitte erneut einloggen.");
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  // Login-Funktion mit Fehlerhandling
  const login = async (username, password) => {
    try {
      setLoading(true);
      setError(null);
      const data = await loginUser(username, password);

      if (data.token) {
        localStorage.setItem("token", data.token);
        setUser(data.user);
        return { success: true, user: data.user };
      } else {
        setError("Ungültige Anmeldeinformationen.");
        return { success: false };
      }
    } catch (err) {
      console.error("Login-Fehler:", err);
      setError("Login fehlgeschlagen. Bitte überprüfe deine Daten.");
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  // Logout-Funktion mit `httpOnly` Cookie-Löschung (falls später genutzt)
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  // Optimierung: Verhindert unnötige Re-Renderings
  const authContextValue = useMemo(
    () => ({ user, login, logout, loading, error }),
    [user, loading, error]
  );

  return (
    <AuthContext.Provider value={authContextValue}>
      {loading ? <p aria-live="polite">⏳ Benutzer wird geladen...</p> : children}
      {error && <p aria-live="assertive" style={{ color: "red" }}>{error}</p>}
    </AuthContext.Provider>
  );
};

export default AuthContext;

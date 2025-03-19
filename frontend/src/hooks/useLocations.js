import { useState, useEffect, useCallback } from "react";
import { getAllLocations } from "../services/locationService";

export const useLocations = () => {
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // 🔄 **Optimierte Ladefunktion mit useCallback**
    const fetchLocations = useCallback(async () => {
        setError(null); // 🔄 Fehler zurücksetzen bei jedem neuen Abruf
        try {
            const data = await getAllLocations();
            setLocations(data || []); // Falls `null`, setze ein leeres Array
        } catch (err) {
            console.error("❌ Fehler beim Abrufen der Locations:", err);
            setError(err.message || "Unbekannter Fehler.");
        } finally {
            setLoading(false);
        }
    }, []);

    // 🎯 **Nur beim ersten Laden ausführen**
    useEffect(() => {
        fetchLocations();
    }, [fetchLocations]);

    return { locations, loading, error, reload: fetchLocations };
};

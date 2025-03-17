import { useState } from "react";
import { createLocation } from "../services/locationService";

const CreateLocationForm = ({ token }) => {
    const [formData, setFormData] = useState({
        name: "",
        street: "",
        number: "",
        zip: "",
        city: "",
        country: "Deutschland",
        category: "",
        description: "",
        accessibilityOptions: [],
    });

    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await createLocation(formData, token);
            setMessage("Location erfolgreich erstellt!");
            console.log(response);
        } catch (error) {
            setMessage("Fehler: " + error.response?.data?.message || error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 bg-gray-100 rounded shadow-md">
            <h2 className="text-xl font-semibold mb-4">Neue Location hinzufügen</h2>
            <input type="text" name="name" placeholder="Name der Location" value={formData.name} onChange={handleChange} required className="w-full p-2 mb-2 border rounded" />
            <input type="text" name="street" placeholder="Straße" value={formData.street} onChange={handleChange} required className="w-full p-2 mb-2 border rounded" />
            <input type="text" name="number" placeholder="Hausnummer" value={formData.number} onChange={handleChange} required className="w-full p-2 mb-2 border rounded" />
            <input type="text" name="zip" placeholder="PLZ" value={formData.zip} onChange={handleChange} required className="w-full p-2 mb-2 border rounded" />
            <input type="text" name="city" placeholder="Stadt" value={formData.city} onChange={handleChange} required className="w-full p-2 mb-2 border rounded" />
            <input type="text" name="country" placeholder="Land" value={formData.country} onChange={handleChange} required className="w-full p-2 mb-2 border rounded" />
            <select name="category" value={formData.category} onChange={handleChange} required className="w-full p-2 mb-2 border rounded">
                <option value="">Kategorie auswählen</option>
                <option value="Café">Café</option>
                <option value="Restaurant">Restaurant</option>
                <option value="Theater">Theater</option>
                <option value="Museum">Museum</option>
                <option value="Veranstaltungsort">Veranstaltungsort</option>
                <option value="Andere">Andere</option>
            </select>
            <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">Location erstellen</button>
            {message && <p className="mt-2 text-red-500">{message}</p>}
        </form>
    );
};

export default CreateLocationForm;

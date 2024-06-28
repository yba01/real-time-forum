import { fetchAuth } from "./auth.js";

export const fetchLogout = (url) => {
    fetch(url, {
        method: 'POST', // Définir la méthode de la requête comme POST
    })
        .then(response => {
            if (!response.ok) {
                Redirect("/error")
            }
            if (response.status == 200) {
                fetchAuth('auth')
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}
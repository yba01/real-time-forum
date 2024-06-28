import { Redirect, port } from "./index.js";
import { Error } from "./error.js";
export const fetchRegister = (url) => {
    const formData = new FormData(document.getElementById(url));
    fetch(url, {
        method: 'POST', // Définir la méthode de la requête comme POST
        body: formData
    })
        .then(response => {
            if (!response.ok) {
                Redirect("/error")
            }
            if (response.status == 206) {
                Redirect('/register')
            }
            if (response.status == 200) {
                Redirect('/')
            }
            return response.json();
        })
        .then(data => {
            if (data.Error) {
                Error(data)
                return
            }
            if (data.BadCri) {
                alert("Please check username and password criteria")
            }
            if (data.Unreg) {
                alert("User or Email already taken, please try again")
            }
            if (data.BadEmail) {
                alert("Enter a valid email");
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });

}
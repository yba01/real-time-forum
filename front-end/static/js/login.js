import { fetchForum } from "./forum.js";
import { Redirect, port, routes } from "./index.js";
import { forumHtml } from "./views.js";
import { Error } from "./error.js";

export const fetchLogin = (url) => {
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
                Redirect('/')
            }
            if (response.status == 200) {
                routes['/'] = forumHtml
                Redirect('/')
                fetchForum('forum')
            }
            return response.json();
        })
        .then(data => {
            if (data.Error) {
                Error(data)
                return
            }
            if (data.BadLog) {
                alert("check username and password")
                return
            }

        })
        .catch(error => {
            console.error('Error:', error);
        });

}
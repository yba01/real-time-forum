import { fetchForum } from "./forum.js";
import { Redirect, routes } from "./index.js"
import { forumHtml, loginHtml } from "./views.js"; 
import { Error } from "./error.js";
let allPost = document.getElementById("allposts")
export const fetchAuth = (url) => {
    fetch(url, {
        method: 'POST' // ou 'POST' selon votre cas
    })
        .then(response => {
            if (!response.ok) {
                Redirect("/error")
            }
            return response.json()
        })
        .then(data => {
            if (data.Error) {
                Error()
                return
            }
            if (data.NoAuth) {
                let newPost = document.getElementById('createNewpost')
                if (newPost) {
                    newPost.style.display = 'none'
                }
                routes['/'] = loginHtml
                Redirect("/")
                return
            }
            if (data.Token) {
                if (!allPost) {
                    routes['/'] = forumHtml
                    Redirect('/')
                    fetchForum('forum')
                } else {
                    routes['/'] = forumHtml
                    Redirect('/')
                    fetchForum('forum')
                }
            }
        })
}
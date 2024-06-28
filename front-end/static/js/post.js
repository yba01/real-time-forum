import { fetchForum } from "./forum.js";
import { Redirect, port, routes } from "./index.js";
import { forumHtml } from "./views.js";
import { Error } from "./error.js";
export const fetchPost = (url) => {
    fetch(url, {
        method: 'POST'
    })
        .then(response => {
            if (!response.ok) {
                Redirect("/error")
            }
            return response.json();
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
            displayFormCategories(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });

}

function displayFormCategories(categories) {
    let postform = document.getElementById('postSubmit')
    let htmlCategories = document.getElementById('categories')
    let thePost = document.getElementById('postContainer')

    if (postform.style.display != 'flex') {
        postform.style.animation = 'fadeIn 1s forwards'
        postform.style.display = 'flex'
        for (let key in categories) {
            let newLabel = document.createElement('label')
            newLabel.className = "categoryContain"
            newLabel.innerHTML = `
            <p>${categories[key]}</p>
            <input type="checkbox" name="category" value="${key.toString()}">
            <svg viewBox="0 0 64 64" height="2em" width="2em">
              <path d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16" pathLength="575.0541381835938" class="path"></path>
            </svg>
            `
            htmlCategories.appendChild(newLabel)
        }
    } else {
        postform.style.animation = 'fadeOut 1s backwards'
        setTimeout(() => {
            postform.style.display = 'none'
            htmlCategories.innerHTML = ''
        }, 1000);
    }

}

export const fetchPostSubmit = (url) => {
    const formData = new FormData(document.getElementById(url));
    fetch(url, {
        method: 'POST', // Définir la méthode de la requête comme POST
        body: formData
    })
        .then(response => {
            if (!response.ok) {
                Redirect("/error")
            }

            if (response.status == 200) {
                let postform = document.getElementById('postSubmit')
                postform.style.display = 'none'
                routes['/'] = forumHtml
                Redirect('/')
                fetchForum('forum')
            }
        })
        .then(data =>{
            if (data.Error) {
                Error(data)
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
        })
        .catch(error => {
            console.error('Error:', error);
        });

}

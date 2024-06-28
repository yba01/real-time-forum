import { Redirect, port } from "./index.js";
import { Error } from "./error.js";
export const fetchLikeAndDislike = (url) => {
    fetch(url, {
        method: 'POST'
    })
        .then(response => {
            if (!response.ok) {
                Redirect("/error")
            }
            if (response.status == 206) {
                Redirect('/')
            }
            if (response.status == 200) {
                return response.json()
            }

        })
        .then(data => {
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
            if (url.startsWith('reactioncom')) {
                updateReactionCom(data)
            } else {
                updateReaction(data);
            }
            return
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function updateReaction(data) {
    let htmlLike = document.getElementById(`likes${data.Post_id}`)
    let htmlDislike = document.getElementById(`dislikes${data.Post_id}`)

    htmlLike.textContent = data.Likes
    htmlDislike.textContent = data.Dislikes
}

function updateReactionCom(data) {
    let htmlLike = document.getElementById(`comlikes${data.Com_id}`)
    let htmlDislike = document.getElementById(`comdislikes${data.Com_id}`)

    htmlLike.textContent = `${data.Like}`
    htmlDislike.textContent = `${data.Dislike}`
}
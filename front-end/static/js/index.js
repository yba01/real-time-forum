import { loginHtml, registerHtml, forumHtml } from "./views.js"
import { fetchLogin } from "./login.js";
import { fetchRegister } from "./register.js";
import { errorHtml, fetchUrl } from "./error.js";
import { fetchAuth } from "./auth.js";
import { fetchPostSubmit, fetchPost } from "./post.js";
import { fetchComment, showComs } from "./comment.js";
import { fetchLikeAndDislike } from "./likeAndDislike.js";
import { fetchForum } from "./forum.js";
import { fetchLogout } from "./logout.js";
import { openChatRoom } from "./webSocket.js";
export let Fetched = false, port = ":8081/"
let logout = document.getElementById("logout")
let home = document.getElementById("home")
const route = (event) => {
    event = event || window.event;
    event.preventDefault();
    window.history.pushState({}, "", event.target.href);
    handleLocation();
};



export let routes = {
    "/": loginHtml,
    "/error": errorHtml,
    "/register": registerHtml,
    "/forum": forumHtml
}

// update the path into url and fetch html corresponding contains in the div
const handleLocation = async () => {
    const path = window.location.pathname;
    if ((path == '/' || path == '/forum') && !Fetched) {
        Fetched = true
        fetchAuth('auth')
        return
    }
    let route = routes[path]
    if (!route) {
        fetchUrl(path)// handle the error url
        return
    }
    const html = route;
    document.getElementById("contain").innerHTML = html

};

//window.onpopstate = handleLocation;
window.route = route;

handleLocation();

// this func change the url state and call handleLocation that going to fetch html corresponding contains in the div
export const Redirect = (url) => {
    window.history.pushState({}, "", url)
    handleLocation()
}
// if submit button you check if the form is for login or for register and we handle the form

document.addEventListener("submit", (event) => {
    Fetched = true
    event.preventDefault();
    const form = event.target.closest('form');
    const url = form.id
    switch (url) {
        case "loginAuth":
            fetchLogin(url)
            break;
        case "registerAuth":
            fetchRegister(url)
            break;
        case "postSubmit":
            fetchPostSubmit('postSubmit')
            break
        case "post":
            fetchPost("post")
            break
    }
    if (url.startsWith('comment')) {
        fetchComment(url)
    }
    if (url.startsWith('reaction')) {
        fetchLikeAndDislike(url)
    }
    if (url.startsWith('forumfilter')) {
        routes["/"] = forumHtml
        Redirect('/')
        fetchForum(url)
    }
    if (url.startsWith('showComs')) {
        showComs(url)
    }
    if (url.startsWith('ws')) {
        openChatRoom(url)
    }
})


home.addEventListener('click', () => {
    if (!document.getElementById("loginAuth")
        && !document.getElementById("registerAuth")
        && !document.getElementById('code')) {
        fetchAuth("auth")// check if the user is authenticated
    }
})


logout.addEventListener('click', () => {
    fetchLogout('logout')
})

setInterval(() => {
    fetchAuth('auth')
}, 5400000)













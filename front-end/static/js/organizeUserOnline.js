import { displayForum } from "./forum.js"
import { Redirect, routes } from "./index.js";
import { forumHtml, loginHtml } from "./views.js";
import { Error } from "./error.js";
export const OrganizeOnlineUser = (sender) => {

    fetch("forum", {
        method: 'POST'
    })
        .then(response => {
            if (!response.ok) {
                Redirect("/error")
            }
            return response.json()
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
            ordered(data.AllUsers, sender)
        })
        .catch(error => {
            console.error('Error:', error);
        });

}

const ordered = (data, sender) => {
    let forms = document.querySelectorAll(".usersOnlineForm")
    let obj = {}
    let obj2 = {}
    if (forms) {
        forms.forEach((form, i) => {
            let user = data[i]
            let formUser
            form.id = `ws${user}`

            let button = form.querySelector(".btn")
            if (button) {
                button.id = `wsStatus${user}`
                let Notif = button.querySelector(".notification")
                formUser = Notif.id.slice(5)
                let dis = Notif.style.display
                if (button.classList.contains("activeUsers")) {
                    button.classList.remove("activeUsers")
                    obj2[formUser] = 'activeUsers'
                }
                if (formUser != sender) {
                    obj[formUser] = dis
                }
                button.textContent = user
                Notif.id = `notif${user}`
                button.appendChild(Notif)
            }

            let bublle = form.querySelector(`#type${formUser}`)
            if (bublle) {
                bublle.id = `type${user}`
            }






        });

    }
    let pnotif = document.querySelectorAll(".notification")
    for (const [key, value] of Object.entries(obj)) {
        let pnotif = document.getElementById(`notif${key}`)
        pnotif.style.display = value
    }
    for (const [key, value] of Object.entries(obj2)) {
        let butt = document.getElementById(`wsStatus${key}`)
        butt.classList.remove("unactiveUsers")
        butt.classList.add(value)
    }
}
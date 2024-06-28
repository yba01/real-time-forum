import { Redirect, routes } from "./index.js"
import { fetchForum } from "./forum.js";
import { forumHtml } from "./views.js";
export const
    errorHtml = `<h1 id="code"></h1><button id="error" class="btn">Back To Home</button>
    `,

    fetchUrl = (url) => {

        fetch("url", {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain'
            },
            body: `${url}`
        })
            .then(response => {
                console.log(response);
                if (!response.ok) {
                    Redirect("/error")
                }
                return response.json()
            })
            .then(data => {
                console.log(data);
                if (data.Error) {
                    Error(data)
                    return
                }
            })
    },
    Error = (data) => {
        let codeTag = document.getElementById("code")
        let error = document.getElementById("error")
        codeTag.textContent = `Error ${data.Code} - ${data.Mess}`
        error.addEventListener('click', () => {
            routes["/"] = forumHtml
            Redirect('/')
        })
    }



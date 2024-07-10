import { InsertAllcomments } from "./comment.js";
import { debounce, loadMoreMessages } from "./discuss.js";
import { createWebsocket } from "./webSocket.js";
import { Error } from "./error.js";
export const fetchForum = (url) => {
    fetch(url, {
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
            let user = document.getElementById("user")
            user.textContent = data.Username
            displayForum(data)
            createWebsocket()
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

export function displayForum(fullData) {
    let Allposts = document.getElementById('allposts')
    let newPost = document.getElementById('createNewpost')
    newPost.style.display = "flex"
    if (fullData.Allposts) {
        for (let allPosts of fullData.Allposts) {
            let aPost = document.createElement('div')
            aPost.classList = 'post'
            aPost.id = `post${allPosts.Post_id}`
            aPost.style.height = '400px'
            aPost.innerHTML = `
                <div class="user">
                <div class="avatar">
                    <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    
                    <g id="SVGRepo_bgCarrier" stroke-width="0"/>
                    
                    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
                    
                    <g id="SVGRepo_iconCarrier"> <circle cx="12" cy="9" r="3" stroke="#ffffff" stroke-width="1.5"/> <path d="M17.9691 20C17.81 17.1085 16.9247 15 11.9999 15C7.07521 15 6.18991 17.1085 6.03076 20" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"/> <path d="M7 3.33782C8.47087 2.48697 10.1786 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 10.1786 2.48697 8.47087 3.33782 7" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"/> </g>
                    
                    </svg>
                    <p> ${allPosts.User} </p>
                </div>
                <div class="postTitle">
                    <h3> ${allPosts.Title} </h3>
                </div>
                <div class="message">
                    <p> ${allPosts.Message} </p>
                </div>
                <div id="reactAndCom">
                <form id="reaction?id=${allPosts.Post_id}&action=like" method="post">
                    <button type="submit" name="action" value="like">
                        <svg width="40px" height="40px" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
    
                        <g id="SVGRepo_bgCarrier" stroke-width="0"/>
                        
                        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
                        
                        <g id="SVGRepo_iconCarrier"> <path d="M8.9707 19.42V13.89" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path d="M2.28234 12.67C2.25751 12.2167 2.32536 11.7631 2.48175 11.3369C2.63813 10.9106 2.87975 10.5208 3.19187 10.1911C3.504 9.86141 3.88006 9.59877 4.29708 9.41931C4.71411 9.23985 5.16335 9.14734 5.61735 9.14734C6.07135 9.14734 6.52058 9.23985 6.9376 9.41931C7.35463 9.59877 7.73069 9.86141 8.04281 10.1911C8.35493 10.5208 8.59657 10.9106 8.75296 11.3369C8.90934 11.7631 8.97717 12.2167 8.95234 12.67V18.3C8.97717 18.7533 8.90934 19.207 8.75296 19.6332C8.59657 20.0594 8.35493 20.4492 8.04281 20.7789C7.73069 21.1086 7.35463 21.3712 6.9376 21.5507C6.52058 21.7301 6.07135 21.8227 5.61735 21.8227C5.16335 21.8227 4.71411 21.7301 4.29708 21.5507C3.88006 21.3712 3.504 21.1086 3.19187 20.7789C2.87975 20.4492 2.63813 20.0594 2.48175 19.6332C2.32536 19.207 2.25751 18.7533 2.28234 18.3V12.67Z" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path d="M8.97076 18.3C8.96813 18.7399 9.05217 19.176 9.21809 19.5835C9.38402 19.9909 9.62857 20.3617 9.93779 20.6747C10.247 20.9876 10.6148 21.2366 11.0203 21.4073C11.4257 21.5781 11.8608 21.6674 12.3008 21.67H16.4208C17.3814 21.6693 18.316 21.357 19.0841 20.78C19.8522 20.203 20.4125 19.3924 20.6808 18.47L22.1808 13.39C22.3002 13.0523 22.3372 12.691 22.2889 12.3361C22.2405 11.9812 22.1081 11.643 21.9028 11.3496C21.6974 11.0562 21.4249 10.816 21.108 10.6491C20.7911 10.4822 20.4389 10.3934 20.0808 10.39H14.5608V5.10999C14.5621 4.91825 14.5256 4.72818 14.4535 4.55054C14.3813 4.3729 14.2749 4.21121 14.1402 4.07471C14.0056 3.9382 13.8454 3.82953 13.6687 3.75494C13.4921 3.68036 13.3025 3.64132 13.1108 3.64001V3.64001C12.7953 3.64144 12.4889 3.74572 12.2381 3.93701C11.9872 4.1283 11.8056 4.39617 11.7208 4.70001L8.97076 13.86" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </g>
                        
                        </svg>
                        <p value id="likes${allPosts.Post_id}">${allPosts.Likes}</p>
                    </button>
                </form>
                <form id="reaction?id=${allPosts.Post_id}&action=dislike" method="post">
                    <button type="submit" name="action" value="dislike">
                        <svg width="40px" height="40px" viewBox="-0.5 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
    
                        <g id="SVGRepo_bgCarrier" stroke-width="0"/>
                        
                        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
                        
                        <g id="SVGRepo_iconCarrier"> <path d="M8.66992 5.5V11.03" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path d="M8.66992 11.03L11.4199 20.19C11.5048 20.4938 11.6864 20.7617 11.9372 20.953C12.1881 21.1443 12.4944 21.2486 12.8099 21.25V21.25C13.0016 21.2487 13.1912 21.2097 13.3679 21.1351C13.5445 21.0605 13.7047 20.9518 13.8394 20.8153C13.974 20.6788 14.0805 20.5171 14.1526 20.3395C14.2248 20.1618 14.2612 19.9718 14.2599 19.78V14.5" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path d="M2.00109 12.25C1.97626 12.7033 2.04411 13.157 2.2005 13.5832C2.35688 14.0094 2.59852 14.3993 2.91064 14.7289C3.22276 15.0586 3.59881 15.3212 4.01583 15.5007C4.43286 15.6801 4.88209 15.7727 5.33609 15.7727C5.79008 15.7727 6.23931 15.6801 6.65634 15.5007C7.07336 15.3212 7.44944 15.0586 7.76156 14.7289C8.07368 14.3993 8.31532 14.0094 8.47171 13.5832C8.62809 13.157 8.69594 12.7033 8.67111 12.25V6.62C8.69594 6.16668 8.62809 5.71308 8.47171 5.28687C8.31532 4.86065 8.07368 4.47074 7.76156 4.14105C7.44944 3.81136 7.07336 3.54878 6.65634 3.36932C6.23931 3.18986 5.79008 3.09729 5.33609 3.09729C4.88209 3.09729 4.43286 3.18986 4.01583 3.36932C3.59881 3.54878 3.22276 3.81136 2.91064 4.14105C2.59852 4.47074 2.35688 4.86065 2.2005 5.28687C2.04411 5.71308 1.97626 6.16668 2.00109 6.62V12.25Z" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path d="M8.66998 6.62C8.66735 6.18006 8.75137 5.74394 8.9173 5.33649C9.08322 4.92904 9.32777 4.55824 9.63699 4.2453C9.94621 3.93237 10.314 3.68341 10.7195 3.51263C11.1249 3.34186 11.56 3.25262 12 3.25H16.12C17.0806 3.25072 18.0152 3.56303 18.7833 4.14001C19.5514 4.717 20.1117 5.52755 20.38 6.45001L21.88 11.53C21.9994 11.8677 22.0365 12.229 21.9881 12.5839C21.9397 12.9387 21.8074 13.277 21.602 13.5704C21.3966 13.8638 21.1241 14.104 20.8072 14.2709C20.4903 14.4378 20.1381 14.5266 19.78 14.53H14.28" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </g>
                        
                        </svg>
                        <p id="dislikes${allPosts.Post_id}">${allPosts.Dislikes}</p>
                    </button>
                </form>
                <form id="showComs${allPosts.Post_id}">
                    <button name="showComs" type="submit">
                    <svg fill="#ffffff" width="40px" height="30px" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
    
                    <g id="SVGRepo_bgCarrier" stroke-width="0"/>
                    
                    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
                    
                    <g id="SVGRepo_iconCarrier">
                    
                    <path d="M648.533 320c0-140.8-140.8-256-311.467-256S25.599 179.2 25.599 320c0 98.133 64 183.467 166.4 226.133-4.267 34.133-25.6 64-55.467 85.333-8.533 4.267-12.8 21.333-8.533 29.867l8.533 8.533c25.6 12.8 51.2 21.333 81.067 21.333 72.533 0 136.533-46.933 153.6-115.2 153.6-17.067 277.333-128 277.333-256zM349.867 529.067c-4.267 0-8.533 0-12.8 4.267s-8.533 8.533-8.533 17.067c-8.533 55.467-55.467 98.133-115.2 98.133-8.533 0-21.333 0-29.867-4.267C213.334 614.4 230.4 576 230.4 533.334c0-8.533-4.267-17.067-12.8-21.333l-4.267-4.267C123.733 469.334 64 396.801 64 320.001c0-115.2 119.467-213.333 268.8-213.333s268.8 93.867 268.8 213.333c4.267 110.933-106.667 200.533-251.733 209.067z"/>
                    
                    <path d="M998.4 593.067c0-123.733-115.2-234.667-268.8-251.733-12.8 0-21.333 8.533-25.6 17.067 0 12.8 8.533 21.333 17.067 25.6 132.267 12.8 230.4 102.4 230.4 209.067 0 81.067-55.467 153.6-149.333 187.733h-4.267c-8.533 4.267-12.8 12.8-12.8 21.333 0 38.4 12.8 76.8 42.667 106.667-12.8 4.267-21.333 4.267-34.133 4.267-55.467 0-102.4-38.4-110.933-93.867 0-8.533-8.533-12.8-12.8-17.067-4.267 0-4.267-4.267-8.533-4.267-119.467-4.267-217.6-72.533-243.2-162.133-4.267-12.8-17.067-17.067-25.6-12.8-12.8 4.267-17.067 17.067-12.8 25.6 29.867 102.4 140.8 179.2 268.8 192 17.067 68.267 76.8 115.2 149.333 115.2 25.6 0 51.2-8.533 72.533-17.067h8.533c8.533 0 12.8-4.267 17.067-8.533 4.267-8.533 4.267-21.333-8.533-29.867-29.867-17.067-51.2-46.933-55.467-85.333 98.133-42.667 166.4-132.267 166.4-221.867z"/>
                    
                    </g>
                    
                    </svg>
                    <p>Comments</p>
                    </button>
                </form>
                </div>
                </div>
                <div class="responses" id="response${allPosts.Post_id}">
                <form class="commentInsert" id="comment?id=${allPosts.Post_id}" method="post">
                    <textarea name="commentary" placeholder="Insert a Comment" required></textarea>
                    <button name="postComment" type="submit">
                        <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    
                        <g id="SVGRepo_bgCarrier" stroke-width="0"/>
                        
                        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
                        
                        <g id="SVGRepo_iconCarrier"> <path d="M11.5003 12H5.41872M5.24634 12.7972L4.24158 15.7986C3.69128 17.4424 3.41613 18.2643 3.61359 18.7704C3.78506 19.21 4.15335 19.5432 4.6078 19.6701C5.13111 19.8161 5.92151 19.4604 7.50231 18.7491L17.6367 14.1886C19.1797 13.4942 19.9512 13.1471 20.1896 12.6648C20.3968 12.2458 20.3968 11.7541 20.1896 11.3351C19.9512 10.8529 19.1797 10.5057 17.6367 9.81135L7.48483 5.24303C5.90879 4.53382 5.12078 4.17921 4.59799 4.32468C4.14397 4.45101 3.77572 4.78336 3.60365 5.22209C3.40551 5.72728 3.67772 6.54741 4.22215 8.18767L5.24829 11.2793C5.34179 11.561 5.38855 11.7019 5.407 11.8459C5.42338 11.9738 5.42321 12.1032 5.40651 12.231C5.38768 12.375 5.34057 12.5157 5.24634 12.7972Z" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/> </g>
                        
                        </svg>
                    </button>
                </form>
                <div class="comments">
                </div>
                </div>
            `
            aPost.appendChild(InsertAllcomments(allPosts.Comments, allPosts.Post_id))
            Allposts.appendChild(aPost)
        }
    } else {
        Allposts.textContent = fullData.ErrorString
    }

    InsertUsers(fullData)
}

export function InsertUsers(data) {
    if (data.AllUsers) {
        for (let user of data.AllUsers) {

            //Create chatroom for user connect specifically to her name
            let chatRoom = document.getElementById('chatOpened')
            let outChatroom = document.createElement('div')
            let last = document.getElementById('WsMessageSend')
            outChatroom.id = `WsChatroom${user}`
            outChatroom.style.display = 'none'
            outChatroom.classList = 'WsChatroom'
            chatRoom.insertBefore(outChatroom, last)

            //create button online users
            let allChatRoomDiv = document.getElementById('onlineUsers')
            let allUsers = document.createElement('div')
            allChatRoomDiv.appendChild(allUsers)
            let form = document.createElement('form');
            form.className = 'usersOnlineForm'
            form.id = `ws${user}`;
            let button = document.createElement('button');
            let notif = document.createElement('p')
            notif.id = `notif${user}`
            notif.innerHTML = `
                <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g id="SVGRepo_bgCarrier" stroke-width="0"/>
                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
                <g id="SVGRepo_iconCarrier"> <path d="M20 6.75C21.5188 6.75 22.75 5.51878 22.75 4C22.75 2.48122 21.5188 1.25 20 1.25C18.4812 1.25 17.25 2.48122 17.25 4C17.25 5.51878 18.4812 6.75 20 6.75Z" fill="#ffffff"/> <path d="M19.04 8.15C17.47 7.81 16.19 6.53 15.85 4.96C15.72 4.35 15.71 3.76 15.82 3.2C15.95 2.58 15.49 2 14.85 2H7C4.24 2 2 4.24 2 7V13.95C2 16.71 4.24 18.95 7 18.95H8.5C8.78 18.95 9.14 19.13 9.3 19.35L10.8 21.34C11.46 22.22 12.54 22.22 13.2 21.34L14.7 19.35C14.89 19.1 15.18 18.95 15.5 18.95H17.01C19.77 18.95 22 16.72 22 13.96V9.15C22 8.52 21.42 8.06 20.8 8.18C20.24 8.28 19.65 8.28 19.04 8.15ZM8 12C7.44 12 7 11.55 7 11C7 10.45 7.44 10 8 10C8.55 10 9 10.45 9 11C9 11.55 8.56 12 8 12ZM12 12C11.44 12 11 11.55 11 11C11 10.45 11.44 10 12 10C12.55 10 13 10.45 13 11C13 11.55 12.56 12 12 12ZM16 12C15.44 12 15 11.55 15 11C15 10.45 15.44 10 16 10C16.55 10 17 10.45 17 11C17 11.55 16.56 12 16 12Z" fill="#ffffff"/> </g>
                </svg>
            `
            notif.className = 'notification'
            button.type = 'submit';
            button.className = 'btn';
            button.textContent = user;
            button.id = `wsStatus${user}`
            button.style.display = 'flex'
            notif.style.display = 'none'

            button.appendChild(notif)


            //create a div for typing progress for all userConnect
            let divType = document.createElement("div")
            divType.classList = 'chat-bubble';
            divType.id = `type${user}`
            divType.innerHTML = `<div class="typing">
                                 <div class="anime"></div>
                                     <div class="anime"></div>
                                     <div class="anime"></div>
                                         </div>`

            //Appending                            
            form.appendChild(button)
            form.appendChild(divType)

            allChatRoomDiv.appendChild(form)
            outChatroom.addEventListener('scroll', debounce(function () {
                if (outChatroom.scrollTop === 0) {
                    loadMoreMessages();
                }
            }, 500));
        }


    }
}



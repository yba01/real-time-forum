
export
    const loginHtml = `<div class="box form-box" id="login">
<form  method="post" id="loginAuth">
    <div class="field input">
        <label for="username">Username or Email</label>
        <input type="text" name="username" id="username" >
    </div>

    <div class="field input">
        <label for="password">Password</label>
        <input type="password" name="password" id="password" >
    </div>

    <div class="field">
        <input type="submit" class="btn" name="submit" value="Login" >
    </div>
    <div class="links">
        Don't have account? <a href="/register" onclick="route()">Register Now</a>
    </div>
</form>
</div>`

    , registerHtml = `<div class="box form-box">
    <header>Register</header>
    <div>
        <ul>
            <li>usernames must contain only letters or numbers</li>
            <li>usernames must be longer than 4 characters but shorter than 51</li>
            <li>passwords must contain a uppercase letter, lowercase letter, number, and special character</li>
            <li>passwords must be greater than 11 characters but less than 60</li>
        </ul>
    </div><br>
    <form method="post" id="registerAuth">
        <div class="field input">
            <label for="username">Nickname</label>
            <input type="text" name="username" id="username" autocomplete="off" required>
        </div>

        <div class="field input">
            <label for="age">Age</label>
            <input type="number" name="age" id="age" min="12", max="100" required>
        </div>
        <fieldset>
        <legend>Gender</legend>
        <div class="radio">
            <input type="radio" name="gender" value="male" id="male" checked required>
            <label for="male">Male</label>
            <input type="radio" name="gender" value="female" id="female" autocomplete="off" required>
            <label for="female">Female</label>
         </div>
         </fieldset><br>

        <div class="field input">
            <label for="firstname">Firt Name</label>
            <input type="text" name="firstname" id="firstname" autocomplete="off" required>
        </div>

        <div class="field input">
            <label for="lastname">Last Name</label>
            <input type="text" name="lastname" id="lastname" autocomplete="off" required>
        </div>

        <div class="field input">
            <label for="email">Email</label>
            <input type="email" name="email" id="email" autocomplete="off" placeholder="my_email@gmail.com" required>
        </div>

        <div class="field input">
            <label for="password">Password</label>
            <input type="password" name="password" id="password" autocomplete="off" required>
        </div>

        <div class="field">

            <input type="submit" class="btn" name="submit" value="Register" required>
        </div>
        <div class="links">
            Already a member? <a href="/" onclick="route()">Log In</a>
        </div>
    </form>
</div>`
    , forumHtml = `
    <div class="postContainer" id="postContainer">
    <div class="filters">
        <div class="posts-title">
            Language web
        </div>
        <hr>
        <hr>
        <div class="theFilters" style="margin-top: 10px;">
            <div id="list">
                <form id="forumfilter?id=LikedPost">
                    <button class="btn" type="submit">LikedPost</button>
                </form>
                <form id="forumfilter?id=createdpost">
                    <button class="btn" type="submit">createdpost</button>
                </form>
                <form id="forumfilter?id=HTML\\CSS">
                    <button class="btn" type="submit" name="HTML\\CSS">HTML\\CSS</button>
                </form>
                <form id="forumfilter?id=Python">
                    <button class="btn" type="submit">Python</button>
                </form>
                <form id="forumfilter?id=C">
                    <button class="btn" type="submit">C</button>
                </form>
                <form id="forumfilter?id=JavaScript">
                    <button class="btn" type="submit">JavaScript</button>
                </form>
                <form id="forumfilter?id=Go">
                    <button class="btn" type="submit">Go</button>
                </form>
                <form id="forumfilter?id=PHP">
                    <button class="btn" type="submit">PHP</button>
                </form>
            </div>
        </div>
    </div>
    <div id="allposts">
    </div>
    <div class="onlineUsers" id="onlineUsers">
    </div>
    <div id="chatOpened">
        <div class="avatar" id = "topAvatar">
            <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">

                <g id="SVGRepo_bgCarrier" stroke-width="0"/>
                
                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
                
                <g id="SVGRepo_iconCarrier"> <circle cx="12" cy="9" r="3" stroke="#ffffff" stroke-width="1.5"/> <path d="M17.9691 20C17.81 17.1085 16.9247 15 11.9999 15C7.07521 15 6.18991 17.1085 6.03076 20" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"/> <path d="M7 3.33782C8.47087 2.48697 10.1786 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 10.1786 2.48697 8.47087 3.33782 7" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"/> </g>
                
            </svg>
            <p id="WsUserMessage"></p>
        </div>
        <div id="WsMessageSend">
            <input type="text" id="messageInput" placeholder="send a message">
            <button id="sendButton">
                <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">

                        <g id="SVGRepo_bgCarrier" stroke-width="0"/>
                        
                        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
                        
                        <g id="SVGRepo_iconCarrier"> <path d="M11.5003 12H5.41872M5.24634 12.7972L4.24158 15.7986C3.69128 17.4424 3.41613 18.2643 3.61359 18.7704C3.78506 19.21 4.15335 19.5432 4.6078 19.6701C5.13111 19.8161 5.92151 19.4604 7.50231 18.7491L17.6367 14.1886C19.1797 13.4942 19.9512 13.1471 20.1896 12.6648C20.3968 12.2458 20.3968 11.7541 20.1896 11.3351C19.9512 10.8529 19.1797 10.5057 17.6367 9.81135L7.48483 5.24303C5.90879 4.53382 5.12078 4.17921 4.59799 4.32468C4.14397 4.45101 3.77572 4.78336 3.60365 5.22209C3.40551 5.72728 3.67772 6.54741 4.22215 8.18767L5.24829 11.2793C5.34179 11.561 5.38855 11.7019 5.407 11.8459C5.42338 11.9738 5.42321 12.1032 5.40651 12.231C5.38768 12.375 5.34057 12.5157 5.24634 12.7972Z" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/> </g>
                </svg>
            </button>
        </div>
        <div id="loading">
            <img src="https://upload.wikimedia.org/wikipedia/commons/a/ad/YouTube_loading_symbol_3_%28transparent%29.gif">
        </div>
    </div>
    </div>
    <form method="post" id="postSubmit" class="fade">
        <div class="Posttitle">
            <p>your title: </p>
            <input type="text" name="subject" required>
        </div>
        <div class="Postmessage">
            <p>your post: </p>
            <textarea name="Thepost" required></textarea>
        </div>
        <div class="categories" id="categories">
        </div>
        <input class="btn" type="submit" value="Post">
    </form>
    `
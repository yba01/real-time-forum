package internal

import (
	"database/sql"
	"net/http"
	"strings"

	"golang.org/x/crypto/bcrypt"
)

func LoginAuth(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Redirect(w, r, "/Error", code303)
		return
	}

	nameInput := strings.ToLower(r.FormValue("username"))
	paswdInput := r.FormValue("password")

	if nameInput == "" || paswdInput == "" {
		Error400(w)
		return
	}

	paswdhash, err1 := getPaswd(nameInput)

	if err1 != sql.ErrNoRows && err1 != nil { // assure us that there are no errors in the database
		Error500(w)
		return
	}

	err2 := bcrypt.CompareHashAndPassword([]byte(paswdhash), []byte(paswdInput))

	if err2 != nil || err1 == sql.ErrNoRows {
		api := ApiLogin{
			BadLog: true,
		}
		sendFront(w, api, code206)
		//	ExeTemp(w, "login.html", data{ErrorAlert: "BadLog"})
		return
	}
	user, err := getUserFromDB(nameInput)

	if err != nil {
		Error500(w)
		return
	}
	u := ApiLogin{
		Username: user.Username,
		Email:    user.Email,
	}
	//--------------------------user is connected------------------------------------------------------//
	c, _ := r.Cookie("session_token")

	if c != nil {
		SessionID := c.Value
		if IsSessionExit(user, SessionID) {
			sendFront(w, u, code200)
			return
		}
		DeleteSession(SessionID) // optional
	}

	// ExeTemp(w, "login.html", data{ErrorAlert: "SessExist2"})

	DeleteSession2(user.ID)
	// create a session token
	err3 := SessionStart(user, w) // start the session
	if err3 != nil {
		Error500(w)
		return
	}
	err = sendFront(w, u, code200)
	if err != nil {
		return
	}

}

func getPaswd(nameInput string) (string, error) {
	var row *sql.Row
	if CheckEmail(nameInput) {
		row = DB.QueryRow("SELECT password FROM users WHERE email = ?", nameInput)
	} else {
		row = DB.QueryRow("SELECT password FROM users WHERE username = ?", nameInput)
	}
	var paswdhash string
	err := row.Scan(&paswdhash)

	if err != nil {
		return "", err
	}
	return paswdhash, err //sqlError && nil
}

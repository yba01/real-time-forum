package internal

import "net/http"

func Logout(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Redirect(w, r, "/Error", code303)
		return
	}
	_, Session, err1 := Authenticated(w, r)
	if err1 != nil {
		Error500(w)
		return
	}
	c, err := r.Cookie("session_token")
	if err != nil {
		Error500(w)
		return
	}
	sessionID := c.Value
	//set a new cookie for same name and value in order to delete it with maxAge = -1
	DelCookie(w)
	if e := DeleteSession(sessionID); e != nil {
		Error500(w)
		return
	}
	IamDisConnected(Session.Username)

}

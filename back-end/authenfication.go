package internal

import (
	"net/http"
)

func Auth(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Redirect(w, r, "/Error", code303)
		return
	}
	c, sess, err := Authenticated(w, r)

	if c == nil || err != nil {
		return
	}
	sessionID := c.Value
	e := RefreshSession(sessionID)
	if e != nil {
		Error500(w)
		return
	}
	sendFront(w, sess, code200)
}

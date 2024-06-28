package internal

import (
	"net/http"
)

func Index(w http.ResponseWriter, r *http.Request) {

	if Errorfile {
		Error500(w)
		return
	}
	// c, _, err := Authenticated(w, r)

	// if c != nil || err != nil {
	// 	return
	// }
	if er := ExeTemp(w, "index.html", nil); er != nil {
		Error500(w)
		return
	}

}

package internal

import (
	"io"
	"net/http"
)

const (
	code200 = 200
	code206 = 206
	code303 = 303
	code500 = 500
	code400 = 400
	code401 = 401
	code404 = 404
	code405 = 405
)

func Url(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Redirect(w, r, "/Error", code303)
		return
	}
	body, err := io.ReadAll(r.Body)
	if err != nil {
		Error500(w)
		return
	}

	bodyStr := string(body)
	if bodyStr == "/Error" {
		Error405(w)
		return
	}

	if ErrorUrl(bodyStr) {
		Error404(w)
		return
	}
}

func Error500(w http.ResponseWriter) {
	err := NewError{
		Mess: "Internal Server Error",
		Error: true,
		Code:  code500,
	}
	sendFront(w, err, err.Code)
}
func Error405(w http.ResponseWriter) {
	err := NewError{
		Mess: "Not Allowed",
		Error: true,
		Code:  code405,
	}
	sendFront(w, err, err.Code)
}
func Error400(w http.ResponseWriter) {
	err := NewError{
		Mess: "Bad Request",
		Error: true,
		Code:  code400,
	}
	sendFront(w, err, err.Code)
}
func Error404(w http.ResponseWriter) {

	err := NewError{
		Mess: "Page Not Found",
		Error: true,
		Code:  code404,
	}
	sendFront(w, err, err.Code)
}
func ErrorUrl(url string) bool {
	if url != "/" &&
		url != "/register" &&
		url != "/loginAuth" &&
		url != "/error" &&
		url != "/registerAuth" &&
		url != "/Auth" &&
		url != "/forumfilter" &&
		url != "/url" {
		return true
	}
	return false
}

func onlySpace(s string) bool {
	count := 0
	for _, v := range s {
		if v == ' ' {
			count++
		}
	}
	return count == len(s)
}

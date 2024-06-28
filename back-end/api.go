package internal

import (
	"database/sql"
	"encoding/json"
	"html/template"
	"io"
	"net/http"
)

var (
	Errorfile bool   // internal error file or database
	Errorpage string // error page
	Tmpl      *template.Template
	code      int
	DB        *sql.DB
)

type data struct {
	IsReg      bool
	ErrorLog   string
	ErrorAlert string
}

type ApiAuth struct {
	NoAuth   bool
	Error500 bool
}

type NewError struct {
	Mess  string
	Error bool
	Code  int
}

type User struct {
	ID           int
	Username     string
	Age          int
	Gender       string
	Firstname    string
	Lastname     string
	Email        string
	Password     string
	HashPassword string
}

type Session struct {
	Token      string
	User_ID    int
	Username   string
	Create_at  string
	Expired_at string
}

type PostValue struct {
	ID          int
	User_id     int
	Category_id string
	Title       string
	Message     string
}

type comment struct {
	Com_id   int
	Like     int
	Dislike  int
	Username string
	Comment  string
}

type ppost struct {
	User        string
	Post_id     string
	User_id     int
	Title       string
	Message     string
	Comments    []comment
	Likes       int
	Dislikes    int
	IsConnect   bool
	Online_user string
}

type post struct {
	Id       int
	Username string
	Title    string
	Category []string
}

type forumhome struct {
	Allposts    []ppost
	Categories  []string
	AllUsers    []string
	IsConnect   bool
	Username    string
	ErrorString string
}
type Users struct {
	ID       int
	Username string
	Email    string
}

type ApiLogin struct {
	BadLog   bool
	Username string
	Email    string
}

type ApiRegister struct {
	Unreg    bool
	BadCri   bool
	BadEmail bool
	Username string
}

func sendFront(w http.ResponseWriter, api interface{}, statusCode int) error {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	err := json.NewEncoder(w).Encode(api)
	if err != nil {
		// Utiliser http.Error pour envoyer un message d'erreur et un code de statut
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return err
	}
	return nil
}

func ExeTemp(w io.Writer, name string, data any) error {
	return Tmpl.ExecuteTemplate(w, name, data)
}

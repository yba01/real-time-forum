package internal

import (
	"fmt"
	dat "forum/database"
	"html/template"
	"net/http"

	_ "github.com/mattn/go-sqlite3"
)

const port = ":8081"

func ServerRun() {
	tmpl, err := template.ParseGlob("front-end/static/html/*")
	if err != nil {
		Errorfile = true
	}
	// send a template
	if tmpl == nil {
		fmt.Println("Error Parsing file")
		return
	}
	Tmpl = tmpl
	// initialize the database
	InitDB, err := dat.InitDB()
	if err != nil {
		Errorfile = true
	}

	if InitDB == nil {
		fmt.Println("Error Opening database")
		return
	}
	DB = InitDB
	// create all tables in our database initDB
	if err := dat.CreateTables(InitDB); err != nil {
		Errorfile = true // if we have bad request sql in our query sql, we have an internal error
	}
	fs := http.FileServer(http.Dir("front-end/static"))
	http.Handle("/static/", http.StripPrefix("/static/", fs))
	// handle root
	http.HandleFunc("/", Index)
	http.HandleFunc("/logout", Logout)
	http.HandleFunc("/loginAuth", LoginAuth)
	http.HandleFunc("/registerAuth", RegisterAuth)
	http.HandleFunc("/auth", Auth)
	http.HandleFunc("/url", Url)
	http.HandleFunc("/forum", Forum)
	http.HandleFunc("/post", Post)
	http.HandleFunc("/postSubmit", PostSubmit)
	http.HandleFunc("/comment", ComentaryInsert)
	http.HandleFunc("/reaction", ReactionHandle)
	http.HandleFunc("/forumfilter", Filterforum)
	http.HandleFunc("/reactioncom", ReactioncomHandle)
	http.HandleFunc("/ws", HandleWebsocket)
	fmt.Println("Server is running on http://localhost" + port)
	http.ListenAndServe(port, nil)
}

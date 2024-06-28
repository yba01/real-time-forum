package internal

import (
	"database/sql"
	"fmt"
	"net/http"
	"strconv"

	"github.com/gorilla/websocket"
	"golang.org/x/crypto/bcrypt"
)

// For Register
func CreateUser(user *User) error {
	NumMsg := 0
	var conn *websocket.Conn
	_, err := DB.Exec("INSERT INTO users (username,email,password,age,gender,firstname,lastname,NumMsg) VALUES(?,?,?,?,?,?,?,?)",
		user.Username, user.Email, user.HashPassword, user.Age, user.Gender, user.Firstname, user.Lastname,NumMsg)
	if err != nil {
		return fmt.Errorf(err.Error())
	}
WsUsers[user.Username] = conn
	return nil
}

// The user already exists in DB and we need his information
func getUserFromDB(name string) (*User, error) {
	var row *sql.Row
	newUser := User{}
	if CheckEmail(name) {
		row = DB.QueryRow("SELECT id,username,password,email FROM users WHERE email = ?", name)
	} else {
		row = DB.QueryRow("SELECT id,username,password,email FROM users WHERE username = ?", name)
	}

	err := row.Scan(&newUser.ID, &newUser.Username, &newUser.Password, &newUser.Email)
	if err != nil && err != sql.ErrNoRows {
		return nil, err
	}

	return &newUser, err
}

// get data input when user registers
func getInputReg(r *http.Request) (*User, error) {
	username := r.FormValue("username")
	age, e := strconv.Atoi(r.FormValue("age"))
	gender := r.FormValue("gender")
	firstname := r.FormValue("firstname")
	lastname := r.FormValue("lastname")
	email := r.FormValue("email")
	password := r.FormValue("password")
	hashPasswd, err := bcrypt.GenerateFromPassword([]byte(password), 10)
	if err != nil || e != nil {
		return nil, fmt.Errorf(err.Error())
	}
	user := &User{
		Username:     username,
		Email:        email,
		Age:          age,
		Gender:       gender,
		Firstname:    firstname,
		Lastname:     lastname,
		Password:     password,
		HashPassword: string(hashPasswd),
	}
	return user, nil
}

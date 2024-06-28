package internal

import (
	"net/http"
	"regexp"
	"strings"
	"unicode"
)

func Register(w http.ResponseWriter, r *http.Request) {
	if Errorfile {
		Error500(w)
		return
	}

	if er := ExeTemp(w, "register.html", nil); er != nil {
		Error500(w)
		return
	}

}

func RegisterAuth(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Redirect(w, r, "/Error", code303)
		return
	}
	newUser, err := getInputReg(r)
	if err != nil {
		Error500(w)
		return
	}

	newUser.Username = strings.ToLower(newUser.Username)
	newUser.Email = strings.ToLower(newUser.Email)

	//check if username, email and password are empty
	if newUser.Username == "" ||
		newUser.Email == "" ||
		newUser.Password == "" ||
		newUser.Age == 0 ||
		newUser.Gender == "" ||
		newUser.Firstname == "" ||
		newUser.Lastname == "" {
		Error400(w)
		return
	}

	username := newUser.Username
	email := newUser.Email
	password := newUser.Password

	if !CheckName(username) || !CheckPassword(password) {
		api := ApiRegister{
			BadCri: true,
		}
		sendFront(w, api, code206)
		return
	}
	if !CheckEmail(email) {
		api := ApiRegister{
			BadEmail: true,
		}
		sendFront(w, api, code206)
		return
	}

	er := IsNameExist(username)
	e := IsEmailExist(email)
	if er == nil || e == nil {
		api := ApiRegister{
			Unreg: true,
		}
		sendFront(w, api, code206)
		return
	}

	errs := CreateUser(newUser)
	if errs != nil {
		Error500(w)
		return
	}
	api := ApiRegister{
		Username: newUser.Username,
	}

	err = sendFront(w, api, code200)
	if err != nil {
		return
	}

}

// check username for only alphaNumeric characters
func CheckName(name string) bool {
	var (
		IsAlphanumeric = true
		lengthName     = false
	)
	if 5 <= len(name) && len(name) <= 50 {
		lengthName = true
	}
	for _, char := range name {
		if !unicode.IsLetter(char) && !unicode.IsNumber(char) {
			IsAlphanumeric = false
		}
	}

	return IsAlphanumeric && lengthName
}

// check password criteria
func CheckPassword(pwd string) bool {
	var (
		paswdLowercase, paswdUppercase, paswdNumber, paswdLength, paswdSpecial bool
		paswdNoSpace                                                           = true
	)
	for _, char := range pwd {
		switch {
		case unicode.IsLower(char):
			paswdLowercase = true
		case unicode.IsUpper(char):
			paswdUppercase = true
		case unicode.IsNumber(char):
			paswdNumber = true
		case unicode.IsPunct(char) || unicode.IsSymbol(char):
			paswdSpecial = true
		case unicode.IsSpace(char):
			paswdNoSpace = false
		}
	}
	if 9 < len(pwd) && len(pwd) < 60 {
		paswdLength = true
	}
	if !paswdLowercase || !paswdUppercase || !paswdNumber || !paswdLength || !paswdSpecial || !paswdNoSpace {
		return false
	}
	return true
}

// Check if username or email is already used
func IsNameExist(name string) error {
	row1 := DB.QueryRow("SELECT username,password,email FROM users WHERE username = ? ", name)
	user := User{}
	err1 := row1.Scan(&user.Username, &user.Password, &user.Email)
	if err1 != nil {
		return err1
	}
	return nil
}
func IsEmailExist(email string) error {
	row2 := DB.QueryRow("SELECT username,password,email FROM users WHERE email = ? ", email)
	user := User{}
	err2 := row2.Scan(&user.Username, &user.Password, &user.Email)

	if err2 != nil {
		return err2
	}
	return nil
}

// Check if email is correct
func CheckEmail(email string) bool {
	// Regular expression pattern for basic email
	pattern := "^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+.[a-zA-Z.]{2,15}$"

	// Compile the pattern
	regex := regexp.MustCompile(pattern)

	// Check if the email match pattern
	return regex.MatchString(email)
}

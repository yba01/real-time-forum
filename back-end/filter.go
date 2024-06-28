package internal

import (
	"net/http"
	"strconv"
	"strings"
)

func Filterforum(w http.ResponseWriter, r *http.Request) {
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
	var NumMsg int
	Num := DB.QueryRow("SELECT NumMsg from users WHERE username = ?", sess.Username)

	er := Num.Scan(&NumMsg)
	if er != nil {
		return
	}

	category_in := r.URL.Query().Get("id")

	if category_in == "createdpost" {
		CreatedPostFilter(w, r)
		return
	}

	if category_in == "LikedPost" {
		LikedPostFilter(w, r)
		return
	}

	PostInf, err := DB.Query("SELECT p.id, p.title, u.username, p.category_id FROM post p JOIN users u ON p.user_id = u.id WHERE p.category_id LIKE ?", "% "+category_in+" %")

	if err != nil {
		Error500(w)
		return
	}

	Categories, err2 := DB.Query("SELECT category FROM categories")

	if err2 != nil {
		Error500(w)
		return
	}

	var category string

	var Post post
	var forumpage forumhome

	for Categories.Next() {
		Categories.Scan(&category)
		forumpage.Categories = append(forumpage.Categories, category)
	}
	for PostInf.Next() {
		var categories string
		PostInf.Scan(&Post.Id, &Post.Title, &Post.Username, &categories)
		Post.Category = strings.Fields(categories)
		Fullpost := ForumInfo(strconv.Itoa(Post.Id), w)
		forumpage.Allposts = append(forumpage.Allposts, Fullpost)
	}
	var users string
	Users, err3 := DB.Query("SELECT username FROM users")
	if err3 != nil {
		Error500(w)
		return
	}

	for Users.Next() {
		Users.Scan(&users)
		if users != sess.Username {
			forumpage.AllUsers = append(forumpage.AllUsers, users)
		}
	}
	var (
		order []string
	)
	if NumMsg != 0 {

		Senders, erro := DB.Query("SELECT sender, receiver  FROM messages  WHERE sender = ? OR receiver = ? ORDER BY timestamp DESC", sess.Username, sess.Username)
		if erro != nil {
			Error500(w)
			return
		}

		for Senders.Next() {
			var sender, receiver string
			Senders.Scan(&sender, &receiver)
			if sender != sess.Username {
				if !IsHere(sender, order) {
					order = append(order, sender)
				}
			}
			if receiver != sess.Username {
				if !IsHere(receiver, order) {
					order = append(order, receiver)
				}
			}

		}

		forumpage.AllUsers = OrderSentMsg(order, forumpage.AllUsers)

	}
	forumpage.Username = sess.Username
	if len(forumpage.Allposts) < 1 {
		forumpage.ErrorString = "There is nothing here..."
	}
	err = sendFront(w, forumpage, code200)
	if err != nil {
		return
	}
}

func CreatedPostFilter(w http.ResponseWriter, r *http.Request) {
	c, session, err := Authenticated(w, r)

	if c == nil || err != nil || session == nil {
		return
	}
	sessionID := c.Value
	e := RefreshSession(sessionID)
	if e != nil {
		Error500(w)
		return
	}

	userId := session.User_ID

	PostInf, err := DB.Query("SELECT p.id, p.title, u.username, p.category_id FROM post p JOIN users u ON p.user_id = u.id WHERE u.id = ?", userId)

	if err != nil {
		Error500(w)
		return
	}

	Categories, err2 := DB.Query("SELECT category FROM categories")

	if err2 != nil {
		Error500(w)
		return
	}
	var NumMsg int
	Num := DB.QueryRow("SELECT NumMsg from users WHERE username = ?", session.Username)

	er := Num.Scan(&NumMsg)
	if er != nil {
		return
	}

	var category string

	var Post post
	var forumpage forumhome

	for Categories.Next() {
		Categories.Scan(&category)
		forumpage.Categories = append(forumpage.Categories, category)
	}
	for PostInf.Next() {
		var categories string
		PostInf.Scan(&Post.Id, &Post.Title, &Post.Username, &categories)
		Fullpost := ForumInfo(strconv.Itoa(Post.Id), w)
		forumpage.Allposts = append(forumpage.Allposts, Fullpost)
	}
	var users string
	Users, err3 := DB.Query("SELECT username FROM users")
	if err3 != nil {
		Error500(w)
		return
	}

	for Users.Next() {
		Users.Scan(&users)
		if users != session.Username {
			forumpage.AllUsers = append(forumpage.AllUsers, users)
		}
	}
	var (
		order []string
	)
	if NumMsg != 0 {

		Senders, erro := DB.Query("SELECT sender, receiver  FROM messages  WHERE sender = ? OR receiver = ? ORDER BY timestamp DESC", session.Username, session.Username)
		if erro != nil {
			Error500(w)
			return
		}

		for Senders.Next() {
			var sender, receiver string
			Senders.Scan(&sender, &receiver)
			if sender != session.Username {
				if !IsHere(sender, order) {
					order = append(order, sender)
				}
			}
			if receiver != session.Username {
				if !IsHere(receiver, order) {
					order = append(order, receiver)
				}
			}

		}

		forumpage.AllUsers = OrderSentMsg(order, forumpage.AllUsers)

	}
	if len(forumpage.Allposts) < 1 {
		forumpage.ErrorString = "There is nothing here..."
	}
	forumpage.IsConnect = true
	forumpage.Username = session.Username
	err = sendFront(w, forumpage, code200)
	if err != nil {
		return
	}
}

func LikedPostFilter(w http.ResponseWriter, r *http.Request) {

	c, session, err := Authenticated(w, r)

	if c == nil || err != nil || session == nil {
		return
	}
	sessionID := c.Value
	e := RefreshSession(sessionID)
	if e != nil {
		Error500(w)
		return
	}

	userId := session.User_ID

	Postid, err := DB.Query("SELECT post_id FROM reaction WHERE liked = 1 AND user_id = ?", userId)

	if err != nil {
		Error500(w)
		return
	}
	var Post post
	var post_id int
	var forumpage forumhome
	for Postid.Next() {
		Postid.Scan(&post_id)
		var categories string
		err := DB.QueryRow("SELECT p.id, p.title, u.username, p.category_id FROM post p JOIN users u ON p.user_id = u.id WHERE p.id = ?", post_id).Scan(&Post.Id, &Post.Title, &Post.Username, &categories)
		if err != nil {
			Error500(w)
			return
		}
		Fullpost := ForumInfo(strconv.Itoa(Post.Id), w)
		forumpage.Allposts = append(forumpage.Allposts, Fullpost)
	}
	var users string
	Users, err3 := DB.Query("SELECT username FROM users")
	if err3 != nil {
		Error500(w)
		return
	}

	for Users.Next() {
		Users.Scan(&users)
		if users != session.Username {
			forumpage.AllUsers = append(forumpage.AllUsers, users)
		}
	}
	if len(forumpage.Allposts) < 1 {
		forumpage.ErrorString = "There is nothing here..."
	}

	Categories, err2 := DB.Query("SELECT category FROM categories")

	if err2 != nil {
		Error500(w)
		return
	}

	var category string

	for Categories.Next() {
		Categories.Scan(&category)
		forumpage.Categories = append(forumpage.Categories, category)
	}
	var NumMsg int
	Num := DB.QueryRow("SELECT NumMsg from users WHERE username = ?", session.Username)

	er := Num.Scan(&NumMsg)
	if er != nil {
		return
	}

	var (
		order []string
	)
	if NumMsg != 0 {

		Senders, erro := DB.Query("SELECT sender, receiver  FROM messages  WHERE sender = ? OR receiver = ? ORDER BY timestamp DESC", session.Username, session.Username)
		if erro != nil {
			Error500(w)
			return
		}

		for Senders.Next() {
			var sender, receiver string
			Senders.Scan(&sender, &receiver)
			if sender != session.Username {
				if !IsHere(sender, order) {
					order = append(order, sender)
				}
			}
			if receiver != session.Username {
				if !IsHere(receiver, order) {
					order = append(order, receiver)
				}
			}

		}

		forumpage.AllUsers = OrderSentMsg(order, forumpage.AllUsers)

	}

	forumpage.IsConnect = true
	forumpage.Username = session.Username

	err = sendFront(w, forumpage, code200)
	if err != nil {
		return
	}
}

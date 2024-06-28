package internal

import (
	"net/http"
	"strconv"
	"strings"
)

func Forum(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Redirect(w, r, "/Error", code303)
		return
	}
	if Errorfile {
		Error500(w)
		return
	}
	// if ErrorUrl(r.URL.RawPath) {
	// 	Error404(w)
	// 	return

	// }
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

	PostInf, err := DB.Query("SELECT p.id, p.title, u.username, p.category_id FROM post p JOIN users u ON p.user_id = u.id")

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
	var NumMsg int
	var Post post
	var forumpage forumhome

	Num := DB.QueryRow("SELECT NumMsg from users WHERE username = ?", sess.Username)

	er := Num.Scan(&NumMsg)
	if er != nil {
		return
	}

	forumpage.Username = sess.Username

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

	if len(forumpage.Allposts) < 1 {
		forumpage.ErrorString = "There is nothing here..."
	}

	err = sendFront(w, forumpage, code200)
	if err != nil {
		return
	}

}

func ForumInfo(post_id string, w http.ResponseWriter) ppost {

	id, erid := strconv.Atoi(post_id)
	if erid != nil {
		Error500(w)
	}

	var Post ppost
	Post.Post_id = post_id
	err := DB.QueryRow("SELECT title, message, user_id FROM post WHERE id = ?", post_id).Scan(&Post.Title, &Post.Message, &Post.User_id)
	err1 := DB.QueryRow("SELECT username FROM users WHERE id = ?", Post.User_id).Scan(&Post.User)
	if err != nil {
		Error400(w)
	}
	if err1 != nil {
		Error400(w)
	}

	total, errsum := DB.Query("SELECT SUM(liked), SUM(disliked) FROM reaction WHERE post_id = ?", post_id)
	if errsum != nil {
		Error500(w)
	}
	for total.Next() {
		total.Scan(&Post.Likes, &Post.Dislikes)
	}

	var Commentary comment

	Comments, err := DB.Query("SELECT u.username, c.commentary, c.id FROM comments c JOIN users u ON c.user_id = u.id WHERE c.post_id = ?", id)
	if err != nil {
		Error500(w)
	}
	for Comments.Next() {
		Comments.Scan(&Commentary.Username, &Commentary.Comment, &Commentary.Com_id)
		Commentary.Dislike = 0
		Commentary.Like = 0
		total, errsum := DB.Query("SELECT SUM(liked), SUM(disliked) FROM reactioncom WHERE com_id = ?", Commentary.Com_id)
		if errsum != nil {
			Error500(w)
		}
		for total.Next() {
			total.Scan(&Commentary.Like, &Commentary.Dislike)
		}
		Post.Comments = append(Post.Comments, Commentary)
	}
	return Post
}

func ComentaryInsert(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Redirect(w, r, "/Error", code303)
		return
	}
	post_id := r.URL.Query().Get("id")

	c, Session, err := Authenticated(w, r)

	if c == nil || err != nil {
		return
	}
	sessionID := c.Value
	e := RefreshSession(sessionID)
	if e != nil {
		Error500(w)
		return
	}
	userID := Session.User_ID

	commentary := r.FormValue("commentary")

	if commentary == "" || onlySpace(commentary) {
		Error400(w)
		return
	}

	commentary = strings.Trim(commentary, " ")

	_, err = DB.Exec("INSERT INTO comments (user_id, post_id, commentary) VALUES(?, ?, ?)", userID, post_id, commentary)
	if err != nil {
		Error500(w)
		return
	}

	thePost := ForumInfo(post_id, w)

	err = sendFront(w, thePost, code200)
	if err != nil {
		return
	}

}

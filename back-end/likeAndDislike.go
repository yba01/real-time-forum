package internal

import (
	"database/sql"
	"fmt"
	"net/http"
	"strconv"
)

func ReactionHandle(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Redirect(w, r, "/Error", code303)
		return
	}

	post_id := r.URL.Query().Get("id")
	fmt.Println(post_id)
	c, Session, err := Authenticated(w, r)

	if c == nil || err != nil || Session == nil {
		return
	}
	sessionID := c.Value
	e := RefreshSession(sessionID)
	if e != nil {
		Error500(w)
		return
	}
	UserID := Session.User_ID
	action := r.URL.Query().Get("action")
	fmt.Println(action)
	liked, disliked := 0, 0
	switch action {
	case "like":
		liked, disliked = 1, 0
	case "dislike":
		liked, disliked = 0, 1
	}

	rows := DB.QueryRow("SELECT user_id, post_id, liked, disliked FROM reaction WHERE user_id=? AND post_id=?", UserID, post_id)

	var id, id2, like, dislike int

	err = rows.Scan(&id, &id2, &like, &dislike)
	if like == liked && dislike == disliked {
		liked = 0
		disliked = 0
	}
	fmt.Println(liked, disliked)
	if err != nil {
		if err == sql.ErrNoRows {
			_, err1 := DB.Exec("INSERT INTO reaction (user_id, post_id, liked, disliked) VALUES(?, ?, ?, ?)", UserID, post_id, liked, disliked)
			if err1 != nil {
				Error500(w)
				return
			}
		}
	} else {
		_, err1 := DB.Exec("UPDATE reaction SET liked = ?, disliked = ? WHERE post_id=? AND user_id=?", liked, disliked, post_id, UserID)
		if err1 != nil {
			Error400(w)
			return
		}
	}

	thePost := ForumInfo(post_id, w)

	err = sendFront(w, thePost, code200)
	if err != nil {
		return
	}

}

func ReactioncomHandle(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Redirect(w, r, "/Error", code303)
		return
	}
	com_id := r.URL.Query().Get("id")
	_, Session, err := Authenticated(w, r)
	if err != nil || Session == nil {
		return
	}
	sessionID := Session.User_ID
	action := r.URL.Query().Get("action")
	liked, disliked := 0, 0
	switch action {
	case "like":
		liked, disliked = 1, 0
	case "dislike":
		liked, disliked = 0, 1
	}

	rows := DB.QueryRow("SELECT user_id, com_id, liked, disliked FROM reactioncom WHERE user_id=? AND com_id=?", sessionID, com_id)
	var id int
	var id2 int
	var like int
	var dislike int
	err = rows.Scan(&id, &id2, &like, &dislike)
	if like == liked && dislike == disliked {
		liked = 0
		disliked = 0
	}
	if err != nil {
		if err == sql.ErrNoRows {
			_, err1 := DB.Exec("INSERT INTO reactioncom (user_id, com_id, liked, disliked) VALUES(?, ?, ?, ?)", sessionID, com_id, liked, disliked)
			if err1 != nil {
				Error500(w)
				return
			}
		}
	} else {
		_, err1 := DB.Exec("UPDATE reactioncom SET liked = ?, disliked = ? WHERE com_id=? AND user_id=?", liked, disliked, com_id, sessionID)
		if err1 != nil {
			Error500(w)
			return
		}
	}
	var post int
	err = DB.QueryRow("SELECT c.post_id FROM reactioncom r JOIN comments c ON c.id = r.com_id WHERE r.com_id = ?", com_id).Scan(&post)
	if err != nil {
		Error500(w)
		return
	}
	post_id := strconv.Itoa(post)
	thePost := ForumInfo(post_id, w)
	var theComment comment

	for _, elem := range thePost.Comments {
		if strconv.Itoa(elem.Com_id) == com_id {
			theComment = elem
		}
	}

	err = sendFront(w, theComment, code200)
	if err != nil {
		return
	}
}

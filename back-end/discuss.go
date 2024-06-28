package internal

import (
	"database/sql"
)

func insertMessage(db *sql.DB, message message) error {
	stmt, err := db.Prepare("INSERT INTO messages(type, content, sender, receiver, alRead) VALUES(?, ?, ?, ?, ?)")
	if err != nil {
		return err
	}
	defer stmt.Close()

	_, err = stmt.Exec(message.Type, message.Content, message.Sender, message.Receiver, message.Read)
	return err
}

func getMessagesBetweenUsers(db *sql.DB, user1, user2 string) {
	rows, err := db.Query(`
        SELECT type, content, sender, receiver, timestamp, alRead FROM messages
        WHERE (sender = ? AND receiver = ?) OR (sender = ? AND receiver = ?)
        ORDER BY timestamp DESC
    `, user1, user2, user2, user1)
	if err != nil {
		return
	}
	defer rows.Close()

	var History historyMessage
	for rows.Next() {
		var message message
		var timestamp string // If you want to handle the timestamp, you can add a field in the Message struct
		if err := rows.Scan(&message.Type, &message.Content, &message.Sender, &message.Receiver, &timestamp, &message.Read); err != nil {
			return
		}
		History.Content = append(History.Content, message)
	}
	History.Type = "history"
	History.Sender = user1
	History.Receiver = user2
	for user, conn := range WsUsers {
		if user == user1 {
			if err := conn.WriteJSON(History); err != nil {
				return
			}
		}
	}
	markMessageAsRead(db, user1, user2)
}

// jai rajoute dans la structure de message un boleen pour savoir si le message a
// lu ou non du coup la jprends les messages qui ont ete non lu grace a cette fonction
func getUnreadMessages(db *sql.DB, user string) {
	rows, err := db.Query(`
        SELECT type, content, sender, receiver, alRead FROM messages
        WHERE receiver = ? AND alRead = 0
    `, user)
	if err != nil {
		return
	}
	defer rows.Close()

	var notifs historyMessage
	for rows.Next() {
		var msg message
		var read int // Use int to fetch the boolean value from SQLite
		if err := rows.Scan(&msg.Type, &msg.Content, &msg.Sender, &msg.Receiver, &read); err != nil {
			return
		}
		msg.Read = read != 0 // Convert integer to boolean
		notifs.Content = append(notifs.Content, msg)
	}
	notifs.Type = "notifs"
	for user1, conn := range WsUsers {
		if user == user1 {
			if err := conn.WriteJSON(notifs); err != nil {
				return
			}
		}
	}
}

// Mets a jour la base de donnee pour les messages lues
func markMessageAsRead(db *sql.DB, user1, user2 string) {
	_, err := db.Exec(`
        UPDATE messages
		SET alRead = 1
        WHERE (sender = ? AND receiver = ?)
    `, user2, user1)
	if err != nil {
		return
	}
}

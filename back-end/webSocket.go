package internal

import (
	"fmt"
	"net/http"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

type message struct {
	Type     string
	Content  string
	Sender   string
	Receiver string
	Read bool
}
type Online struct {
	Type        string
	Me          string
	IsDisconnet bool
}
type historyMessage struct {
	Type     string
	Sender   string
	Receiver string
	Content  []message
}

var WsUsers = make(map[string]*websocket.Conn)

func HandleWebsocket(w http.ResponseWriter, r *http.Request) {
	fmt.Println("in websocket")
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Println(err.Error())
		return
	}
	_, Session, err1 := Authenticated(w, r)
	if err1 != nil {
		Error500(w)
		return
	}

	WsUsers[Session.Username] = conn
	IamConnected(Session.Username)
	go handleMessages(conn)
}

func handleMessages(conn *websocket.Conn) {
	for {
		var msg message
		err := conn.ReadJSON(&msg)
		if err != nil {
			fmt.Println(err.Error())
			return
		}
		if msg.Type == "message" {
			privateMessageSend(msg)

		}
		if msg.Type == "typing" {
			TypingSend(msg)
		}
		if msg.Type == "history" {
			fmt.Println("gettin history")
			getMessagesBetweenUsers(DB, msg.Sender, msg.Receiver)
		}
		if msg.Type == "notification" {
			fmt.Println("gettin notifs")
			getUnreadMessages(DB, msg.Sender)
		}
	}
}

func privateMessageSend(msg message) {
	for user, conn := range WsUsers {
		if user == msg.Receiver {
			if err := conn.WriteJSON(msg); err != nil {
				fmt.Println(err.Error())
				return
			}
			insertMessage(DB, msg)
			IamNotNew(msg.Sender, msg.Receiver)
			return
		}
	}
}

func TypingSend(msg message) {
	for user, conn := range WsUsers {
		if user == msg.Receiver {
			if err := conn.WriteJSON(msg); err != nil {
				fmt.Println(err)
				return
			}
		}
	}
}

func IamConnected(me string) {
	MyConn := WsUsers[me]
	onl := Online{
		Type: "status",
		Me:   me,
	}
	// all user need to know if i am connec
	for user, conn := range WsUsers {
		if user != me {
			if conn != nil {
				if err := conn.WriteJSON(onl); err != nil {
					fmt.Println(err)
				}
			}

		}

	}
	//also me i need to know all user connected
	for user, conn := range WsUsers {
		if conn != nil {
			if user != me {
				onl := Online{
					Type: "status",
					Me:   user,
				}
				if err := MyConn.WriteJSON(onl); err != nil {
					fmt.Println(err)
				}
			}
		}

	}

}
func IamDisConnected(me string) {
	delete(WsUsers, me)
	onl := Online{
		Type:        "status",
		Me:          me,
		IsDisconnet: true,
	}
	//all user need to know who i am disconneted
	for _, conn := range WsUsers {
		if conn != nil{
			if err := conn.WriteJSON(onl); err != nil {
				fmt.Println(err)
			}
		}
		
	}
}

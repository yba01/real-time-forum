package internal

import "fmt"

func IamNotNew(sender, receiver string) error {
	_, err := DB.Exec("UPDATE users SET NumMsg = NumMsg + 1  WHERE username = ?", sender)
	_, er := DB.Exec("UPDATE users SET NumMsg = NumMsg + 1  WHERE username = ?", receiver)
	if err != nil {
		return fmt.Errorf(err.Error())

	}
	if er != nil {
		return fmt.Errorf(er.Error())
	}
	return nil
}


func OrderSentMsg (tabOrder,tabNotOrder []string)[]string{
	for _, v := range tabNotOrder{
		if !IsHere(v,tabOrder){
			tabOrder = append(tabOrder, v)
		}
	}
	return tabOrder
}

func IsHere(s string,tab []string)bool{
	for _, v:= range tab{
		if v == s{
			return true
		}
	}
	return false
}
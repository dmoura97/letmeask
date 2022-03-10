import { useEffect, useState } from "react";

import { onValue, ref } from "firebase/database";
import { database } from "../services/firebase";

type QuestionType = {
  id: string;
  author: {
    avatar: string;
    name: string;
  }
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
}

type FirebaseQuestions = Record<string, {
  author: {
    avatar: string;
    name: string;
  }
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
}>

export function useRoom(roomId: string) {
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [title, setTitle] = useState('');

  useEffect(() => {

    const roomRef = ref(database, `rooms/${roomId}`);
    onValue(roomRef, (databaseRoom) => {
      const data = databaseRoom.val();
      const firebaseQuestions: FirebaseQuestions = data.questions ?? {};

      const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
        return {
          id: key,
          content: value.content,
          author: value.author,
          isHighlighted: value.isHighlighted,
          isAnswered: value.isAnswered
        }
      }); 


      setTitle(data.title)
      setQuestions(parsedQuestions);  
      
    })
   },[roomId])

   return { questions, title }
}
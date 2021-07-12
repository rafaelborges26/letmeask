import { parse } from 'path'
import { FormEvent, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Logo from '../assets/images/logo.svg'
import { Button } from '../components/Button'
import { RoomCode } from '../components/roomCode'
import { useAuth } from '../hooks/useAuth'
import { database } from '../services/firebase'
import '../styles/room.scss'

type FirebaseQuestion = Record<string,{
    author: {
        name: string,
        avatar: string,
    },
    content: string,
    isAnswered: boolean,
    isHighlighted: boolean
} >

type RoomParams = {
    id: string
}

type Question = {
    id: string,
    author: {
        name: string,
        avatar: string,
    },
    content: string,
    isAnswered: boolean,
    isHighlighted: boolean
}

export function Room() {
    const {user} = useAuth()
    const params = useParams<RoomParams>();
    const [newQuestion, setNewQuestion] = useState('')
    const [questions, setQuestions] = useState<Question[]>([])
    const [title, setTitle] = useState('')


    console.log(params) 

    const roomId = params.id

    useEffect(() => {
        const roomRef = database.ref(`rooms/${roomId}`);

        roomRef.on('value', room => {
            const databaseRoom = room.val();
            const firebaseQuestion: FirebaseQuestion = databaseRoom.questions ?? {}

            const parsedQuestions = Object.entries(firebaseQuestion).map(([key, value]) => {
                return {
                    id: key,
                    content: value.content,
                    author: value.author,
                    isHighlighted: value.isHighlighted,
                    isAnswered: value.isAnswered
                }
        })

        console.log(parsedQuestions)
        setTitle(databaseRoom.title)
        setQuestions(parsedQuestions)
        }) 
    },[roomId])

    const handleSendQuestion = async (event: FormEvent) => {

        event.preventDefault()

        if(newQuestion.trim() === ''){
            return;
        }

        if(!user){
            throw new Error('You must be logged in')
        }

        const question = {
            content: newQuestion,
            author: {
                name: user.name,
                avatar: user.avatar
            },
            isHighlighted: false,
            isAnswered: false
        }

        await database.ref(`rooms/${roomId}/questions`).push(question) //criar um novo registro dentro da sessao existente
        setNewQuestion('');
    }

    return (
        <div id="page-room">
            <header>
                <div className="content">
                     <img src={Logo} alt="Letmeask"/>
                     
                         <RoomCode code={roomId}/>
                     

                </div>
            </header>
            <main className="content">
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    {questions.length > 0 && <span>{questions.length} perguntas</span>  }
                </div>

                <form onSubmit={handleSendQuestion}>
                    <textarea 
                        placeholder="O que você quer perguntar?"
                        onChange={event => setNewQuestion(event.target.value)}
                        value={newQuestion} 
                    />

                    <div className="form-footer">
                        { user ? <div className="user-info">
                            <img src={user.avatar} alt={user.name}/>    
                            <span>{user.name}</span>
                        </div> : 
                        <span>Para enviar uma pergunta, 
                            <button 
                                disabled={!user}
                            >
                                faça seu login.
                            </button>
                        </span>
 }
                        
                        <Button
                            type="submit">
                                Enviar pergunta
                        </Button>
                    </div>
                </form>
                {JSON.stringify(questions)}
            </main>
        </div>
    )
}
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
    }
    content: string,
    isAnswered: boolean,
    isHighlighted: boolean
} >

type RoomParams = {
    id: string
}

export function Room() {
    const {user} = useAuth()
    const params = useParams<RoomParams>();
    const [newQuestion, setNewQuestion] = useState('')
    console.log(params) 

    const roomId = params.id

    useEffect(() => {
        const roomRef = database.ref(`rooms/${roomId}`);

        roomRef.once('value', room => {
            const parsedQuestions = Object.entries(room.questions ?? {})
            console.log(room.val()) //buscar os dados
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
                    <h1>Sala React</h1>
                    <span>4 Perguntas</span>
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
            </main>
        </div>
    )
}
import { useContext, FormEvent, useState } from 'react'
import { useHistory } from 'react-router-dom'

import Ilustration from '../assets/images/illustration.svg';
import Logo from '../assets/images/logo.svg';
import GoogleIcon from '../assets/images/google-icon.svg';
import '../styles/auth.scss'

import {Button} from '../components/Button'
import { AuthContext } from '../contexts/AuthContext';
import { useAuth } from '../hooks/useAuth';
import { database } from '../services/firebase';

export function Home() { 
    const history = useHistory();

    const { SignInWithGoogle, user } = useAuth();

    const [roomCode, setRoomCode] = useState('')

    const handleCreateRoom = async () => {
        //autenticação com o Google
        if(!user){
            await SignInWithGoogle();
        } 
             history.push('/rooms/new')
        
    }

    const handleJoinRoom = async (event: FormEvent) => {
        event.preventDefault();

        if(roomCode.trim() === ''){
            return;
        }

        //faz um select no banco buscando por esse key
        const roomRef = await database.ref(`rooms/${roomCode}`).get(); 

        if(!roomRef.exists()){
            alert('Room does not exist')
            return;
        }

        history.push(`/rooms/${roomCode}`)
    }

    

    return (
            <div id="page-auth">
                <aside>
                <img src={Ilustration} alt="Ilustração simbolizando perguntas e respostas" />
                <strong>Crie salas de Q&amp;A ao-vivo</strong>
                <p>Tire as dúvidas da sua audiência em tempo-real</p>
                </aside>
                <main >
                    <div className="main-content">
                        <img src={Logo} alt="Letmeask"/>
                        <button className="create-room" onClick={handleCreateRoom}>
                            <img src={GoogleIcon} alt="Logo do Google"/>
                            Crie sua sala com o Google
                        </button>
                        <div className="separator">ou entre em uma sala</div>
                        <form onSubmit={handleJoinRoom}>
                            <input 
                                type="text"
                                placeholder="Digite o código da sala"
                                onChange={event => setRoomCode(event.target.value)}
                                value={roomCode}
                            />
                            <Button
                                type="submit"    
                            >
                                Entrar na sala
                            </Button>
                        </form>
                    </div>
                </main>
            </div>
           )
}
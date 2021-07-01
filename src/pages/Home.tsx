import { useContext } from 'react'
import { useHistory } from 'react-router-dom'

import Ilustration from '../assets/images/illustration.svg';
import Logo from '../assets/images/logo.svg';
import GoogleIcon from '../assets/images/google-icon.svg';
import '../styles/auth.scss'

import {Button} from '../components/Button'
import { AuthContext } from '../contexts/AuthContext';
import { useAuth } from '../hooks/useAuth';

export function Home() { 
    const history = useHistory();

    const { SignInWithGoogle, user } = useAuth();

    const handleCreateRoom = async () => {
        //autenticação com o Google
        if(!user){
            await SignInWithGoogle();
        } 
             history.push('/rooms/new')
        
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
                        <form>
                            <input 
                                type="text"
                                placeholder="Digite o código da sala"
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
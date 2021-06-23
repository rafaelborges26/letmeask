import Ilustration from '../assets/images/illustration.svg';
import Logo from '../assets/images/logo.svg';
import GoogleIcon from '../assets/images/google-icon.svg';
import '../styles/auth.scss'

export function Home() {
    return (
            <div id="page-auth">
                <aside>
                <img src={Ilustration} alt="Ilustração simbolizando perguntas e respostas" />
                <strong>Crie salas de Q&amp;A ao-vivo</strong>
                <p>Tire as dúvidas da sua audiência em tempo-real</p>
                </aside>
                <main>
                    <div>
                        <img src={Logo} alt="Letmeask"/>
                        <button>
                            <img src={GoogleIcon} alt="Logo do Google"/>
                            Crie sua sala com o Google
                        </button>
                        <div>ou entre em uma sala</div>
                        <form>
                            <input 
                                type="text"
                                placeholder="Digite o código da sala"
                            />
                            <button
                                type="submit"    
                            >
                            </button>
                        </form>
                    </div>
                </main>
            </div>
           )
}
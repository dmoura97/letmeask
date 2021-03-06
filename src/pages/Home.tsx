import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

import { useAuth } from '../hooks/useAuth';

import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import googleIconImg from '../assets/images/google-icon.svg';

import { Button } from '../components/Button';

import '../styles/auth.scss';
import { ref, get } from 'firebase/database';
import { database } from '../services/firebase';

export function Home() {
  const history = useNavigate();
  const { user, signInWithGoogle } = useAuth();
  const [roomCode, setRoomCode] = useState('');

  async function handleCreateRoom() { 
    if(!user) {
      await signInWithGoogle();
    }

    history('/rooms/new')
  } 

  async function handleJoinRoom(event: FormEvent) {
    event.preventDefault();

    if(roomCode.trim() === '') {
      return;
    }    

    const roomRef = ref(database, `rooms/${roomCode}`);
    const room = await get(roomRef);

    if(!room.exists()) {
      toast.error("Room does not exists.", {
        duration: 3000,
        position: "top-center",
        style: {
          width: "250px",
        }
      });
      setRoomCode('');
      return;
    }

    if(room.val().endedAt) {
      toast.error("Room already closed.", {
        duration: 3000,
        position: "top-center",
        style: {
          width: "250px",
        }
      });
      setRoomCode('');
      return;
    }
    
    history(`/rooms/${roomCode}`)
  }

  return (
    <div id="page-auth">
      <aside>
        <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
        <strong>Crie salas Q&amp;A ao-vivo</strong>
        <p>Tire as dúvidas da sua audiência em tempo-real</p>
      </aside>
      <main>
        <div className="main-content">
          <img src={logoImg} alt="Letmeask" />
          <button onClick={handleCreateRoom} className="create-room">
            <img src={googleIconImg} alt="Logo do Google" />
            Crie sua sala com o Google
          </button>
          <div className="separator">ou entre em uma sala</div>
          <form onSubmit={handleJoinRoom}>
            <input 
              type="text" 
              placeholder='Digite o código da sala'
              onChange={event => setRoomCode(event.target.value)}
              value={roomCode}
            />
            <Button type="submit">
              Entrar na sala
            </Button>
          </form>
          <Toaster />
        </div>
      </main>
    </div>
  )
}
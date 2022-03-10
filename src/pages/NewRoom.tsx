import  { FormEvent, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth';



import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import { Button } from '../components/Button';
import { database } from "../services/firebase";
import { push, ref } from "firebase/database";

import '../styles/auth.scss';

export function NewRoom() {
  const { user } = useAuth();
  const history = useNavigate();

  const [newRoom, setNewRooom] = useState('');

  async function handleCreateRoom(event: FormEvent) {
    event.preventDefault();

    if(newRoom.trim() === '') {
      return;
    }

    const roomRef = ref(database, 'rooms');

    const firebaseRoom = await push(roomRef, {
      title: newRoom,
      authorId: user?.id
    });

    history(`/rooms/${firebaseRoom.key}`)

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
          <h2>Crie uma nova sala</h2>
          <form onSubmit={handleCreateRoom}>
            <input 
              type="text" 
              placeholder='Nome da sala'
              onChange={event => setNewRooom(event.target.value)}
              value={newRoom}
            />
            <Button type="submit">
              Criar sala
            </Button>
          </form>
          <p>
            Quer entrar em uma sala existente ? <Link to="/">clique aqui</Link>
          </p>
        </div>
      </main>
    </div>
  )
}
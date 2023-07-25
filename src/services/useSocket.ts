import { io, Socket } from 'socket.io-client';
import { AUTHENTICATED_BASE } from '../constants/endpoints';
import { createContext } from '../utils/createContext';
import { useEffect, useState } from 'react';
import { Draft } from '../models/draft';

type SocketContext = {
  openConnection: (leagueId: string) => void;
  socket: Socket | null;
  isConnected: boolean;
  wasDraftFinalizedReceived: boolean;
  latestDraftPickState: Draft | null;
};

// We will maintain a socket connection on urls with a league id.
const [useSocket, SocketProvider, socketContext] = createContext<SocketContext>(() => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const [latestDraftPickState, setLatestDraftPickState] = useState<Draft | null>(null);

  const [wasDraftFinalizedReceived, setWasDraftFinalizedReceived] = useState(false);

  const openConnection = (leagueId: string) => {
    const newSocket = io(AUTHENTICATED_BASE, {
      withCredentials: true,
      query: {
        leagueId,
      },
    });
    setSocket(newSocket);
  };

  function onConnect() {
    setIsConnected(true);
    setLatestDraftPickState(null);
  }

  function onDisconnect() {
    setIsConnected(false);
    setLatestDraftPickState(null);
  }

  function onFinalize() {
    setWasDraftFinalizedReceived(true);
  }

  function onDraftPick(value: Draft) {
    if (value) {
      setLatestDraftPickState(value);
    }
  }

  function onDraftLog(value: Draft) {
    if (value) {
      setLatestDraftPickState(value);
    }
  }

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('draft-pick', onDraftPick);
    socket.on('draft-log', onDraftLog);
    socket.on('draft-finalize', onFinalize);

    return () => {};
  }, [socket]);

  useEffect(() => {
    return () => {
      socket?.off('connect', onConnect);
      socket?.off('disconnect', onDisconnect);
      socket?.off('draft-pick', onDraftPick);
      socket?.off('draft-log', onDraftLog);
      socket?.off('draft-finalize', onFinalize);
    };
  }, []);

  return {
    openConnection,
    socket,
    isConnected,
    latestDraftPickState,
    wasDraftFinalizedReceived,
  };
});

export { useSocket, SocketProvider, socketContext };
export type { SocketContext };

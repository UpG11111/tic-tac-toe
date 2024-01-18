import { configureStore } from '@reduxjs/toolkit';
import gameStore from './modules/game.ts';

const store = configureStore({ reducer: { game: gameStore } });

export type RootState = ReturnType<typeof store.getState>;
export default store;

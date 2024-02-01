import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initialGameState } from '../../constants/gameConstants';

interface GameConfig {
    gameName: string;
    boardSize: number;
    piece: string[];
    winCount: number;
}

interface InitialState {
    winner: string | null;
    firstPlayer: boolean;
    boardSize: number;
    gameConfig: GameConfig;
    history: (string | null)[][][];
    playerOne: string;
    playerTwo: string;
}

const initialState: InitialState = {
    winner: null,
    firstPlayer: true,
    gameConfig: initialGameState,
    boardSize: initialGameState.boardSize,
    history: [
        Array(initialGameState.boardSize)
            .fill(null)
            .map(() => Array(initialGameState.boardSize).fill(null)),
    ],
    playerOne: 'PLAYER',
    playerTwo: 'PLAYER',
};
const gameStore = createSlice({
    name: 'game',
    initialState,
    reducers: {
    /**
     * 设置胜利者
     * @param state - 状态对象
     * @param action - 动作对象，包含胜利者信息的负载动作
     */
        setWinner (state, action: PayloadAction<string | null>) {
            state.winner = action.payload;
        },

        /**
     * 设置第一个玩家
     * @param state - 状态对象
     * @param action - 动作对象，包含第一个玩家状态的负载动作
     */
        setFirstPlayer (state, action: PayloadAction<boolean>) {
            state.firstPlayer = action.payload;
        },
        /**
     * 游戏配置更改,对棋盘尺寸，先手玩家，历史记录初始化
     * @param state 状态对象
     * @param action 设置游戏配置的动作
     */
        setGameConfig (state, action: PayloadAction<GameConfig>) {
            state.gameConfig = action.payload;
            state.boardSize = action.payload.boardSize;
            state.firstPlayer = true;
            state.history = [
                Array(action.payload.boardSize)
                    .fill(null)
                    .map(() => Array(action.payload.boardSize).fill(null)),
            ];
            state.winner = null;
        },
        /**
     * 改变棋盘大小，对先手玩家，历史记录初始化
     * @param state - 状态对象
     * @param action - 操作对象
     */
        setBoardSize (state, action: PayloadAction<number>) {
            state.boardSize = action.payload;
            state.winner = null;
            state.history = [
                Array(action.payload)
                    .fill(null)
                    .map(() => Array(action.payload).fill(null)),
            ];
        },
        /**
     * 设置历史记录
     * @param state - 状态对象
     * @param action - 动作对象，包含payload字段，payload是一个三维数组，每个元素是一个二维数组，每个二维数组包含了一行字符串或者null
     */
        setHistory (state, action: PayloadAction<(string | null)[][][]>) {
            state.history = action.payload;
        },
        /**
     * 棋盘状态变化
     * @param state 状态对象
     * @param action PayloadAction实例，包含变化后的棋盘数据
     */
        boardChange (state, action: PayloadAction<(string | null)[][]>) {
            // 将变化后的棋盘数据添加到历史记录中
            state.history = [...state.history, action.payload];
            // 切换下一位玩家
            state.firstPlayer = !state.firstPlayer;
        },
        /**
     * 设置玩家一
     * @param state 状态对象
     * @param action PayloadAction实例，包含玩家一的名字
     */
        setPlayerOne (state, action: PayloadAction<string>) {
            state.playerOne = action.payload;
        },
        /**
     * 设置玩家一
     * @param state 状态对象
     * @param action PayloadAction实例，包含玩家二的名字
     */
        setPlayerTwo (state, action: PayloadAction<string>) {
            state.playerTwo = action.payload;
        },
    },
});

export default gameStore.reducer;
export const {
    setWinner,
    setFirstPlayer,
    setGameConfig,
    setBoardSize,
    setHistory,
    boardChange,
    setPlayerOne,
    setPlayerTwo,
} = gameStore.actions;

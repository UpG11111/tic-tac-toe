/** 最小棋盘尺寸/原始尺寸 */
export const MIN_BOARD_SIZE: number = 3;
/** 最大棋盘尺寸 */
export const MAX_BOARD_SIZE: number = 19;

/** 游戏配置信息 */
export const GAME_CONFIG = {
    /** 井字棋 */
    TIC_TAC_TOE: {
        gameName: 'Tic Tac Toe',
        boardSize: 3,
        piece: ['X', 'O'],
        winCount: 3,
    },
    /** 五子棋 */
    GOBANG: {
        gameName: 'Gobang',
        boardSize: 19,
        piece: ['⚫', '⚪'],
        winCount: 5,
    },
};
/** 初始游戏类型 */
export const initialGameState = GAME_CONFIG.TIC_TAC_TOE;

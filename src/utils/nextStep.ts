import { initialGameState } from '../constants/gameConstants';

const { piece } = initialGameState;
const [xPiece, oPiece] = piece;
/**
 * 获取最佳移动
 * @param board 游戏棋盘
 * @returns 最佳移动的位置对象{x, y}
 */
export default function getBestMove (board: (string | null)[][], firstPlayer:boolean) {
    const bestMove = alphaBeta(board, -Infinity, Infinity, firstPlayer);
    return { xAxis: bestMove.xAxis, yAxis: bestMove.yAxis };
}

/**
 * Alpha-Beta剪枝算法核心函数
 * @param board 当前游戏棋盘
 * @param alpha Alpha值，当前搜索路径的最大得分下限
 * @param beta Beta值，当前搜索路径的最小得分上限
 * @param maximizingPlayer 是否为最大化玩家
 * @returns 包含得分和落子位置的对象
 */
function alphaBeta (
    board: (string | null)[][],
    alpha: number,
    beta: number,
    maximizingPlayer: boolean,
): { score: number, xAxis: number, yAxis: number } {
    const emptyCells = getEmptyCells(board);
    if (isWin(board, xPiece) || isWin(board, oPiece) || emptyCells.length === 0) {
        const score = evaluate(board);
        return { score, xAxis: -1, yAxis: -1 }; // 返回评估分数，坐标设置为无效值-1
    }
    let bestMove = maximizingPlayer
        ? { score: -Infinity, xAxis: 0, yAxis: 0 }
        : { score: Infinity, xAxis: 0, yAxis: 0 };

    for (let index = 0; index < emptyCells.length; index++) {
        const { xAxis, yAxis } = emptyCells[index];
        board[yAxis][xAxis] = maximizingPlayer ? xPiece : oPiece;
        const move = alphaBeta(board, alpha, beta, !maximizingPlayer);
        board[yAxis][xAxis] = null;
        move.xAxis = xAxis;
        move.yAxis = yAxis;

        if (maximizingPlayer) {
            if (move.score > bestMove.score) {
                bestMove = move;
            }
            alpha = Math.max(alpha, bestMove.score);
        } else {
            if (move.score < bestMove.score) {
                bestMove = move;
            }
            beta = Math.min(beta, bestMove.score);
        }
        if (beta <= alpha) {
            break;
        }
    }
    return bestMove;
}

/**
 * 获取空余格子
 * @param board 游戏棋盘
 * @returns 空余格子的移动列表
 */
function getEmptyCells (board: (string | null)[][]) {
    const emptyCells = [];
    for (let yAxis = 0; yAxis < 3; yAxis++) {
        for (let xAxis = 0; xAxis < 3; xAxis++) {
            if (!board[yAxis][xAxis]) {
                emptyCells.push({ xAxis, yAxis });
            }
        }
    }
    return emptyCells;
}

/**
 * 评估棋盘状态并返回得分
 * @param board 游戏棋盘
 * @returns 得分
 */
function evaluate (board: (string | null)[][]): number {
    if (isWin(board, xPiece)) {
        return Infinity;
    } else if (isWin(board, oPiece)) {
        return -Infinity;
    }
    return 0;
}

/**
 * 判断是否获胜
 * @param board 游戏棋盘
 * @param pieceStyle 棋子样式
 * @returns 是否获胜
 */
function isWin (board: (string | null)[][], pieceStyle: string) {
    const borderSize = board.length;
    let winner: string | null = null;
    // 所有需要检查的路径
    const winState = [
        ...board,
        ...board.map((__, rowIndex) => board.map(row => row[rowIndex])),
        [...Array(borderSize).keys()].map(index => board[index][index]),
        [...Array(borderSize).keys()].map(index => board[index][borderSize - 1 - index]),
    ];

    // 检查是否有胜利路径
    winState.some(path => {
        if (path.every(cell => cell === pieceStyle)) {
            winner = pieceStyle;
            return true; // 找到胜利者后提前结束循环
        }
        return false;
    });
    return winner;
}

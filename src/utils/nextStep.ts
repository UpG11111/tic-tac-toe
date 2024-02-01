import { initialGameState } from '../constants/gameConstants';
import isWin from './isWin';

/** 最小得分 */
const MIN_SCORE = -Infinity;
/** 最大得分 */
const MAX_SCORE = Infinity;
/** 平局得分 */
const TIED_SCORE = 0;
const { piece, winCount } = initialGameState;
const [xPiece, oPiece] = piece;
/**
 * 获取最佳移动
 * @param board 游戏棋盘
 * @returns 最佳移动的位置对象{x, y}
 */
export default function getBestMove (board: (string | null)[][], firstPlayer: boolean) {
    const bestMove = alphaBeta(board, MIN_SCORE, MAX_SCORE, firstPlayer);
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
    lastMove: [number, number] = [-1, -1],
): { score: number, xAxis: number, yAxis: number } {
    const emptyCells = getEmptyCells(board);
    const pieceStyle = maximizingPlayer ? oPiece : xPiece;
    const winner = isWin(board, lastMove, pieceStyle, winCount);
    let score;
    if (winner) {
        score = pieceStyle === xPiece ? MAX_SCORE : MIN_SCORE;
        return { score, xAxis: -1, yAxis: -1 };
    } else if (emptyCells.length === 0) {
        score = TIED_SCORE;
        return { score, xAxis: -1, yAxis: -1 };
    }
    let bestMove = maximizingPlayer
        ? { score: MIN_SCORE, xAxis: -1, yAxis: -1 }
        : { score: MAX_SCORE, xAxis: -1, yAxis: -1 };
    for (let index = 0; index < emptyCells.length; index++) {
        const { xAxis, yAxis } = emptyCells[index];
        board[yAxis][xAxis] = maximizingPlayer ? xPiece : oPiece;
        const move = alphaBeta(board, alpha, beta, !maximizingPlayer, [yAxis, xAxis]);
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

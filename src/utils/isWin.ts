/**
 * 判断是否获胜
 * @param board 游戏棋盘
 * @param lastMove 落子的位置
 * @param pieceStyle 棋子样式
 * @param winCount 获胜所需次数
 * @returns 是否获胜
 */
export default function isWin (
    board: (string | null)[][],
    lastMove: [number, number],
    pieceStyle: string,
    winCount: number
): boolean {
    // 四个方向
    const directions = [
        [1, 0],
        [0, 1],
        [1, 1],
        [1, -1],
    ];
    for (const direction of directions) {
        const count1 = calculateCount(direction, board, lastMove, pieceStyle);
        // 反方向上的相同棋子数量
        const reverseDirection = [direction[0] * -1, direction[1] * -1];
        const count2 = calculateCount(reverseDirection, board, lastMove, pieceStyle);
        if (count1 + count2 - 1 >= winCount) {
            return true;
        }
    }
    return false;
}
/**
 * 计算连子数量
 * @param direction 方向
 * @param board 游戏棋盘
 * @param lastMove 落子位置
 * @param pieceStyle 棋子样式
 * @returns 相同棋子数量
 */
function calculateCount (
    direction: number[],
    board: (string | null)[][],
    lastMove: [number, number],
    pieceStyle: string,
) {
    let count = 0;
    let [row, col] = lastMove;

    while (
        row >= 0 && col >= 0 &&
        row < board.length && col < board[0].length &&
        board[row][col] === pieceStyle
    ) {
        row += direction[0];
        col += direction[1];
        count += 1;
    }
    return count;
}

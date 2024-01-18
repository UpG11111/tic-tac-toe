type PiecePoint = [number, number];
type MovementFunction = (lastMove: PiecePoint) => PiecePoint;

/**
 * 判断移动是否有效
 * @param board 棋盘二维数组，每个元素为字符串或null
 * @param lastMove 落子的坐标
 * @param pieceStyle 当前玩家的棋子样式
 * @returns 如果上一次移动有效返回true，否则返回false
 */
function isValid (
    board: (string | null)[][],
    lastMove: [number, number],
    pieceStyle: string,
): boolean {
    const [xAxis, yAxis] = lastMove;
    return (
        xAxis >= 0 &&
        xAxis < board.length &&
        yAxis >= 0 &&
        yAxis < board[0].length &&
        board[xAxis][yAxis] === pieceStyle
    );
}
/**
 * 计算连子数量
 *
 * @param p1Movement 第一个指针
 * @param p2Movement 第二个指针
 * @param board 游戏棋盘
 * @param lastMove 落子位置
 * @param pieceStyle 棋子样式
 * @param winCount 胜利所需数量
 * @returns 是否获胜
 */
function calculateCount (
    p1Movement: MovementFunction,
    p2Movement: MovementFunction,
) {
    return function innerCount (
        board: (string | null)[][],
        lastMove: [number, number],
        pieceStyle: string,
        winCount: number,
    ): boolean {
        let count = 1;
        let p1 = p1Movement(lastMove);
        let p2 = p2Movement(lastMove);
        while (count) {
            let p1Changed = false;
            let p2Changed = false;
            if (isValid(board, p1, pieceStyle)) {
                count += 1;
                p1 = p1Movement(p1);
                p1Changed = true;
            }
            if (isValid(board, p2, pieceStyle)) {
                count += 1;
                p2 = p2Movement(p2);
                p2Changed = true;
            }
            if (count >= winCount) {
                return true;
            }
            if (!p1Changed && !p2Changed) {
                return false;
            }
        }
        return false;
    };
}

const transverse = calculateCount(
    ([xAxis, yAxis]) => [xAxis, yAxis - 1],
    ([xAxis, yAxis]) => [xAxis, yAxis + 1],
);
const direction = calculateCount(
    ([xAxis, yAxis]) => [xAxis - 1, yAxis],
    ([xAxis, yAxis]) => [xAxis + 1, yAxis],
);
const slash = calculateCount(
    ([xAxis, yAxis]) => [xAxis - 1, yAxis - 1],
    ([xAxis, yAxis]) => [xAxis + 1, yAxis + 1],
);
const backSlash = calculateCount(
    ([xAxis, yAxis]) => [xAxis - 1, yAxis + 1],
    ([xAxis, yAxis]) => [xAxis + 1, yAxis - 1],
);

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
    winCount: number,
) {
    return (
        transverse(board, lastMove, pieceStyle, winCount) ||
        direction(board, lastMove, pieceStyle, winCount) ||
        slash(board, lastMove, pieceStyle, winCount) ||
        backSlash(board, lastMove, pieceStyle, winCount)
    );
}

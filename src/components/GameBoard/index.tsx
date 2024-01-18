import isWin from '../../utils/isWin.ts';
import GameSquare from './GameSquare/index.tsx';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/index.ts';
import { boardChange, setWinner } from '../../store/modules/game.ts';
import { useCallback } from 'react';

/**
 * 游戏棋盘组件
 * @component
 */
const GameBoard: React.FC = () => {
    const boardSize = useSelector((state:RootState) => state.game.boardSize);
    const firstPlayer = useSelector((state:RootState) => state.game.firstPlayer);
    const winner = useSelector((state:RootState) => state.game.winner);
    const gameConfig = useSelector((state:RootState) => state.game.gameConfig);
    const history = useSelector((state:RootState) => state.game.history);

    const dispatch = useDispatch();

    const currentBoard: (string | null)[][] = history[history.length - 1];
    /**
     * 获取下一个棋子的位置
     * @param player 当前玩家标识，true表示玩家1，false表示玩家2
     * @returns 下一个棋子的名称
     */
    function getNextChess (player: boolean): string {
        return player ? gameConfig.piece[0] : gameConfig.piece[1];
    }

    /**
     * 处理方块点击事件
     *
     * @param {number} row - 被点击的棋盘行索引
     * @param {number} col - 被点击的棋盘列索引
     */
    const handleSquareClick = useCallback((row: number, col: number) => {
        if (currentBoard[row][col] || winner) {
            return;
        }
        // 创建一个新的棋盘状态数组，并设置当前位置为下一步棋子
        const nextBoard = currentBoard.map((boardRow) => [...boardRow]);
        const nextChess = getNextChess(firstPlayer);
        nextBoard[row][col] = nextChess;
        // 更新棋盘状态
        dispatch(boardChange(nextBoard));
        if (isWin(nextBoard, [row, col], nextChess, gameConfig.winCount)) {
            dispatch(setWinner(`${nextChess}获胜`));
        } else if (nextBoard.every((subArray) => subArray.every((item) => item !== null,))) {
            dispatch(setWinner('平局'));
        }
    }, []);

    // 当前状态信息
    let status: string;
    if (winner) {
        status = winner;
    } else {
        status = `下一步：${getNextChess(firstPlayer)}`;
    }

    return (
        <>
            <div className="status">{status}</div>
            <div className="board">
                {Array.from({ length: boardSize }, (__, rowIndex) => (
                    <div className="boardRow" key={rowIndex}>
                        {Array.from({ length: boardSize }, (__, colIndex) => (
                            <GameSquare
                                key={`${rowIndex}-${colIndex}`}
                                squareValue={currentBoard[rowIndex]?.[colIndex]}
                                onSquareClick={() => handleSquareClick(rowIndex, colIndex)}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </>

    );
};
export default GameBoard;

import { memo } from 'react';

interface GameSquareProps {
    squareValue: string | null;
    onSquareClick: Function;
    row: number;
    col: number;
}
/**
 * 游戏方块组件
 * @param squareValue - 棋盘格的值
 * @param onSquareClick - 点击方块时的回调函数
 * @returns
 */
const GameSquare = ({ squareValue, onSquareClick, row, col }:GameSquareProps) => {
    /**
     * 点击方格时的回调函数
     * @returns {void}
     */
    const handleSquareClick = () => {
        onSquareClick(row, col);
    };
    return (
        <span className="square" onClick={handleSquareClick}>
            {squareValue}
        </span>
    );
};

export default memo(GameSquare);

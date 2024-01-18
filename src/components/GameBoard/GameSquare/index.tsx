import { memo } from 'react';

interface GameSquareProps {
    squareValue: string | null;
    onSquareClick: () => void;
}
/**
 * 游戏方块组件
 * @param squareValue - 棋盘格的值
 * @param onSquareClick - 点击方块时的回调函数
 */
const GameSquare: React.FC<GameSquareProps> = (({ squareValue, onSquareClick }) => {
    console.log(1);
    return (
        <span className="square" onClick={onSquareClick}>
            {squareValue}
        </span>
    );
});

export default memo(GameSquare);

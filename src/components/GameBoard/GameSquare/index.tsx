import { PureComponent } from 'react';

interface GameSquareProps {
    squareValue: string | null;
    onSquareClick: Function;
    row:number;
    col:number;
    isAI:boolean;
}

class GameSquare extends PureComponent<GameSquareProps> {
    render () {
        const { squareValue, onSquareClick, row, col, isAI } = this.props;
        return (
            <span className="square" onClick={() => onSquareClick(row, col, isAI)}>
                {squareValue}
            </span>
        );
    }
}

export default (GameSquare);

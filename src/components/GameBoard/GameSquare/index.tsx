import { PureComponent } from 'react';

interface GameSquareProps {
    squareValue: string | null;
    onSquareClick: Function;
    row:number;
    col:number;
}

class GameSquare extends PureComponent<GameSquareProps> {
    render () {
        const { squareValue, onSquareClick, row, col } = this.props;
        return (
            <span className="square" onClick={() => onSquareClick(row, col)}>
                {squareValue}
            </span>
        );
    }
}

export default (GameSquare);

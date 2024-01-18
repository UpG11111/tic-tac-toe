import { Component } from 'react';

interface GameSquareProps {
    squareValue: string | null;
    onSquareClick: () => void;
}

class GameSquare extends Component<GameSquareProps> {
    render () {
        console.log(1);
        return (
            <span className="square" onClick={this.props.onSquareClick}>
                {this.props.squareValue}
            </span>
        );
    }
}

export default (GameSquare);


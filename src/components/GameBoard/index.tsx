import { Component } from 'react';
import { connect } from 'react-redux';
import isWin from '../../utils/isWin.ts';
import GameSquare from './GameSquare/index.tsx';
import { RootState } from '../../store/index';
import { Dispatch } from 'redux';
import { boardChange, setWinner } from '../../store/modules/game.ts';

interface PropsFromState {
    boardSize: number;
    firstPlayer: boolean;
    winner: string | null;
    gameConfig: any; // 根据实际类型填充此处
    history: (string | null)[][][];
}

type DispatchProps = {
    dispatchBoardChange: (nextBoard: (string | null)[][]) => void;
    dispatchSetWinner: (winner: string) => void;
}

type AllProps = PropsFromState & DispatchProps

class GameBoard extends Component<AllProps> {
    constructor (props: AllProps) {
        super(props);
        this.handleSquareClick = this.handleSquareClick.bind(this);
    }

    /**
     * 1
     * @param player 1
     * @returns
     */
    getNextChess (player: boolean): string {
        return player
            ? this.props.gameConfig.piece[0]
            : this.props.gameConfig.piece[1];
    }

    // eslint-disable-next-line require-jsdoc-except/require-jsdoc
    handleSquareClick (row: number, col: number) {
        const {
            dispatchBoardChange,
            dispatchSetWinner,
            firstPlayer,
            history,
            gameConfig,
        } = this.props;

        if (history[history.length - 1][row]?.[col] || this.props.winner) {
            return;
        }

        const nextBoard = history[history.length - 1].map((boardRow) => [
            ...boardRow,
        ]);
        const nextChess = this.getNextChess(firstPlayer);
        nextBoard[row][col] = nextChess;

        dispatchBoardChange(nextBoard);
        if (isWin(nextBoard, [row, col], nextChess, gameConfig.winCount)) {
            dispatchSetWinner(`${nextChess}获胜`);
        } else if (
            nextBoard.every((subArray) => subArray.every((item) => item !== null))
        ) {
            dispatchSetWinner('平局');
        }
    }

    renderStatus () {
        let status: string;
        if (this.props.winner) {
            status = this.props.winner;
        } else {
            status = `下一步：${this.getNextChess(this.props.firstPlayer)}`;
        }

        return <div className="status">{status}</div>;
    }

    renderSquares () {
        const { boardSize, history } = this.props;

        return Array.from({ length: boardSize }, (__, rowIndex) => (
            <div className="boardRow" key={rowIndex}>
                {Array.from({ length: boardSize }, (__, colIndex) => (
                    <GameSquare
                        key={`${rowIndex}-${colIndex}`}
                        squareValue={history[history.length - 1][rowIndex]?.[colIndex]}
                        onSquareClick={() => this.handleSquareClick(rowIndex, colIndex)}
                    />
                ))}
            </div>
        ));
    }

    render () {
        return (
            <>
                {this.renderStatus()}
                <div className="board">{this.renderSquares()}</div>
            </>
        );
    }
}
/**
 * 1. 通过 connect() 创建一个容器组件，它会接收 state 和 dispatch 作为 props
 * 2. 通过 connect() 创建的容器组件会接收组件的 props，然后通过 mapStateToProps 和 mapDispatchToProps 将 props 传递给组件
 */
const mapStateToProps = (state: RootState): PropsFromState => ({
    boardSize: state.game.boardSize,
    firstPlayer: state.game.firstPlayer,
    winner: state.game.winner,
    gameConfig: state.game.gameConfig,
    history: state.game.history,
});
/**
 * 1. 通过 connect() 创建一个容器组件，它会接收 state 和 dispatch 作为 props
 * 2. 通过 connect() 创建的容器组件会接收组件的 props，然后通过 mapStateToProps 和 mapDispatchToProps 将 props 传递给组件
 */
const mapDispatchToProps = (dispatch: Dispatch) => ({
    dispatchBoardChange: (nextBoard: (string | null)[][]) =>
        dispatch(boardChange(nextBoard)),
    dispatchSetWinner: (winner: string) => dispatch(setWinner(winner)),
});

export default connect(mapStateToProps, mapDispatchToProps)(GameBoard);

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
     * 获取下一棋子样式
     * @param player
     * @returns string
     */
    getNextChess (player: boolean): string {
        return player
            ? this.props.gameConfig.piece[0]
            : this.props.gameConfig.piece[1];
    }

    /**
     * 处理方块点击事件的处理函数
     * @param {number} row - 点击的棋盘行索引
     * @param {number} col - 点击的棋盘列索引
    */
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
 * 将全局 Redux 状态映射到组件 Props 的函数。
 *
 * @param { RootState } state - 应用程序的根状态对象。
 * @returns { PropsFromState } - 映射后的 Props 对象，包含以下属性：
 * @returns { number } boardSize - 游戏棋盘大小。
 * @returns { PlayerType } firstPlayer - 游戏中第一个玩家的类型或标识。
 * @returns { PlayerType | null } winner - 当前游戏的获胜者，若无则为 null。
 * @returns { GameConfig } gameConfig - 游戏配置对象。
 * @returns { HistoryItem[] } history - 游戏历史记录数组。
 */
const mapStateToProps = (state: RootState): PropsFromState => ({
    boardSize: state.game.boardSize,
    firstPlayer: state.game.firstPlayer,
    winner: state.game.winner,
    gameConfig: state.game.gameConfig,
    history: state.game.history,
});

/**
 * 将action creator映射到dispatch函数上的函数
 * @param {Dispatch} dispatch - Redux store中的dispatch函数
 * @returns {Object} - 一个包含dispatch函数的方法对象
 */
const mapDispatchToProps = (dispatch: Dispatch) => ({
    /**
     * 发送boardChange action的函数
     * @param {(string | null)[][]} nextBoard - 下一个棋盘状态
     */
    dispatchBoardChange: (nextBoard: (string | null)[][]) =>
        dispatch(boardChange(nextBoard)),
    /**
     * 发送setWinner action的函数
     * @param {string} winner - 胜利者
     */
    dispatchSetWinner: (winner: string) => dispatch(setWinner(winner)),
});

export default connect(mapStateToProps, mapDispatchToProps)(GameBoard);

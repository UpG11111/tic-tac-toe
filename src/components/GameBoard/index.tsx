import { Component, } from 'react';
import { connect } from 'react-redux';
import isWin from '../../utils/isWin';
import GameSquare from './GameSquare';
import { RootState } from '../../store/index';
import { Dispatch } from 'redux';
import { boardChange, setWinner, setGameConfig, setFirstPlayer, setHistory } from '../../store/modules/game';
import nextStep from '../../utils/nextStep';
import { GAME_CONFIG } from '../../constants/gameConstants';
interface PropsFromState {
    boardSize: number;
    firstPlayer: boolean;
    winner: string | null;
    gameConfig: any;
    history: (string | null)[][][];
}

interface DispatchProps {
    dispatchBoardChange: (nextBoard: (string | null)[][]) => void;
    dispatchSetWinner: (winner: string|null) => void;
    dispatchSetGameConfig: (config: any) => void;
    dispatchSetHistory: (history: (string | null)[][][]) => void;
    dispatchSetFirstPlayer: (player: boolean) => void;
}

interface State {
    aiBattle: 'first' | 'second' | null;
    isAi: boolean;
    currentPlayer: 'playerOne'|'playerTwo';
}

type AllProps = PropsFromState & DispatchProps;

class GameBoard extends Component<AllProps, State> {
    constructor (props: AllProps) {
        super(props);
        this.state = {
            aiBattle: null,
            isAi: true,
            currentPlayer: 'playerOne',
        };
        this.handleSquareClick = this.handleSquareClick.bind(this);
        this.handleAIPlacement = this.handleAIPlacement.bind(this);
        this.chessController = this.chessController.bind(this);
    }

    /**
     * 下棋控制器
     */
    async chessController (row:number, col:number) {
        const { isAi, aiBattle, currentPlayer } = this.state;
        console.log(currentPlayer, isAi, [row, col], aiBattle);
        if (aiBattle === 'first') {
            if (currentPlayer === 'playerOne' && isAi) {
                this.handleSquareClick(row, col);
                this.setState({ isAi: false, currentPlayer: 'playerTwo' });
            }
            if (currentPlayer === 'playerTwo' && !isAi) {
                this.handleSquareClick(row, col);
                setTimeout(() => {
                    this.handleAIPlacement();
                }, 1000);
                this.setState({ currentPlayer: 'playerOne' });
            }
        }
        if (aiBattle === 'second') {
            if (currentPlayer === 'playerOne' && !isAi) {
                this.handleSquareClick(row, col);
                await setTimeout(() => {
                    this.handleAIPlacement();
                }, 1000);
            }
            if (currentPlayer === 'playerTwo' && isAi) {
                this.handleSquareClick(row, col);
                this.setState({ isAi: false });
            }
        }

        if (!aiBattle) {
            this.handleSquareClick(row, col);
        }
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
    async handleSquareClick (row: number, col: number) {
        const {
            dispatchBoardChange,
            dispatchSetWinner,
            firstPlayer,
            winner,
            history,
            gameConfig,
        } = this.props;
        if (history[history.length - 1][row]?.[col] || winner) {
            return;
        }

        const nextBoard = history[history.length - 1].map((boardRow) => [
            ...boardRow.map((cell) => cell),
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

    /**
     * AI下棋
     * @param {Array} nextBoard - 下一步棋盘
     */
    handleAIPlacement () {
        const { history, firstPlayer } = this.props;
        this.setState({ isAi: true }, () => {
            const aiNextStep = nextStep(history[history.length - 1].map((boardRow) => [
                ...boardRow.map((cell) => cell),
            ]), firstPlayer);
            if (aiNextStep) {
                const { xAxis, yAxis } = aiNextStep;
                this.chessController(yAxis, xAxis);
            }
        });
    }

    aiFirstClick = () => {
        this.props.dispatchSetGameConfig(GAME_CONFIG.TIC_TAC_TOE);
        this.setState({ aiBattle: 'first' }, () => {
            this.handleAIPlacement();
        });
    }

    aiSecondClick = () => {
        this.setState({ aiBattle: 'second', isAi: false });
    }

    /**
     * 跳转到指定索引位置
     * @param index 回退记录的索引
     */
    jumpTo = async (index: number) => {
        this.props.dispatchSetFirstPlayer(index % 2 === 0);
        this.props.dispatchSetHistory([...this.props.history.slice(0, index + 1)]);
        if (index < this.props.history.length - 1) {
            this.props.dispatchSetWinner(null);
        }
        if (this.state.aiBattle === 'first' && index % 2 === 0) {
            this.setState({ currentPlayer: 'playerOne' });
            
            console.log(this.state.currentPlathis.handleAIPlacement();yer, this.props.history);
        }
        if (this.state.aiBattle === 'second' && index % 2 === 1) {
            this.setState({ currentPlayer: 'playerTwo' });
            this.handleAIPlacement();
        }
    }

    // 历史记录表
    renderMoves () {
        return this.props.history.map((__, index) => {
            let description: string;
            if (index) {
                description = `第${index}步`;
            } else {
                description = '重新开始';
            }
            return (
                <li key={index}>
                    <button onClick={() => this.jumpTo(index)} className="historyButton">
                        {description}
                    </button>
                </li>
            );
        });
    }

    renderStatus () {
        let status: string;
        if (this.props.winner) {
            status = this.props.winner;
        } else {
            status = `下一步：${this.getNextChess(this.props.firstPlayer)}`;
        }

        return (
            <>
                {/* <button onClick={() => this.aiFirstClick()}>AI对战(AI先手)</button>
                <button onClick={() => this.aiSecondClick()}>AI对战(AI后手)</button> */}
                <div>
                    <label>
                        <input
                            type="radio"
                            name="ai-battle-type"
                            value="first"
                            checked={this.state.aiBattle === 'first'}
                            onChange={this.aiFirstClick}
                        />
                        AI对战(AI先手)
                    </label>
                    <br />
                    <label>
                        <input
                            type="radio"
                            name="ai-battle-type"
                            value="second"
                            checked={this.state.aiBattle === 'second'}
                            onChange={this.aiSecondClick}
                        />
                        AI对战(AI后手)
                    </label>
                </div>
                <div className="status">{status}</div>
            </>
        );
    }

    renderSquares () {
        const { boardSize, history } = this.props;

        return Array.from({ length: boardSize }, (__, rowIndex) => (
            <div className="boardRow" key={rowIndex}>
                {Array.from({ length: boardSize }, (__, colIndex) => (
                    <GameSquare
                        key={`${rowIndex}-${colIndex}`}
                        row={rowIndex}
                        col={colIndex}
                        squareValue={history[history.length - 1][rowIndex]?.[colIndex]}
                        onSquareClick={this.chessController}
                    />
                ))}
            </div>
        ));
    }

    render () {
        return (
            <>
                <ol>{this.renderMoves()}</ol>
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
 * @returns { string } playerOne - 游戏中第一个玩家
 * @returns { string } playerTwo - 游戏中第二个玩家
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
    dispatchBoardChange: (nextBoard: (string | null)[][]) =>
        dispatch(boardChange(nextBoard)),
    dispatchSetWinner: (winner: string|null) => dispatch(setWinner(winner)),
    dispatchSetGameConfig: (config: any) => dispatch(setGameConfig(config)),
    dispatchSetFirstPlayer: (player: boolean) => dispatch(setFirstPlayer(player)),
    dispatchSetHistory: (history: (string | null)[][][]) =>
        dispatch(setHistory(history)),
});

export default connect(mapStateToProps, mapDispatchToProps)(GameBoard);

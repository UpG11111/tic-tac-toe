import { Component, } from 'react';
import { connect } from 'react-redux';
import isWin from '../../utils/isWin';
import GameSquare from './GameSquare';
import { RootState } from '../../store/index';
import { Dispatch } from 'redux';
import { boardChange, setWinner, setGameConfig, setFirstPlayer, setHistory, } from '../../store/modules/game';
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
    dispatchSetWinner: (winner: string | null) => void;
    dispatchSetGameConfig: (config: any) => void;
    dispatchSetHistory: (history: (string | null)[][][]) => void;
    dispatchSetFirstPlayer: (player: boolean) => void;
}

interface State {
    aiBattle: 'first' | 'second' | null;
    isAi: boolean;
    timer: NodeJS.Timeout | null;
    currentPlayer: 'playerOne' | 'playerTwo';
}

type AllProps = PropsFromState & DispatchProps;

/** 下棋延时时间 */
const delayTime: number = 1000;

class GameBoard extends Component<AllProps, State> {
    constructor (props: AllProps) {
        super(props);
        this.state = {
            aiBattle: null,
            isAi: true,
            currentPlayer: 'playerOne',
            timer: null,
        };
        this.handleSquareClick = this.handleSquareClick.bind(this);
        this.handleAIPlacement = this.handleAIPlacement.bind(this);
        this.chessController = this.chessController.bind(this);
    }

    /**
     * 下棋控制器
     * @param row 行
     * @param col 列
     */
    chessController (row: number, col: number) {
        const { history, winner } = this.props;
        if (history[history.length - 1][row]?.[col] || winner) {
            return;
        }
        const { isAi, aiBattle, currentPlayer } = this.state;
        // ai先手模式
        if (aiBattle === 'first') {
            // ai落子
            if (currentPlayer === 'playerOne' && isAi) {
                this.handleSquareClick(row, col);
                this.setState({ isAi: false, currentPlayer: 'playerTwo' });
            }
            // 玩家落子，且调用ai
            if (currentPlayer === 'playerTwo' && !isAi) {
                this.handleSquareClick(row, col);
                this.handleAIPlacement();
                this.setState({ currentPlayer: 'playerOne' });
            }
        }
        // ai后手模式
        if (aiBattle === 'second') {
            // 玩家落子，且调用ai
            if (currentPlayer === 'playerOne' && !isAi) {
                this.handleSquareClick(row, col);
                this.handleAIPlacement();
                this.setState({ currentPlayer: 'playerTwo' });
            }
            // ai落子
            if (currentPlayer === 'playerTwo' && isAi) {
                this.handleSquareClick(row, col);
                this.setState({ isAi: false, currentPlayer: 'playerOne' });
            }
        }
        // 无ai模式
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
     * 落子事件的处理函数
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
     * AI计算落子位置
     */
    handleAIPlacement () {
        const timeout = setTimeout(() => {
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
            clearTimeout(this.state.timer as NodeJS.Timeout);
        }, delayTime);
        this.setState({ timer: timeout });
    }

    /**
     * AI先手模式
     */
    aiFirstMode = () => {
        this.props.dispatchSetGameConfig(GAME_CONFIG.TIC_TAC_TOE);
        this.setState({ aiBattle: 'first', currentPlayer: 'playerOne', isAi: false });
        this.handleAIPlacement();
    }

    /**
     * AI后手模式
     */
    aiSecondMode = () => {
        this.props.dispatchSetGameConfig(GAME_CONFIG.TIC_TAC_TOE);
        clearTimeout(this.state.timer as NodeJS.Timeout);
        this.setState({ aiBattle: 'second', isAi: false, currentPlayer: 'playerOne' });
        this.setState({ currentPlayer: 'playerOne' });
    }

    /**
     * 跳转到指定索引位置
     * @param index 回退记录的索引
     */
    jumpTo = (index: number): void => {
        this.props.dispatchSetFirstPlayer(index % 2 === 0);
        this.props.dispatchSetHistory([...this.props.history.slice(0, index + 1)]);
        clearTimeout(this.state.timer as NodeJS.Timeout);
        if (index < this.props.history.length - 1) {
            this.props.dispatchSetWinner(null);
        }
        this.setState({ currentPlayer: index % 2 === 0 ? 'playerOne' : 'playerTwo' });
        if (index % 2 === 0 && this.state.aiBattle === 'first') {
            this.handleAIPlacement();
        }
        if (index % 2 === 1 && this.state.aiBattle === 'second') {
            this.handleAIPlacement();
        }
    }

    // 渲染历史记录表
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

    // 渲染游戏状态
    renderStatus () {
        let status: string;
        if (this.props.winner) {
            status = this.props.winner;
        } else {
            status = `下一步：${this.getNextChess(this.props.firstPlayer)}`;
        }
        return (
            <div className="status">
                <label>
                    <input
                        type="radio"
                        name="ai-battle-type"
                        value="first"
                        checked={this.state.aiBattle === 'first'}
                        onChange={() => this.aiFirstMode()}
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
                        onChange={() => this.aiSecondMode()}
                    />
                        AI对战(AI后手)
                </label>
                <div>{status}</div>
            </div>
        );
    }

    // 棋盘
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
                <div className="board">{this.renderStatus()}{this.renderSquares()}</div>
                <div className='historyList'><ol>{this.renderMoves()}</ol></div>
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
    dispatchBoardChange: (nextBoard: (string | null)[][]) =>
        dispatch(boardChange(nextBoard)),
    dispatchSetWinner: (winner: string | null) => dispatch(setWinner(winner)),
    dispatchSetGameConfig: (config: any) => dispatch(setGameConfig(config)),
    dispatchSetFirstPlayer: (player: boolean) => dispatch(setFirstPlayer(player)),
    dispatchSetHistory: (history: (string | null)[][][]) =>
        dispatch(setHistory(history)),
});

export default connect(mapStateToProps, mapDispatchToProps)(GameBoard);

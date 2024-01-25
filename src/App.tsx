import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    setWinner,
    setBoardSize,
    setFirstPlayer,
    setGameConfig,
    setHistory,
} from './store/modules/game';
import { Dispatch } from 'redux';
import { RootState } from './store/index';
import './styles/index.css';
import GameBoard from './components/GameBoard';
import {
    MAX_BOARD_SIZE,
    MIN_BOARD_SIZE,
    GAME_CONFIG,
} from './constants/gameConstants.ts';

/** 游戏类型 */
type GameOption = keyof typeof GAME_CONFIG

interface State {
    inputVal: number | string;
    aiBattle: 'first' | 'second' |null;
    selectedGame: GameOption;
}

interface PropsFromState {
    boardSize: number;
    firstPlayer: boolean;
    winner: string | null;
    gameConfig: any;
    history: (string | null)[][][];
}

interface PropsFromDispatch {
    dispatchSetWinner: (winner: string | null) => void;
    dispatchSetBoardSize: (size: number) => void;
    dispatchSetFirstPlayer: (player: boolean) => void;
    dispatchSetGameConfig: (config: any) => void; // 根据实际类型填充此处
    dispatchSetHistory: (history: (string | null)[][][]) => void;
}

type AppProps = PropsFromState & PropsFromDispatch

class App extends Component<AppProps, State> {
    constructor (props: AppProps) {
        super(props);
        this.state = {
            inputVal: props.boardSize,
            aiBattle: null,
            selectedGame: Object.keys(GAME_CONFIG)[0] as GameOption,
        };
    }

    /**
     * 游戏选项更改函数
     * @param  event - HTML select元素的变化事件。
     */
    handleGameChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedGame: GameOption = event.target.value as GameOption;
        this.setState({ selectedGame });
        this.props.dispatchSetGameConfig(GAME_CONFIG[selectedGame]);
        this.setState({ inputVal: GAME_CONFIG[selectedGame].boardSize });
        this.setState({ aiBattle: null });
    }

    /**
     * 棋盘大小输入框的值更改事件处理
     * @param event - HTML input元素的变化事件。
     */
    boardSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue: number = parseInt(event.target.value, 10);
        if (inputValue >= MIN_BOARD_SIZE && inputValue <= MAX_BOARD_SIZE) {
            this.props.dispatchSetBoardSize(inputValue);
            this.setState({ inputVal: inputValue });
            this.setState({ aiBattle: null });
        } else {
            this.setState({ inputVal: this.props.boardSize });
        }
    }

    /**
     * 跳转到指定索引位置
     * @param index 回退记录的索引
     */
    jumpTo = (index: number): void => {
        this.props.dispatchSetFirstPlayer(index % 2 === 0);
        this.props.dispatchSetHistory([...this.props.history.slice(0, index + 1)]);
        if (index < this.props.history.length - 1) {
            this.props.dispatchSetWinner(null);
        }
    }

    /**
     * AI对战先手点击事件
     */
    aiFirstClick () {
        this.setState({ aiBattle: 'first', selectedGame: 'TIC_TAC_TOE' });
        this.props.dispatchSetGameConfig(GAME_CONFIG.TIC_TAC_TOE);
        this.setState({ inputVal: GAME_CONFIG.TIC_TAC_TOE.boardSize });
    }

    /**
     * AI对战后手点击事件
     */
    aiSecond () {
        this.setState({ aiBattle: 'second', selectedGame: 'TIC_TAC_TOE' });
        this.props.dispatchSetGameConfig(GAME_CONFIG.TIC_TAC_TOE);
        this.setState({ inputVal: GAME_CONFIG.TIC_TAC_TOE.boardSize });
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

    render () {
        return (
            <div className="game">
                <div>
                    {/* 游戏选项 */}
                    <label htmlFor="gameSelect">游戏类型:</label>
                    <select id="gameSelect" value={this.state.selectedGame} onChange={this.handleGameChange}>
                        {Object.keys(GAME_CONFIG).map((item, index) => (
                            <option key={index} value={item}>
                                {GAME_CONFIG[item as GameOption].gameName}
                            </option>
                        ))}
                    </select>
                    <button onClick={() => this.aiFirstClick()}>AI对战(AI先手)</button>
                    <button onClick={() => this.aiSecond()}>AI对战(AI后手)</button>
                    {/* 棋盘大小输入框 */}
                    <div className="gameHistory">
                        棋盘大小：
                        <input
                            type="number"
                            value={this.state.inputVal}
                            onBlur={this.boardSizeChange}
                            onChange={(event) =>
                                this.setState({ inputVal: event.target.value })
                            }
                            min={MIN_BOARD_SIZE}
                            max={MAX_BOARD_SIZE}
                        />
                        <ol>{this.renderMoves()}</ol>
                    </div>
                </div>

                {/* 游戏棋盘 */}
                <div className="gameBoard">
                    <GameBoard aiBattle={this.state.aiBattle} />
                </div>
            </div>
        );
    }
}
/**
 * 处理store数据
 * @param state {RootState}
 * @returns {PropsFromState}
 */
const mapStateToProps = (state: RootState): PropsFromState => ({
    boardSize: state.game.boardSize,
    firstPlayer: state.game.firstPlayer,
    winner: state.game.winner,
    gameConfig: state.game.gameConfig,
    history: state.game.history,
});
/**
 * 处理store方法
 * @param dispatch {Dispatch}
 * @returns {PropsFromDispatch}
 */
const mapDispatchToProps = (dispatch: Dispatch) => ({
    dispatchSetWinner: (winner: string|null) => dispatch(setWinner(winner)),
    dispatchSetBoardSize: (size: number) => dispatch(setBoardSize(size)),
    dispatchSetFirstPlayer: (player: boolean) => dispatch(setFirstPlayer(player)),
    dispatchSetGameConfig: (config: any) => dispatch(setGameConfig(config)),
    dispatchSetHistory: (history: (string | null)[][][]) =>
        dispatch(setHistory(history)),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);

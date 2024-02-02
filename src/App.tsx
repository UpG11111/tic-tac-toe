import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    setWinner,
    setBoardSize,
    setFirstPlayer,
    setGameConfig,
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
    dispatchSetGameConfig: (config: any) => void;
}

type AppProps = PropsFromState & PropsFromDispatch

class App extends Component<AppProps, State> {
    constructor (props: AppProps) {
        super(props);
        this.state = {
            inputVal: props.boardSize,
            selectedGame: Object.keys(GAME_CONFIG)[0] as GameOption,
        };
    }

    /**
     *组件更新时调用
     * @param prevProps - 上次组件的props。
     */
    componentDidUpdate (prevProps: AppProps) {
        if (prevProps !== this.props) {
            this.setState({ inputVal: this.props.boardSize, selectedGame: this.props.gameConfig.gameName });
        }
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
        } else {
            this.setState({ inputVal: this.props.boardSize });
        }
    }

    render () {
        return (
            <div className="game">
                <div className='gameInfo'>
                    {/* 游戏选项 */}
                    <label htmlFor="gameSelect">游戏类型：</label>
                    <select id="gameSelect" value={this.state.selectedGame} onChange={this.handleGameChange}>
                        {Object.keys(GAME_CONFIG).map((item, index) => (
                            <option key={index} value={item}>
                                {GAME_CONFIG[item as GameOption].gameName}
                            </option>
                        ))}
                    </select>
                    {/* 棋盘大小输入框 */}
                    <div className="sizeInput">
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
                    </div>
                </div>

                {/* 游戏棋盘 */}
                <div className="gameBoard">
                    <GameBoard />
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
const mapDispatchToProps = (dispatch: Dispatch): PropsFromDispatch => ({
    dispatchSetWinner: (winner: string | null) => dispatch(setWinner(winner)),
    dispatchSetBoardSize: (size: number) => dispatch(setBoardSize(size)),
    dispatchSetFirstPlayer: (player: boolean) => dispatch(setFirstPlayer(player)),
    dispatchSetGameConfig: (config: any) => dispatch(setGameConfig(config)),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);

import { useSelector, useDispatch } from 'react-redux';
import { setWinner, setBoardSize, setFirstPlayer, setGameConfig, setHistory } from './store/modules/game';
import { RootState } from './store/index';
import { useState } from 'react';
import './styles/index.css';
import GameBoard from './components/GameBoard/index.tsx';
import { MAX_BOARD_SIZE, MIN_BOARD_SIZE, GAME_CONFIG, } from './constants/gameConstants.ts';

/** 游戏类型 */
type GameOption = keyof typeof GAME_CONFIG;

/**
 * 井字棋，五子棋棋盘操作组件
 * @returns App
 */
function App () {
    // const gameConfig= useSelector((state: RootState) => state.game.gameConfig);
    const history = useSelector((state: RootState) => state.game.history);
    const boardSize = useSelector((state: RootState) => state.game.boardSize);

    const dispatch = useDispatch();

    // 当前棋盘状态
    // const currentBoard: (string | null)[][] = history[history.length - 1];
    const [inputVal, setInputVal] = useState<string | number>(boardSize);

    /**
     * 游戏选项更改函数
     * @param {React.ChangeEvent<HTMLSelectElement>} event - React的ChangeEvent对象，源自HTML select元素的变化事件。
     */
    const handleGameChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedGame: GameOption = event.target.value as GameOption;
        dispatch(setGameConfig(GAME_CONFIG[selectedGame]));
        setInputVal(GAME_CONFIG[selectedGame].boardSize);
    };
    /**
     * 棋盘大小输入框的值更改事件处理
     * @param e e
     */
    function boardSizeChange (event: React.ChangeEvent<HTMLInputElement>) {
        const inputValue: number = parseInt(event.target.value, 10);
        if (inputValue >= MIN_BOARD_SIZE && inputValue <= MAX_BOARD_SIZE) {
            dispatch(setBoardSize(inputValue));
        } else {
            // 新值无效，恢复到上一次的有效值
            setInputVal(boardSize);
        }
    }

    /**
     * 跳转到指定索引位置
     * @param index 回退记录的索引
     */
    function jumpTo (index: number): void {
        dispatch(setFirstPlayer(index % 2 === 0));
        dispatch(setHistory([...history.slice(0, index + 1)]));
        if (index < history.length - 1) {
            dispatch(setWinner(null));
        }
    }

    // 创建历史记录表
    const moves = history.map((__, index) => {
        let description: string;
        if (index) {
            description = `第${index}步`;
        } else {
            description = '重新开始';
        }
        return (
            <li key={index}>
                <button onClick={() => jumpTo(index)} className="historyButton">
                    {description}
                </button>
            </li>
        );
    });
    return (
        <div className="game">
            <div>
                <label htmlFor="gameSelect">游戏类型:</label>
                <select
                    id="gameSelect"
                    onChange={handleGameChange}
                >
                    {Object.keys(GAME_CONFIG).map((item, index) => (
                        <option key={index} value={item}>
                            {GAME_CONFIG[item as GameOption].gameName}
                        </option>
                    ))}
                </select>
                <div className="gameHistory">
                    棋盘大小：
                    <input
                        type="number"
                        value={inputVal}
                        onBlur={boardSizeChange}
                        onChange={(event) => setInputVal(event.target.value)}
                        min={MIN_BOARD_SIZE}
                        max={MAX_BOARD_SIZE}
                    />
                    <ol>{moves}</ol>
                </div>
            </div>
            <div className="gameBoard">
                <GameBoard/>
            </div>
        </div>
    );
}

export default App;

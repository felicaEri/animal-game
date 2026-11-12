import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import './App.css';

type Animal = {
  ja: string;
  en: string;
};

const ANIMALS: Animal[] = [
  { ja: 'いぬ', en: 'dog' },
  { ja: 'ねこ', en: 'cat' },
  { ja: 'うさぎ', en: 'rabbit' },
  { ja: 'ぞう', en: 'elephant' },
  { ja: 'きりん', en: 'giraffe' },
  { ja: 'ライオン', en: 'lion' },
  { ja: 'とら', en: 'tiger' },
  { ja: 'くま', en: 'bear' },
  { ja: 'さる', en: 'monkey' },
  { ja: 'パンダ', en: 'panda' },
  { ja: 'うま', en: 'horse' },
  { ja: 'うし', en: 'cow' },
  { ja: 'ぶた', en: 'pig' },
  { ja: 'ひつじ', en: 'sheep' },
  { ja: 'やぎ', en: 'goat' },
  { ja: 'にわとり', en: 'chicken' },
  { ja: 'あひる', en: 'duck' },
  { ja: 'ぺんぎん', en: 'penguin' },
  { ja: 'いるか', en: 'dolphin' },
  { ja: 'くじら', en: 'whale' },
  { ja: 'さめ', en: 'shark' },
  { ja: 'かめ', en: 'turtle' },
  { ja: 'へび', en: 'snake' },
  { ja: 'かえる', en: 'frog' },
  { ja: 'きつね', en: 'fox' },
  { ja: 'おおかみ', en: 'wolf' },
  { ja: 'しか', en: 'deer' },
  { ja: 'りす', en: 'squirrel' },
  { ja: 'こうもり', en: 'bat' },
  { ja: 'ふくろう', en: 'owl' },
];

function shuffleAnimals(): Animal[] {
  const shuffled = [...ANIMALS];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function App() {
  const [questions, setQuestions] = useState<Animal[]>(() => shuffleAnimals());
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isPlaying, setIsPlaying] = useState(false);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [message, setMessage] = useState('スタートを押してゲームを始めよう！');
  const [messageType, setMessageType] = useState<'normal' | 'success' | 'error'>('normal');
  const inputRef = useRef<HTMLInputElement>(null);

  const currentAnimal = questions[questionIndex];
  const isFinished = timeLeft === 0;
  const progress = Math.min((answeredCount / ANIMALS.length) * 100, 100);

  useEffect(() => {
    if (!isPlaying) return;

    const timerId = window.setInterval(() => {
      setTimeLeft((current) => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [isPlaying]);

  useEffect(() => {
    if (timeLeft === 0) {
      setIsPlaying(false);
      setMessage('タイムアップ！おつかれさまでした。');
      setMessageType('normal');
    }
  }, [timeLeft]);

  useEffect(() => {
    if (isPlaying) inputRef.current?.focus();
  }, [questionIndex, isPlaying]);

  function startGame() {
    setQuestions(shuffleAnimals());
    setQuestionIndex(0);
    setAnswer('');
    setScore(0);
    setAnsweredCount(0);
    setTimeLeft(60);
    setMessage('日本語の動物名を英語で入力してね！');
    setMessageType('normal');
    setIsPlaying(true);
  }

  function submitAnswer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isPlaying || !currentAnimal || !answer.trim()) return;

    if (answer.trim().toLowerCase() === currentAnimal.en.toLowerCase()) {
      setScore((current) => current + 10);
      setAnsweredCount((current) => current + 1);
      setMessage('正解！ +10点');
      setMessageType('success');
      setAnswer('');

      // 30種類すべて出題したら、もう一度シャッフルして続けます。
      if (questionIndex === questions.length - 1) {
        setQuestions(shuffleAnimals());
        setQuestionIndex(0);
      } else {
        setQuestionIndex((current) => current + 1);
      }
    } else {
      setMessage('おしい！スペルを確認して、もう一度！');
      setMessageType('error');
    }
  }

  const formattedTime = `00:${String(timeLeft).padStart(2, '0')}`;

  return (
    <main className="page-shell">
      <section className="game-card">
        <p className="eyebrow">ENGLISH VOCABULARY GAME</p>
        <h1>どうぶつ英語チャレンジ</h1>
        <p className="subtitle">日本語を見て、英語で答えよう！</p>

        <div className="stats">
          <div className="stat-box">
            <span className="stat-label">SCORE</span>
            <strong>{score}<small> pt</small></strong>
          </div>
          <div className={`stat-box timer-box ${timeLeft <= 10 ? 'urgent' : ''}`}>
            <span className="stat-label">TIME</span>
            <strong>{formattedTime}</strong>
          </div>
          <div className="stat-box">
            <span className="stat-label">CORRECT</span>
            <strong>{answeredCount}<small> 回</small></strong>
          </div>
        </div>

        <div
          className="progress-track"
          role="progressbar"
          aria-label="30種類の出題進捗"
          aria-valuemin={0}
          aria-valuemax={30}
          aria-valuenow={Math.min(answeredCount, 30)}
        >
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>

        <div className="question-panel">
          <span className="question-caption">この動物を英語で書いてね</span>
          <div className="animal-name">
            {isPlaying || isFinished ? currentAnimal?.ja : '？'}
          </div>
          <span className="question-hint">スペルを入力して「回答する」を押そう</span>
        </div>

        <form className="answer-form" onSubmit={submitAnswer}>
          <label htmlFor="animal-answer">英語のつづり</label>
          <input
            ref={inputRef}
            id="animal-answer"
            type="text"
            value={answer}
            onChange={(event) => setAnswer(event.target.value)}
            placeholder="例：dog"
            autoComplete="off"
            autoCapitalize="none"
            spellCheck={false}
            disabled={!isPlaying}
          />
          <button
            className="submit-button"
            type="submit"
            disabled={!isPlaying || !answer.trim()}
          >
            回答する
          </button>
        </form>

        <p className={`message ${messageType}`} aria-live="polite">
          {message}
        </p>

        {!isPlaying ? (
          <button className="start-button" onClick={startGame}>
            {isFinished ? 'もう一度チャレンジ！' : 'ゲームスタート'}
          </button>
        ) : (
          <button className="reset-button" onClick={startGame}>
            最初からやり直す
          </button>
        )}

        <p className="rule-note">
          正解するごとに10点！制限時間は60秒です。
        </p>
      </section>

      <footer>ANIMAL ENGLISH CHALLENGE</footer>
    </main>
  );
}

export default App;

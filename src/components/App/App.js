import styles from './app.module.css'
import { useState } from 'react';
import { useSpring, animated } from '@react-spring/web';


function App() {
  const [ isButtonDisabled, setIsButtonDisabled ] = useState(false)
  const [isChoiceDisabled, setIsChoiceDisabled] = useState(false);
  const [userChoice, setUserChoice] = useState(null);
  const [computerChoice, setComputerChoice] = useState(null); 
  const [result, setResult] = useState('')


//   const [ choice, setChoice ] = useState({
//     rock: 'rock', paper: 'paper', scisors: 'scissors'
// })


  const [springs, setSprings] = useSpring(() => ({
    from: {y: 0},
  }))

  function getComputerChoice() {
    const choices = ['rock', 'paper', 'scissors'];
    const randomIndex = Math.floor(Math.random() * choices.length);
    return choices[randomIndex];
  }

  function determineOutcome(userChoice, computerChoice) {
    if (userChoice === computerChoice) {
      return `Это ничья! `;
    }
    
    if (
      (userChoice === 'rock' && computerChoice === 'scissors') ||
      (userChoice === 'scissors' && computerChoice === 'paper') ||
      (userChoice === 'paper' && computerChoice === 'rock')
    ) {
      return `Вы победили! ${userChoice} beats ${computerChoice}.`;
    } else {
      return `Вы проиграли! ${computerChoice} beats ${userChoice}.`;
    }
  }


  const handleClick = (choice) => {
    if (isButtonDisabled) return; // Если кнопка заблокирована, ничего не делаем

    setSprings.start({
      from: { y: 0 },
      to: { y: 100 },
      config: { duration: 500 }, // Полное время для одного цикла
      loop: { reverse: true }, // Зацикливание анимац ии с возвратом в исходное положение
    });

    // Делаем кнопку неактивной
    setIsButtonDisabled(true);
    setIsChoiceDisabled(true);

    // Получаем выбор компьютера и определяем результат только после завершения анимации
    const compChoice = getComputerChoice();
    setComputerChoice(compChoice);

    setTimeout(() => {
      setSprings.stop(); // Останавливаем анимацию
      setSprings.start({ y: 0 }); // Возвращаем элемент в исходное состояние
      if (userChoice) {
        const outcome = determineOutcome(userChoice, compChoice);
        setResult(outcome);
        console.log(outcome);
      }
    }, 5000);

    // Восстанавливаем возможность нажимать на кнопку через 5 секунд
    setTimeout(() => {
      setIsButtonDisabled(false);
      setIsChoiceDisabled(false);
    }, 5000);
  }


  const onUserChangeChoice = (choice) => {
    if (isChoiceDisabled) return; // Если выбор заблокирован, ничего не делаем

    setUserChoice(choice);
    setIsButtonDisabled(false); // Активируем кнопку после выбора
    setResult(""); // Очищаем результат перед новым запуском
  };

  const chooseUserClass = userChoice ? styles[userChoice] : ''
  const computerChoiceClass = computerChoice ? styles[computerChoice] : '';


  
  return (
    <section className={styles.app}>
      <button
      className={isButtonDisabled ? styles.btnStartDisabled : styles.btnStart}
      onClick={() => handleClick(userChoice)}
      disabled={isButtonDisabled}
      >Начать!</button>
      <div
      className={styles.animatedContainer}
      >
        {console.log(getComputerChoice())}
        <div
        className={styles.userChoice}
        >
          <ul
          className={styles.list}
          >
            <li>
              <button
              onClick={() => onUserChangeChoice('rock')}
              disabled={isChoiceDisabled}
              >
                rock
              </button>
            </li>
            <li>
              <button
              onClick={() => onUserChangeChoice('paper')}
              disabled={isChoiceDisabled}
              >
                paper
              </button>
            </li>
            <li>
              <button
              onClick={() => onUserChangeChoice('scissors')}
              disabled={isChoiceDisabled}
              >
                scissors
              </button>
            </li>
          </ul>
        <animated.div 
        className={`${styles.choice} ${chooseUserClass}`}
        style={{ transform: springs.y.to(y => `translateY(${y}px)`) }}
      />
        </div>
            <animated.div 
        className={`${styles.choice} ${computerChoiceClass}`}
        style={{ transform: springs.y.to(y => `translateY(${y}px)`) }}
      />
      </div>
      <div>
        {result}
      </div>
    </section>
  );
}

export default App;

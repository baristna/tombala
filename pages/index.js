import { useState, useEffect } from 'react';
import Head from 'next/head'
import styles from '../styles/Home.module.scss'
import s from './index.scss'
import shuffle from './shuffle';

const defaultNumberStates = {}
const defaultBag = []

for (let i = 1; i <= 90; i++) {
  defaultBag.push(i)
  defaultNumberStates[i] = false
}

export default function Home() {
  const [popHide, setPopHide] = useState(true);
  const [bag, setBag] = useState(defaultBag);
  const [lastNumber, setLastNumber] = useState(0);
  const [drawList, setDrawList] = useState([]);
  const [numberStates, setNumberStates] = useState(defaultNumberStates);

  const drawNumber = () => {
    if (!bag.length) { return }

    if (bag.length + drawList.length !== 90) {
      return
    }

    setPopHide(false);

    setTimeout(() => {
      setPopHide(true)
    }, 1000)

    const shuffled = shuffle(bag);
    const popped = shuffled.pop()

    const updatenumberStates = {...numberStates}
    updatenumberStates[popped] = true;

    const updateDrawList = [...drawList];
    updateDrawList.unshift(popped)

    const newBag = [...shuffled]

    setBag(newBag)
    setLastNumber(popped)
    setDrawList(updateDrawList);
    setNumberStates(updatenumberStates)

    localStorage.setItem('bag', JSON.stringify(newBag))
    localStorage.setItem('lastNumber', popped)
    localStorage.setItem('drawList', JSON.stringify(updateDrawList))
    localStorage.setItem('numberStates', JSON.stringify(updatenumberStates))
  }

  const reset = () => {
    setBag(defaultBag)
    setLastNumber(0)
    setDrawList([]);
    setNumberStates(defaultNumberStates)

    localStorage.removeItem('bag')
    localStorage.removeItem('lastNumber')
    localStorage.removeItem('drawList')
    localStorage.removeItem('numberStates')
  }

  useEffect(() => {
    const savedBag = window.localStorage.getItem('bag')
    const savedLastNumber = window.localStorage.getItem('lastNumber')
    const savedDrawList = window.localStorage.getItem('drawList')
    const savedNumberStates = window.localStorage.getItem('numberStates')
  
    savedBag && setBag(JSON.parse(savedBag));
    savedLastNumber && setLastNumber(savedLastNumber);
    savedDrawList && setDrawList(JSON.parse(savedDrawList));
    savedNumberStates && setNumberStates(JSON.parse(savedNumberStates));
  }, [])

  return (
    <div className={styles.container}>
      <div className={`${s.pop} ${popHide ? s.hide : ''}`}>{lastNumber}</div>
      <Head>
        <title>TOMBALA</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={s.layout}>
        <div className={s.occurs}>
          {Object.entries(numberStates).map(([num, state]) => (
            <div className={s.box}>
              <div className={`${s.number} ${state ? s.drawed : ''} ${lastNumber == num ? s.lastnumber : ''}`}>{num}</div>
            </div>
          ))}
        </div>
        <div className={s.drawlist}>
          {drawList.map(num => <div className={s.drawlistitem}>{num}</div>)}
        </div>
      </div>
      <div className={s.bar}>
        <div className={`${s.btn} ${s.red}`} onClick={() => reset()}>RESET</div>
        <div className={s.info}>Torba: {bag.length} | Çekilen: {drawList.length}</div>
        <div className={s.divider}></div>
        <div className={s.btn} onClick={() => drawNumber()}>NUMARA ÇEK</div>
      </div>
    </div>
  )
}

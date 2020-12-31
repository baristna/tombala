import Head from 'next/head';
import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.scss';
import s from './index.scss';
import shuffle from './shuffle';

const defaultNumberStates = {}
const defaultBag = []

for (let i = 1; i <= 90; i++) {
  defaultBag.push(i)
  defaultNumberStates[i] = false
}

const defaultBank = {
  bank: 0,
  c1: 5,
  c2: 10,
  bingo: 20,
  people: [
    { name: 'A', current: 25 },
    { name: 'B', current: 25 },
    { name: 'C', current: 25 },
    { name: 'D', current: 25 },
    { name: 'E', current: 25 },
    { name: 'F', current: 25 },
    { name: 'G', current: 25 },
  ]
}

export default function Home() {
  const [bankState, setBankState] = useState(defaultBank)
  const [showBank, setShowBank] = useState(false)
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
    const savedBankState = window.localStorage.getItem('bankState')
    const savedLastNumber = window.localStorage.getItem('lastNumber')
    const savedDrawList = window.localStorage.getItem('drawList')
    const savedNumberStates = window.localStorage.getItem('numberStates')
  
    savedBag && setBag(JSON.parse(savedBag));
    savedBankState && setBankState(JSON.parse(savedBankState));
    savedLastNumber && setLastNumber(savedLastNumber);
    savedDrawList && setDrawList(JSON.parse(savedDrawList));
    savedNumberStates && setNumberStates(JSON.parse(savedNumberStates));
  }, [])

  const pay = (name, amount) => {
    const newBankState = {...bankState}

    newBankState.bank -= amount
    newBankState.people[newBankState.people.findIndex(i => i.name == name)].current += amount 

    setBankState(newBankState)
    localStorage.setItem('bankState', JSON.stringify(newBankState))
  }

  const bankReset = () => {
    setBankState(defaultBank)
    localStorage.removeItem('bankState')
  }

  return (
    <div className={styles.container}>
      <div className={`${s.pop} ${popHide ? s.hide : ''}`}>{lastNumber}</div>
      {showBank ? (
        <div className={`${s.bank}`}>
          <div className={s.bankclose} onClick={() => setShowBank(false)}>X</div>
          <div className={s.bankbox}>
            <div className={s.people}>
              {bankState.people.map((p) => (
                <div className={s.person}>
                  <div className={s.pname}>{p.name}</div>
                  <div className={`${s.ppay} ${s.red}`} onClick={() => { pay(p.name, -5)}}>ÖDE</div>
                  <div className={`${s.ppay} ${s.yellow}`} onClick={() => { pay(p.name, bankState.c1)}}>1.Ç</div>
                  <div className={`${s.ppay} ${s.yellow}`} onClick={() => { pay(p.name, bankState.c2)}}>2.Ç</div>
                  <div className={`${s.ppay} ${s.green}`} onClick={() => { pay(p.name, bankState.bingo)}}>TOMBALA</div>
                  <div className={p.personbank}>{p.current}TL</div>
                </div>
              ))}
            </div>
            <div className={s.bingobank}>
              <div className={s.bingototal}>Toplam {bankState.bank}TL</div>
              <div className={s.bingoorder}>1. Çinko = 5TL</div>
              <div className={s.bingoorder}>2. Çinko = 10TL</div>
              <div className={s.bingoorder}>3. Çinko = 20TL</div>
              <div className={s.divider}></div>
              <div className={s.bingobankreset} onClick={() => bankReset()}>RESET</div>
            </div>
          </div>
        </div>
      ) : null}
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
        <div className={s.btn} style={{ marginRight: '20px' }} onClick={() => drawNumber()}>NUMARA ÇEK</div>
        <div className={`${s.btn} ${s.green}`} onClick={() => setShowBank(!showBank)}>BANK</div>
      </div>
    </div>
  )
}

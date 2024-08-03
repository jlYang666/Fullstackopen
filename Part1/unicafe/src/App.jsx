import { useState } from 'react'

const Button = ( {text, handler}) => {
  return (
      <button onClick={handler}>{text}</button>
  )
}

const StatisticLine = ( {text, value} ) => {
  return (
    <tr>
        <td>{text}</td>
        <td>{value}</td>
    </tr>
  )
}

const Statistics = ( {good, neutral, bad} ) => {
  const all = good + neutral + bad
  if (all === 0) {
    return (
      <div>No feedback given</div>
    )
  }

  return (
    <div>
      <table>
      <StatisticLine text='good' value={good}></StatisticLine>
      <StatisticLine text='neutral' value={neutral}></StatisticLine>
      <StatisticLine text='bad' value={bad}></StatisticLine>
      <StatisticLine text='all' value={all}></StatisticLine>
      <StatisticLine text='average' value={ ((good - bad) / all)}></StatisticLine>
      <StatisticLine text='positive' value={ (good / all * 100) + '%'}></StatisticLine>
      </table>
    </div>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const goodClick = () => {
    const updatedGood = good + 1
    setGood(updatedGood)
  }

  const neutralClick = () => {
    const updatedNeutral = neutral + 1
    setNeutral(updatedNeutral)
  }

  const badClick = () => {
    const updatedBad = bad + 1
    setBad(updatedBad)
  }
  

  return (
    <div>
      <h1>give feedback</h1>
      <Button handler = {goodClick} text = {'good'}></Button>
      <Button handler = {neutralClick} text = {'neutral'}></Button>
      <Button handler = {badClick} text = {'bad'}></Button>
      <h1>Statistics</h1>
      <Statistics good = {good} neutral = {neutral} bad = {bad}></Statistics>
    </div>
  )
}

export default App
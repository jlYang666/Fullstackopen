//Refactor the code so that it consists of three new components: Header, Content, and Total. 
//All data still resides in the App component, which passes the necessary data to each component using props. 
//Header takes care of rendering the name of the course, 
//Content renders the parts and their number of exercises 
//Total renders the total number of exercises.

const Header = (props) => {
  return (
    <div>
      <h1>{props.name}</h1>
    </div>
  )
}

const Part = ({name, exercises}) => {
  return (
    <p>{name} {exercises}</p>
  )
}

const Content = ({parts}) => {
  const [part1, part2, part3] = parts
  return (
    <div>
      <Part name = {part1.name} exercises = {part1.exercises} />
      <Part name = {part2.name} exercises = {part2.exercises} />
      <Part name = {part3.name} exercises = {part3.exercises} />
    </div>
  )
}

const Total = ({parts}) => {
  const [part1, part2, part3] = parts
  return (
    <p>Number of exercises {part1.exercises + part2.exercises + part3.exercises}</p>
  )
}


const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <div>
      <Header name = {course.name}/>
      <Content parts = {course.parts}/>
      <Total parts = {course.parts}/>
    </div>
  )
}

export default App
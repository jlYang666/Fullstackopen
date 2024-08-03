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
        {parts.map(part => <Part key = {part.name} name = {part.name} exercises = {part.exercises} />)}
      </div>
    )
}
  
const Total = ({parts}) => {
    const initVal = 0
    const total = parts.reduce((sum, part) => sum + part.exercises, initVal)
    return (
      <p><b>total of {total} exercises</b></p>
    )
}
  
const Course = ( {course} ) => {
    return (
      <div>
        <Header name = {course.name}/>
        <Content parts = {course.parts}/>
        <Total parts = {course.parts}/>
      </div>
    )
}

export default Course
  
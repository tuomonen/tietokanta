const Diary = ({ diary, toggleImportance }) => {
  const label = diary.important
    ? 'make not important' : 'make important'

  return (
    <li className='diary'>
      {diary.content}
      <button onClick={toggleImportance}>{label}</button>
    </li>
  )
}

export default Diary
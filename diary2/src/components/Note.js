const Note = ({ diary, toggleImportance }) => {
    const label = diary.important
        ? 'make not important' : 'make important'

    return (
        <li className='note'>
            {diary.content}
            <button onClick={toggleImportance}>{label}</button>
        </li>
    )
}

export default Note
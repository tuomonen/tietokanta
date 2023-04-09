import { useState, useEffect } from 'react'
import diaryService from './services/notes'
import Note from './components/Note'
import Notification from './components/Notification'
import Footer from "./components/Footer";

const App = () => {
    const [notes, setNotes] = useState([])
    const [newNote, setNewNote] = useState('')
    const [showAll, setShowAll] = useState(true)
    const [errorMessage, setErrorMessage] = useState(null)

    useEffect(() => {
        diaryService
            .getAll()
            .then(initialNotes => {
                setNotes(initialNotes)
            })
    }, [])

    console.log('render', notes.length, 'päiväkirjamerkinnät')

    const addNote = event => {
        event.preventDefault()
        const noteObject = {
            content: newNote,
            important: Math.random() > 0.5,
        }

        diaryService
            .create(noteObject)
            .then(returnedNote => {
                setNotes(notes.concat(returnedNote))
                setNewNote('')      })
    }
    const toggleImportanceOf = id => {
        const diary = notes.find(d => d.id === id)
        const changedNote = { ...diary, important: !diary.important }

        diaryService
            .update(id, changedNote)
            .then(returnedNote => {
                setNotes(notes.map(diary => diary.id !== id ? diary : returnedNote))
            })
            .catch(error => {
                setErrorMessage(
                    `Note '${diary.content}' was already removed from server`
                )
                setTimeout(() => {
                    setErrorMessage(null)
                }, 5000)
                setNotes(notes.filter(d => d.id !== id))
            })
    }
    const handleNoteChange = (event) => {
        console.log(event.target.value)
        setNewNote(event.target.value)
    }

    const notesToShow = showAll
        ? notes
        : notes.filter(diary => diary.important === true)

    return (
        <div>
            <h1>Diary</h1>
            <Notification message={errorMessage} />
            <div>
                <button onClick={() => setShowAll(!showAll)}>
                    show {showAll ? 'important' : 'all' }
                </button>
            </div>
            <ul>
                {notesToShow.map(diary =>
                    <Note key={diary.id}
                          diary={diary}
                          toggleImportance={() => toggleImportanceOf(diary.id)}
                    />
                )}
            </ul>
            <form onSubmit={addNote}>
                <input value={newNote}
                       onChange={handleNoteChange} />
                <button type="submit">save</button>
            </form>
            <Footer />
        </div>
    )
}
export default App
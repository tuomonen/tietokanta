import { useState, useEffect } from 'react'
import diaryService from './services/notes'
import loginService from './services/login'
import Note from './components/Note'
import Notification from './components/Notification'
import Footer from "./components/Footer"
import Login from "./components/Login";

const App = () => {
    const [notes, setNotes] = useState([])
    const [newNote, setNewNote] = useState('')
    const [showAll, setShowAll] = useState(true)
    const [errorMessage, setErrorMessage] = useState(null)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [user, setUser] = useState(null)
    const [loginVisible, setLoginVisible] = useState(false)

    useEffect(() => {
        diaryService
            .getAll()
            .then(initialNotes => {
                setNotes(initialNotes)
            })
    }, [])

    console.log('render', notes.length, 'päiväkirjamerkinnät')

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedDiaryappUser')
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            setUser(user)
            diaryService.setToken(user.token)
        }
    }, [])

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

    const loginForm = () => {
        const hideWhenVisible = { display: loginVisible ? 'none' : '' }
        const showWhenVisible = { display: loginVisible ? '' : 'none' }

        return (
            <div>
                <div style={hideWhenVisible}>
                    <button onClick={() => setLoginVisible(true)}>Kirjaudu</button>
                </div>
                <div style={showWhenVisible}>
                    <Login
                        username={username}
                        password={password}
                        handleUsernameChange={({ target }) => setUsername(target.value)}
                        handlePasswordChange={({ target }) => setPassword(target.value)}
                        handleSubmit={handleLogin}
                    />
                    <button onClick={() => setLoginVisible(false)}>cancel</button>
                </div>
            </div>
        )
    }

    const noteForm = () => (
        <form onSubmit={addNote}>
            <input
                value={newNote}
                onChange={handleNoteChange}
            />
            <button type="submit">save</button>
        </form>
    )


    const handleLogin = async (event) => {
        event.preventDefault()
        console.log('logging in with', username, password)

        try {
            const user = await loginService.login({
                username, password,
            })

            window.localStorage.setItem(
                'loggedDiaryappUser', JSON.stringify(user)
            )
            diaryService.setToken(user.token)
            setUser(user)
            setUsername('')
            setPassword('')
        } catch (exception) {
            setErrorMessage('wrong credentials')
            setTimeout(() => {
                setErrorMessage(null)
            }, 5000)
        }
    }

    return (
        <div>
            <h1>Diary</h1>
            <Notification message={errorMessage} />

            {!user && loginForm()}
            {user && <div>
                <p>{user.name} logged in</p>
                {noteForm()}
            </div>
            }
            <h2>Päiväkirjamerkinnät:</h2>

            <p></p>
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

            <Footer />
        </div>
    )
}
export default App
import { useState, useEffect, useRef } from 'react'
import diaryService from './services/diary'
import loginService from './services/login'
import Diary from './components/Diary'
import Notification from './components/Notification'
import Footer from './components/Footer'
import Login from './components/Login'
import DiaryForm from './components/DiaryForm'
import Togglable from './components/Togglable'

const App = () => {
  const [notes, setNotes] = useState([])
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

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

  let diaryRef = useRef()

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in with', username, password)
    try {
      const user = await loginService.login({
        username, password
      })
      console.log('sisällä handleLoginin tryssa loginServicen jälkeen')
      diaryService.setToken(user.token)
      window.localStorage.setItem(
        'loggedDiaryappUser', JSON.stringify(user)
      )
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

  const addNote = (diaryObject) => {
    diaryService
      .create(diaryObject)
      .then(returnedDiary => {
        setNotes(notes.concat(returnedDiary))
        diaryRef.current.toggleVisibility()
      })
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

  const notesToShow = showAll
    ? notes
    : notes.filter(diary => diary.important === true)

  return (
    <div>
      <h1>100 päivää koodausta haaste</h1>
      <Notification message={errorMessage} />

      {!user &&
        <Togglable buttonLabel='kirjaudu' >
          <Login
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
        </Togglable>
      }
      {user &&
        <div>
          <p>{user.name} logged in</p>
            <Togglable buttonLabel="new note" ref={diaryRef}>
              <DiaryForm createNote={addNote} />
            </Togglable>
        </div>
      }

      <h3>Haastemerkinnät:</h3>

      <p></p>
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all' }
        </button>
      </div>
      <ul>
        {notesToShow.map(diary =>
          <Diary key={diary.id}
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
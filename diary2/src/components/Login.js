const Login = (props) => {

    return (
        <div>
            <h2>Kirjautuminen</h2>
            <form onSubmit={props.handleSubmit}>
                <div>
                    käyttäjätunnus
                    <input
                        value={props.username}
                        onChange={props.handleUsernameChange}
                    />
                </div>
                <div>
                    salasana
                    <input
                        type="password"
                        value={props.password}
                        onChange={props.handlePasswordChange}
                    />
                </div>
                <button type="submit">kirjaudu</button>
            </form>
        </div>
    )
}

export default Login
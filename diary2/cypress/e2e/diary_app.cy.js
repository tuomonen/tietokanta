describe('Diary ', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    const user = {
      name: 'Heli Tuomonen',
      username: 'heltu',
      password: 'salainen'
    }
    cy.request('POST', 'http://localhost:3001/api/users/', user)
    cy.visit('')
  })

  it('front page can be opened', function() {
    cy.contains('100 päivää')
    cy.contains('Haastemerkinnät')
  })

  it('user can log in', function() {
    cy.contains('kirjaudu').click()
    cy.get('#username').type('heltu')
    cy.get('#password').type('salainen')
    cy.get('#login-button').click()

    cy.contains('Heli Tuomonen logged in')
  })

  it('login fails with wrong password', function() {
    cy.contains('kirjaudu').click()
    cy.get('#username').type('heltu')
    cy.get('#password').type('wrong')
    cy.get('#login-button').click()

    cy.get('.error')
      .should('contain', 'wrong credentials')
      .and('have.css', 'color', 'rgb(255, 0, 0)')
      .and('have.css', 'border-style', 'solid')

    cy.get('html').should('not.contain', 'Heli Tuomonen logged in')
  })

  describe('when logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'heltu', password: 'salainen' })
      /*
      cy.request('POST', 'http://localhost:3001/api/login', {
        username: 'heltu', password: 'salainen'
      }).then(response => {
        localStorage.setItem('loggedDiaryappUser', JSON.stringify(response.body))
        cy.visit('')
      })
      */
    })

    it('a new note can be created', function() {
      cy.contains('new note').click()
      cy.get('input').type('a note created by cypress')
      cy.contains('tallenna').click()
      cy.contains('a note created by cypress')
    })

    describe('and a note exists', function () {
      beforeEach(function () {
        cy.contains('new note').click()
        cy.get('input').type('another note cypress')
        cy.contains('tallenna').click()
      })

      it('it can be made important', function () {
        cy.contains('another note cypress')
          .contains('make not important')
          .click()

        cy.contains('another note cypress')
          .contains('make important')
      })

      /*
      it('another not can be created', function() {
        cy.contains('new note').click()
        cy.get('input').type('another note cypress')
        cy.contains('tallenna').click()
        cy.contains('another note cypress')
      })
      */
    })
  })
})
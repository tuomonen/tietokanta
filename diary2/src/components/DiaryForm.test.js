import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import DiaryForm from './DiaryForm'
import userEvent from '@testing-library/user-event'

test('<DiaryForm /> updates parent state and calls onSubmit', async () => {
  const user = userEvent.setup()
  const createNote = jest.fn()

  render(<DiaryForm createNote={createNote} />)

  const input = screen.getByPlaceholderText('write diary content here')
  //const input = screen.getByRole('textbox')
  const sendButton = screen.getByText('tallenna')

  await user.type(input, 'testing a form...')
  await user.click(sendButton)

  expect(createNote.mock.calls).toHaveLength(1)
  expect(createNote.mock.calls[0][0].content).toBe('testing a form...')
})
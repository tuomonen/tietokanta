import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Diary from './Diary'

test('renders content', () => {
  const diary = {
    content: 'Component testing is done with react-testing-library',
    important: true
  }

  render(<Diary diary={diary}/>)
  //screen.debug()
  const element = screen.getByText('Component testing is done with react-testing-library')

  screen.debug(element)
})

test('renders content', () => {
    const diary = {
      content: 'Component testing is done with react-testing-library',
      important: true
    }

  const { container } = render(<Diary diary={diary} />)

  const div = container.querySelector('.diary')
  expect(div).toHaveTextContent(
    'Component testing is done with react-testing-library'
  )
})

test('clicking the button calls event handler once', async () => {
  const diary = {
    content: 'Component testing is done with react-testing-library',
    important: true
  }

  const mockHandler = jest.fn()

  render(
    <Diary diary={diary} toggleImportance={mockHandler} />
  )

  const user = userEvent.setup()
  const button = screen.getByText('make not important')
  await user.click(button)

  expect(mockHandler.mock.calls).toHaveLength(1)
})

test('renders no shit', () => {
  const diary = {
    content: 'This is a reminder',
    important: true
  }

  render(<Diary diary={diary} />)

  const element = screen.queryByText('do not want this shit to be rendered')
  expect(element).toBeNull()
})


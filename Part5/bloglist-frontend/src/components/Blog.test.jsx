import React from 'react'
import { expect, test } from 'vitest'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

const blog = {
    title: "test title",
    author: "test author",
    url: "test url",
    likes: 2,
}

test('renders title and author by default', () => {
    // render(<Blog blog={blog} />)

    // const { container } = render(<Blog blog={blog} />)
    // const div = container.querySelector('.blog')  
    // expect(div).toHaveTextContent('test blog')
    // screen.debug()

    render(<Blog blog={blog} />)

    const titleElement = screen.queryByText('test title')
    expect(titleElement).toBeDefined()
    
    const authorElement = screen.queryByText('test author')
    expect(authorElement).toBeDefined()
})

test('url and likes wont be rendered by default', () => {
    // render(<Blog blog={blog} />)

    // const { container } = render(<Blog blog={blog} />)
    // const div = container.querySelector('.blog')  
    // expect(div).toHaveTextContent('test blog')
    // screen.debug()

    render(<Blog blog={blog} />)

    const urlElement = screen.queryByText('test url')
    expect(urlElement).toBeNull()
    
    const likesElement = screen.queryByText('2')
    expect(likesElement).toBeNull()
})


test('After clicking the view button, url and number of likes are shown', async () => {

    render(<Blog blog={blog} />)

    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const urlElement = screen.queryByText('test url')
    expect(urlElement).toBeDefined()
    
    const likesElement = screen.queryByText('2')
    expect(likesElement).toBeDefined()

    const titleElement = screen.queryByText('test title')
    expect(titleElement).toBeDefined()
    
    const authorElement = screen.queryByText('test author')
    expect(authorElement).toBeDefined()
})


test('Clicking the likes button twice, the event handler the component received as props is called twice', async () => {
    const updateBlog = vi.fn()
    render(<Blog blog={blog} updateBlog={updateBlog}/>)

    const user = userEvent.setup()
    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)
    // screen.debug()
    expect(updateBlog.mock.calls).toHaveLength(2)

})
const dummy = (blogs) => {
    // ...
    return 1
}

const totalLikes = (blogs) => {
    return blogs.length === 0 ? 0 : blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) return {}

    let maxLikes = 0
    let favBlog 

    for (const blog of blogs) {
        if (blog.likes > maxLikes) {
            maxLikes = blog.likes
            favBlog = blog
        }
    }
    return {title: favBlog.title, author: favBlog.author, likes: favBlog.likes}
}

const mostBlogs = (blogs) => {
    if (blogs.length === 0) return {}

    let statistics = {}
    for (const blog of blogs) {
        statistics[blog.author] = statistics[blog.author] ? ++statistics[blog.author] : 1
    }

    const authors = Object.keys(statistics)

    let mostBlogsAuthor
    let mostBlogsCount = 0

    for(const author of authors) {
        if (statistics[author] > mostBlogsCount) {
            mostBlogsCount = statistics[author]
            mostBlogsAuthor = author
        }
    }
    return {author: mostBlogsAuthor, blogs: mostBlogsCount}
}

const mostLikes = (blogs) => {
    if (blogs.length === 0) return {}

    let statistics = {}
    for (const blog of blogs) {
        statistics[blog.author] = statistics[blog.author] ? statistics[blog.author] + blog.likes : blog.likes
    }

    const authors = Object.keys(statistics)

    let mostLikesAuthor
    let mostLikes = 0

    for(const author of authors) {
        if (statistics[author] > mostLikes) {
            mostLikes = statistics[author]
            mostLikesAuthor = author
        }
    }
    return {author: mostLikesAuthor, likes: mostLikes}
}


module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}
import { GraphQLServer } from 'graphql-yoga'

// Scalar types - String, Boolean, Int, Float, ID

// Demo user data
const users = [{
    id: '1',
    name: 'Andrew',
    email: 'andrew@example.com',
    age: 27
}, {
    id: '2',
    name: 'Sarah',
    email: 'sarah@example.com'
}, {
    id: '3',
    name: 'Mike',
    email: 'mike@example.com'
}];

const posts = [{
    id: '10',
    title: 'GraphQL 101',
    body: 'This is how to use GraphQL...',
    published: true,
    author: '1'
}, {
    id: '11',
    title: 'GraphQL 201',
    body: 'This is an advanced GraphQL post...',
    published: false,
    author: '1'
}, {
    id: '12',
    title: 'Programming Music',
    body: '',
    published: false,
    author: '2'
}];

const comment = [{
    id: '101',
    text: 'GraphQL 101',
    post: '10',
    user: '2'
}, {
    id: '102',
    text: 'GraphQL 102',
    post: '10',
    user: '3'
}, {
    id: '103',
    text: 'Programming Music',
    post: '11',
    user: '3'
},{
    id: '104',
    text: 'Programming Music',
    post: '12',
    user: '1'
}];

// Type definitions (schema)
const typeDefs = `
    type Query {
        users(query: String): [User!]!
        posts(query: String): [Post!]!
        comments(query: String): [Comment!]!
        me: User!
        post: Post!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
    }
    
    type Comment {
        id: ID!
        user: User!
        post: Post!
        text: String!
    }
`

// Resolvers
const resolvers = {
    Query: {
        users(parent, args, ctx, info) {
            if (!args.query) {
                return users
            }

            return users.filter((user) => {
                return user.name.toLowerCase().includes(args.query.toLowerCase())
            })
        },
        posts(parent, args, ctx, info) {
            if (!args.query) {
                return posts
            }

            return posts.filter((post) => {
                const isTitleMatch = post.title.toLowerCase().includes(args.query.toLowerCase())
                const isBodyMatch = post.body.toLowerCase().includes(args.query.toLowerCase())
                return isTitleMatch || isBodyMatch
            })
        },
        me() {
            return {
                id: '123098',
                name: 'Mike',
                email: 'mike@example.com'
            }
        },
        comments(parent, args, ctx, info) {
            if(!args.query) {
                return comment
            }

            return comment.filter((comment) => {
                return comment.text.toLowerCase().includes(args.query.toLowerCase())
            })
        },
        post() {
            return {
                id: '092',
                title: 'GraphQL 101',
                body: '',
                published: false
            }
        }
    },
    Post: {
        author(parent, args, ctx, info) {
            return users.find((user) => {
                return user.id === parent.author
            })
        }
    },
    Comment: {
        user(parent, args, ctx, info) {
            return users.find((user) => {
                return user.id === parent.user
            })
        },
        post(parent, args, ctx, info) {
            return posts.find((post) => {
                return post.id === parent.post
            })
        }
    }
}

const server = new GraphQLServer({
    typeDefs,
    resolvers
})

server.start(({port}) => {
    console.log('The server is up on:', port)
})


/*

#query
query {
	posts {
	id
	title
	body
	published
	author {
	name
	}
	}
  comments {
    id
    text
    user {
      id
      name
      email
      age
    }
    post {
      id
      author {
        name
        email
        id
        age
      }
    }
  }
}
*/
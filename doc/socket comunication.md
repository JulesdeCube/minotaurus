[[toc]]
# Minotaurus Doc

## Comunication

### Structure
the socket is architecture :
```
/
├─ user
└─ minotaurus
   ├─ searchEngine
   └─ game
        ├─ a1
        |  ├─ 
        |  └─ 
        ├─ b2
        └─ . . .
```
every namespace has 3 connection:
- `get`: to get information
- `post`: to set a information
- `err`: to response a error

all message need to have this structure:
```js
{
  request: 'string',
  content: 'any'
}
```
### Sign
#### Sign protocole
##### Sign Up
1. client: `signUp`: sign Up
```js
{
  username: 'the username',
  email: 'the email',
  password: 'the password'
}
```

2. server: `signUp`: return if the account are created
```js
{
  type: 'validate',
  message: 'account created'
}
```
2.bis server: `signUp`: the username is already taken
```js
{
  type: 'error',
  message: 'username already taken'
}
```
2.ter server: `signUp`: the email is already taken
```js
{
  type: 'error',
  message: 'email already taken'
}
```
2.quad server: `signUp`: the email is not an email
```js
{
  type: 'error',
  message: 'it\'s not an email'
}
```
2.cinq server: `signUp`: enter false
```js
{
  type: 'error',
  message: 'enter false'
}
```

##### Sign In with regulare password
1. client: `signIn`: sign in with regulare username and password
```js
{
  username: 'the username',
  password: 'the password'
}
```

2. server: `signIn`: return if the authentication are success
```js
{
  type: 'validate',
  message: 'authentication success'
}
```
2.bis server: `signIn`: the sign information are false
```js
{
  type: 'error',
  messsage: 'enter false'
}
```

##### Sign In with token
1. client: `signToken`: sign in with the token
```js
{
  token: 'the token'
}
```
2. server: `signToken`: the token is good
```js
{
  type: 'vaidate',
  message: 'authentication success'
}
```
2.bis server: `signToken`: the token are false
```js
{
  type: 'error',
  message: 'token false'
}
```
#### Get Information
predefinit information:
- `token`
- `username`

1. client: `get` : get other informmation (exemple: the sexe)
```js
{
  request: 'the information',
  content: undefined
}
```
2. server: `post`: the information
```js
{
  request: 'the information',
  content: 'the infornation value'
}
```

### Minotaurus

#### make an action
1. server: `get`: the action
```js
{
  request: 'action',
  content: {
    type: 'the action',
    information: 'complementar information'
  }
}
```
possible action:
- `mooveCharacter` : moove a character specifie the number of moove (`int`)
- `mooveMinotaurus` : moove the minotaurusby `8` case
- `mooveWall` : moove 1 wall
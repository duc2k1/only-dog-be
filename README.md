## Install / Update

```
yarn
```

## Start server

```
yarn dev
```


## Rest API

> ## Authentication

### Login 
`POST /login`

```
https://app-only-dog.herokuapp.com/auth/login
```

### Register 
`POST /register`
```
https://app-only-dog.herokuapp.com/auth/register
```

### Refresh access token 
`PUT /refresh_access_token`
```
https://app-only-dog.herokuapp.com/auth/refresh_access_token
```

### remove refresh token 
`DELETE /remove_refresh_token`
```
https://app-only-dog.herokuapp.com/auth/remove_refresh_token
```

### Logout
`DELETE /remove_all_refresh_token`
```
https://app-only-dog.herokuapp.com/auth/remove_all_refresh_token
```

> ## Model Users

### Get list user

`GET /users/`

```
https://app-only-dog.herokuapp.com/users
```

### Get userId's dashboard

`GET /dashboard/:userId`

```
https://app-only-dog.herokuapp.com/users/dashboard/:userId
```

### Find user by userName

`GET /find_by_name/:userName`

```
https://app-only-dog.herokuapp.com/users/find_by_name/:userName
```

### Get profile user

`GET /find_by_id/:userId`

```
https://app-only-dog.herokuapp.com/users/find_by_id/:userId
```

### Follow or Unfollow another user

`PUT /follow_and_unfollow`

```
https://app-only-dog.herokuapp.com/users/follow_and_unfollow
```

> ## Model Posts

### Get list post

`GET /posts/`

```
https://app-only-dog.herokuapp.com/posts
```
### Create new post

`POST /add/:userId`

```
https://app-only-dog.herokuapp.com/posts/add/:userId
```

### Like or Unlike one post 

`PUT /like`

```
https://app-only-dog.herokuapp.com/posts/like
```


### Dislike or undislike one post

`PUT /dislike`

```
https://app-only-dog.herokuapp.com/posts/dislike
```




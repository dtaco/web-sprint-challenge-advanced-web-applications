import React, { useState } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { axiosWithAuth } from '../axios/index'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'



export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState()
  const [spinnerOn, setSpinnerOn] = useState(false)

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate()
  const redirectToLogin = () => {navigate('/')}
  const redirectToArticles = () => {navigate('/articles')}

  const logout = () => {
    // ✨ implement
    localStorage.removeItem('token');
    // If a token is in local storage it should be removed,
    setMessage('Goodbye!');
    // and a message saying "Goodbye!" should be set in its proper state.
    redirectToLogin();
    // In any case, we should redirect the browser back to the login screen,
    // using the helper above.
    setArticles([])
  }

  const login = (values) => {
    const creds = {
      username: values.username,
      password: values.password,
    }
    // ✨ implement
    message !== '' ? setMessage('') : null;
    setSpinnerOn(true);
    // We should flush the message state, turn on the spinner
    axios.post('http://localhost:9000/api/login', creds)
      .then((res) => {
        setMessage(res.data.message)
        localStorage.setItem('token', res.data.token)
        redirectToArticles()
        setSpinnerOn(false)
      })
      .catch((err) => {
        console.error(err);
        setMessage('Invalid request: Try Again.')
        setSpinnerOn(false);
      })
    // and launch a request to the proper endpoint.
    // On success, we should set the token to local storage in a 'token' key,
    // put the server success message in its proper state, and redirect
    // to the Articles screen. Don't forget to turn off the spinner!
  }

  const getArticles = (messageOn) => {
    // ✨ implement
    setSpinnerOn(true);
    // We should flush the message state, turn on the spinner
    axiosWithAuth().get('http://localhost:9000/api/articles')
      .then((res) => {
        !messageOn ? setMessage(res.data.message) : null;
        setArticles(res.data.articles)
        setSpinnerOn(false);
      })
    // and launch an authenticated request to the proper endpoint.
    // On success, we should set the articles in their proper state and
    // put the server success message in its proper state.
    // If something goes wrong, check the status of the response:
    // if it's a 401 the token might have gone bad, and we should redirect to login.
    // Don't forget to turn off the spinner!
  }

  const postArticle = article => {
    // ✨ implement
    const messageOn = true;

    setSpinnerOn(true);
    axiosWithAuth().post('http://localhost:9000/api/articles', article)
      .then((res) => {
        getArticles(messageOn);
        setMessage(res.data.message);
        setSpinnerOn(false)
      })
      .catch((err) => {
        setSpinnerOn(false)
        console.error(err)
      })
    // The flow is very similar to the `getArticles` function.
    // You'll know what to do! Use log statements or breakpoints
    // to inspect the response from the server.
  }

  const updateArticle = ({ article_id, article }) => {
    // ✨ implement
    const messageOn = true

    setSpinnerOn(true)
    return axiosWithAuth().put(`http://localhost:9000/api/articles/${article_id}`, article)
      .then((res) => {
        getArticles(messageOn);
        setMessage(res.data.message)
        setCurrentArticleId()
        setSpinnerOn(false)
      })
      .catch((err) => {
        setSpinnerOn(false)
        console.error(err)
      })
    // You got this!
  }

  const deleteArticle = article_id => {
    const messageOn = true;
    // ✨ implement
    setSpinnerOn(true);

    return axiosWithAuth().delete(`http://localhost:9000/api/articles/${article_id}`)
      .then((res) => {
        getArticles(messageOn);
        setMessage(res.data.message);
        setSpinnerOn(false);
      })
  }

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner on={spinnerOn}/>
      <Message message={message}/>
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login}/>} />
          <Route path="articles" element={
            <>
              <ArticleForm 
                articles={articles}
                currentArticleId={currentArticleId}
                setCurrentArticleId={setCurrentArticleId}
                updateArticle={updateArticle}
                postArticle={postArticle}
              />
              <Articles 
                articles={articles} 
                getArticles={getArticles}
                deleteArticle={deleteArticle} 
                setCurrentArticleId={setCurrentArticleId} 
                redirectToLogin={redirectToLogin}
              />
            </>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </>
  )
}

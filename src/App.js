import React from 'react';
import Main from './Layout/Homepage/Main/Main'
import Heading from './Layout/Homepage/Heading/Heading'
import { BrowserRouter as Router ,Switch ,Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { getReduxStore, getRrfProp } from "./Config/firebase-redux";
import { ReactReduxFirebaseProvider } from "react-redux-firebase"
import './App.css';
import ViewArticle from './Layout/ViewArticle/ViewArticle'
import NewArticle from './Layout/NewArticle/NewArticle'
import LoginPage from "./Layout/LoginPage/LoginPage"

function App() {
  return (
    <div className="App">
      <Provider store={getReduxStore()}>
          <ReactReduxFirebaseProvider {...getRrfProp()}>
              <Router>
                <Heading />
                <Route path="/" exact>
                    <Main />
                </Route>
                <Route path="/login">
                    <LoginPage />
                </Route>
                <Route path="/article/:id">
                    <ViewArticle />
                </Route>
                <Route path='/new-article'>
                    <NewArticle />
                </Route>
              </Router>
          </ReactReduxFirebaseProvider>
      </Provider>
    </div>
  );
}

export default App;

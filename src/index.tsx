import React from 'react'
import ReactDOM from 'react-dom'

import App from 'containers/App/App'

import { Router } from 'react-router-dom'
import history from 'utils/history'

import CssBaseline from '@material-ui/core/CssBaseline'
import { ThemeProvider, StylesProvider } from '@material-ui/styles'

import theme from 'styles/themeStyles'

import GlobalStyle from 'styles/index'
import 'typeface-roboto'

import * as serviceWorker from './serviceWorker'

ReactDOM.render(
  <>
    <GlobalStyle />
    <CssBaseline />
    <Router history={history}>
      <StylesProvider injectFirst={true}>
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </StylesProvider>
    </Router>
  </>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()

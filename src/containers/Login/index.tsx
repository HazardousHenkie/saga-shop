import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createStructuredSelector } from 'reselect'

import { login } from '../App/actions'

import {
  makeSelectError,
  makeSelectLoading,
  makeSelectLoggedIn
} from 'containers/App/selectors'

import { useLocation } from 'react-router-dom'

import { useForm } from 'react-hook-form'

import history from 'utils/history'
import ROUTES from 'strings/routes'
import hasSpecificErrors, { hasErrors } from 'utils/hasErrors'

import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

import {
  PaperWrapper,
  StyledPaper,
  StyledTypographyTitle,
  StyledSubmitButton
} from 'styles/styledComponents'

import { StyledLink } from './styledComponents'

import InfoMessage from 'components/Molecules/InfoMessage'

import { useTranslation } from 'react-i18next'

interface FormSubmitInterface {
  email: string
  password: string
}

const stateSelector = createStructuredSelector({
  error: makeSelectError(),
  loading: makeSelectLoading(),
  loggedIn: makeSelectLoggedIn()
})

const LoginPage: React.FC = () => {
  const { loggedIn, error, loading } = useSelector(stateSelector)
  const dispatch = useDispatch()
  const location = useLocation()
  const [submitting, setSubmitting] = useState(false)
  const { register, handleSubmit, errors } = useForm<FormSubmitInterface>({
    mode: 'onChange'
  })

  const { t } = useTranslation('error')

  useEffect(() => {
    if (loggedIn) {
      history.push(ROUTES.HOME)
    }
  }, [loggedIn])

  const submitForm = handleSubmit(values => {
    setSubmitting(false)
    dispatch(login({ url: location.search.split('?next=')[1], values }))
  })

  return (
    <>
      {!loggedIn && !loading && (
        <PaperWrapper loggedIn={loggedIn}>
          <StyledPaper variant="outlined">
            <StyledTypographyTitle align="center" variant="h1">
              Login
            </StyledTypographyTitle>

            <form onSubmit={submitForm}>
              <TextField
                error={hasSpecificErrors(errors.email)}
                type="email"
                label="E-mail"
                name="email"
                inputRef={register({
                  required: t(
                    'error:requiredField',
                    'Input is required.'
                  ) as string,
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                    message: t('error:unvalidEmail', 'Must be a vald email.')
                  }
                })}
                helperText={errors.email && errors.email.message}
                variant="outlined"
                fullWidth={true}
                margin="normal"
              />

              <TextField
                error={hasSpecificErrors(errors.password)}
                type="password"
                label="Password"
                name="password"
                inputRef={register({
                  required: t(
                    'error:requiredField',
                    'Input is required.'
                  ) as string,
                  minLength: {
                    value: 5,
                    message: t(
                      'error:maxLengthFive',
                      'The minimum width of this field is 5.'
                    )
                  }
                })}
                helperText={errors.password && errors.password.message}
                variant="outlined"
                fullWidth={true}
                margin="normal"
              />

              <Typography variant="body1">
                Forgot your Password?
                <StyledLink to={ROUTES.FORGOT_PASSWORD}>
                  Reset password!
                </StyledLink>
              </Typography>

              <StyledSubmitButton
                type="submit"
                variant="contained"
                color="secondary"
                fullWidth={true}
                disabled={submitting || hasErrors(errors)}
              >
                Login
              </StyledSubmitButton>
            </form>

            {error && (
              <InfoMessage severity="error" message={error.toString()} />
            )}
          </StyledPaper>
        </PaperWrapper>
      )}
    </>
  )
}

export default LoginPage

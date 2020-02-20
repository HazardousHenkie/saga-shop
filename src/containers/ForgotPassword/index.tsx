import React, { SetStateAction } from 'react'

import { useDispatch, useSelector } from 'react-redux'

import { Formik, Form } from 'formik'

import * as Yup from 'yup'

import TextField from '@material-ui/core/TextField'
import InfoMessage from 'components/Molecules/InfoMessage'

import {
  PaperWrapper,
  StyledPaper,
  StyledTypographyTitle,
  StyledSubmitButton
} from 'styles/styledComponents'

import Loader from 'components/Molecules/Loader'

import { createStructuredSelector } from 'reselect'

import { sendPasswordResetEmail } from './actions'

import { useInjectSaga } from 'utils/injectSaga'
import { useInjectReducer } from 'utils/injectReducer'

import reducer from './reducer'
import saga from './saga'

import {
  makeSelectError,
  makeSelectMessage,
  makeSelectLoader
} from './selectors'

import { makeSelectLoggedIn } from 'containers/App/selectors'

import { LOGIN_LINK } from 'utils/routes'

const ForgotPasswordscheme = Yup.object().shape({
  email: Yup.string()
    .required('Required')
    .email()
})

interface Values {
  email: string
}

interface FormSubmitInterface {
  setSubmitting: React.Dispatch<SetStateAction<boolean>>
}

const key = 'passwordrequest'

const stateSelector = createStructuredSelector({
  message: makeSelectMessage(),
  error: makeSelectError(),
  loading: makeSelectLoader(),
  loggedIn: makeSelectLoggedIn()
})

const ForgotPassword: React.FC = () => {
  const { message, error, loading, loggedIn } = useSelector(stateSelector)
  const dispatch = useDispatch()

  useInjectReducer({ key, reducer })
  useInjectSaga({ key, saga })

  const submitForm = (
    values: Values,
    { setSubmitting }: FormSubmitInterface
  ) => {
    dispatch(sendPasswordResetEmail(values))
    setSubmitting(false)
  }

  return (
    <>
      {loading && <Loader />}
      <PaperWrapper loggedIn={loggedIn}>
        <StyledPaper variant="outlined">
          <StyledTypographyTitle align="center" variant="h1">
            Forgot password
          </StyledTypographyTitle>

          {message && (
            <InfoMessage
              severity="info"
              message={message}
              link={LOGIN_LINK}
              linkText="Back to login"
            />
          )}
          <Formik
            initialValues={{ email: '' }}
            validationSchema={ForgotPasswordscheme}
            onSubmit={submitForm}
          >
            {({
              values,
              isSubmitting,
              handleChange,
              isValid,
              handleBlur,
              errors,
              touched
            }) => (
              <Form>
                <TextField
                  type="email"
                  label="E-mail"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  helperText={errors.email && touched.email && errors.email}
                  variant="outlined"
                  fullWidth={true}
                  margin="normal"
                />

                <StyledSubmitButton
                  type="submit"
                  variant="contained"
                  color="secondary"
                  fullWidth={true}
                  disabled={isSubmitting || !isValid}
                >
                  Reset password
                </StyledSubmitButton>
              </Form>
            )}
          </Formik>
          {error && <InfoMessage severity="error" message={error.toString()} />}
        </StyledPaper>
      </PaperWrapper>
    </>
  )
}

export default ForgotPassword

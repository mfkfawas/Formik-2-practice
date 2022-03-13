// This hook is not much useful coz it does'nt allow you to wrap your component in a context.
// import { useFormik } from 'formik';
import {
  Formik,
  Field,
  Form,
  useField,
  ErrorMessage,
  FieldArray,
} from 'formik';
import {
  TextField,
  Button,
  Checkbox,
  Radio,
  FormControlLabel,
  MenuItem,
  Select,
} from '@material-ui/core';
import * as Yup from 'yup';

// Whenever you have a field that doesn't map to your UI component(here materialui comp) simply create a custom comp and then to
//get access to any formik properties we use the useField()
const MyRadio = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  // console.log(field);

  return (
    <FormControlLabel
      {...field}
      control={<Radio />}
      label={label}
    />
  );
};

//when we want validation and show an error
const MyTextField = ({ placeholder, ...props }) => {
  const [field, meta] = useField(props);

  return (
    <>
      <TextField {...field} />
      {meta.touched && meta.error && (
        <ErrorMessage
          component='div'
          name={field.name}
          className='error'
        />
      )}
    </>
  );
};

const validationSchema = Yup.object({
  validatedTextField: Yup.string()
    .max(15, 'Must be 15 characters or less')
    .required('Required'),

  pets: Yup.array().of(
    Yup.object({
      name: Yup.string().required(),
    })
  ),
});

function App() {
  return (
    <div>
      <Formik
        initialValues={{
          firstName: '',
          lastName: '',
          isTall: false,
          cookies: [],
          yogurt: '',
          games: '',
          validatedTextField: '',
          pets: [
            {
              type: 'cat',
              name: 'Jarvis',
              id: '' + Math.random(),
            },
          ],
        }}
        validationSchema={validationSchema}
        onSubmit={(data, { setSubmitting, resetForm }) => {
          //When an async fn is called, we may want to disable our button while the data is loading from server
          setSubmitting(true);
          //make async call

          console.log(data);

          //when async call is done
          setSubmitting(false);

          //To reset form after submitting
          resetForm();
        }}
      >
        {/* Render props
          values - an obj of current state
       */}
        {({
          values,
          errors,
          isSubmitting,
          handleChange,
          handleBlur,
          handleSubmit,
        }) => (
          <Form>
            {/* <Form> is utilty for <form onSubmit={handleSubmit}> from Formik, so we dont wanna pass onSubmit coz Formik do it auto. */}
            {/* <TextField
              //This name field lines up with what you want to be stored in your formik state.
              name='firstName'
              value={values.firstName}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <TextField
              name='lastName'
              value={values.lastName}
              onChange={handleChange}
              onBlur={handleBlur}
            /> */}

            {/* The above two TextFields contain duplicate codes, so we can simplify this using Field comp in Formik */}
            <Field
              placeholder='First Name'
              name='firstName'
              type='input'
              as={TextField}
            />
            <div>
              <Field
                //by this placeholder, we just passed in a prop and this Field gonna pass that prop to the TextField
                placeholder='Last Name'
                name='lastName'
                type='input'
                as={TextField}
              />
            </div>

            {/* Checkbox - materialui */}
            <Field name='isTall' type='checkbox' as={Checkbox} />

            {/* Checkbox group */}
            <div>Cookies:</div>
            <Field
              name='cookies'
              type='checkbox'
              value='chocolate chip'
              as={Checkbox}
            />
            <Field
              name='cookies'
              type='checkbox'
              value='snicker doodle'
              as={Checkbox}
            />
            <Field
              name='cookies'
              type='checkbox'
              value='sugar'
              as={Checkbox}
            />

            {/* Radio */}
            <div>Yogurt</div>
            <Field
              name='yogurt'
              type='radio'
              value='peach'
              as={Radio}
            />
            <Field
              name='yogurt'
              type='radio'
              value='blueberry'
              as={Radio}
            />
            <Field
              name='yogurt'
              type='radio'
              value='apple'
              as={Radio}
            />

            {/* Radio with Label, MyRadio is our custom componenent */}
            <div>Games</div>
            <MyRadio
              name='games'
              type='radio'
              value='cricket'
              label='cricket'
            />
            <MyRadio
              name='games'
              type='radio'
              value='football'
              label='football'
            />
            <MyRadio
              name='games'
              type='radio'
              value='volleyball'
              label='volleyball'
            />

            {/* Validation */}
            <div>
              <MyTextField
                placeholder='Validated Field'
                name='validatedTextField'
                type='input'
              />
            </div>

            {/* How to deal with Array. 
            FieldArray - comp in Formik, render prop */}
            <FieldArray name='pets'>
              {arrayHelpers => (
                <div>
                  <Button
                    onClick={() =>
                      arrayHelpers.push({
                        type: 'frog',
                        name: '',
                        id: '' + Math.random(),
                      })
                    }
                  >
                    Add Pet
                  </Button>
                  {values.pets.map((pet, index) => {
                    return (
                      <div key={pet.id}>
                        <MyTextField
                          placeholder='Pet Name'
                          name={`pets.${index}.name`}
                        />
                        <Field
                          name={`pets.${index}.type`}
                          type='select'
                          as={Select}
                        >
                          <MenuItem value='dog'>dog</MenuItem>
                          <MenuItem value='cat'>cat</MenuItem>
                          <MenuItem value='frog'>frog</MenuItem>
                        </Field>
                        <Button
                          onClick={() =>
                            arrayHelpers.remove(index)
                          }
                        >
                          x
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </FieldArray>

            <div>
              <Button
                type='submit'
                // isSubmitting's value should be true/false acc to setSubmitting()
                disabled={isSubmitting}
              >
                Submit
              </Button>
            </div>

            <pre>{JSON.stringify(values, null, 2)}</pre>
            <pre>{JSON.stringify(errors, null, 2)}</pre>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default App;

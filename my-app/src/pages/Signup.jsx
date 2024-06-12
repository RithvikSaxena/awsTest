import React from 'react';
import { Formik, Form, Field } from 'formik';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const navigate = useNavigate();

  return (
    <div className='w-screen h-screen bg-slate-900 flex flex-col items-center justify-center'>
      <div className='w-1/3 bg-slate-700 rounded-md p-4'>
      <h1 className='text-lg font-semibold text-white mb-2'>Sign Up</h1>
      <Formik
        initialValues={{ email: '', password: '', confirmpassword: ''}}
        onSubmit={async (values) => {
          try {
            const response = await axios.post('http://localhost:3000/auth/signup', values);
            // Handle successful sign up
            navigate('/home');
          } catch (error) {
            console.error(error);
          }
        }}
      >
        <Form className='flex flex-col gap-4'>
          <Field name="email" type="email" placeholder="Email" className="bg-slate-900 rounded block p-2 text-white"/>
          <Field name="password" type="password" placeholder="Password" className="bg-slate-900 rounded block p-2 text-white"/>
          <Field name="confirmpassword" type="password" placeholder="Confirm Password" className="bg-slate-900 rounded block p-2 text-white"/>
          <button className="bg-blue-800 p-2 rounded text-white text-md font-semibold" type="submit">Sign Up</button>
        </Form>
      </Formik>
      <button className="w-full bg-slate-700 mt-2 p-2 text-white mx-auto" onClick={()=>{navigate('/')}}>Already have an account? Login</button>
      </div>
    </div>
  );
};

export default SignUp;

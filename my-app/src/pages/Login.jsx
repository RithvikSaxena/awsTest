import React from 'react';
import { Formik, Form, Field } from 'formik';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/Context';

const Login = () => {
  const navigate = useNavigate();
  const { user, login, logout } = useAuth();

  return (
    <div className='w-screen h-screen bg-slate-900 flex flex-col items-center justify-center'>
      <div className='w-1/3 bg-slate-700 rounded-md p-4'>
        <h1 className='text-lg font-semibold text-white mb-2'>Login Page</h1>
        <Formik
          initialValues={{ email: '', password: '' }}
          onSubmit={async (values, { setStatus }) => {
            try {
              const response = await axios.post(
                'http://app-lb-1923178106.ap-south-1.elb.amazonaws.com:5000/auth/login',
                {
                  email: values.email,
                  password: values.password
                },
                {
                  headers: {
                    'Content-Type': 'application/json'
                  }
                }
              );

              await login({
                email: response.data[0].email
              });
              
              navigate('/home');
            } catch (error) {
              setStatus(error.response ? error.response.data.error : 'Something went wrong. Please try again.');
            }
          }}
        >
          {({ status }) => (
            <Form className='flex flex-col gap-4'>
              <Field name="email" type="text" placeholder="Email" className="bg-slate-900 rounded block p-2 text-white" />
              <Field name="password" type="password" placeholder="Password" className="bg-slate-900 rounded block p-2 text-white" />
              {status && <div className="text-red-500 text-sm">{status}</div>}
              <button className="bg-blue-800 p-2 rounded text-white text-md font-semibold" type="submit">Submit</button>
            </Form>
          )}
        </Formik>
        <button className="w-full bg-slate-700 mt-2 p-2 text-white mx-auto" onClick={() => { navigate('/signup') }}>New here? Sign up</button>
      </div>
    </div>
  );
};

export default Login;

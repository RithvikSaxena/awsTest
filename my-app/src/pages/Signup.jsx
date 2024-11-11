import React, { useEffect, useState } from 'react';
import { Formik, Form, Field } from 'formik';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/Context';

const SignUp = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [baseUrl, setBaseUrl] = useState('');

  useEffect(() => {
    const fetchBaseUrl = async () => {
      try {
        const result = await axios.get('/api/base-url', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } // Adjust as necessary
        });
        setBaseUrl(result.data.baseUrl); // Adjust according to your API response structure
      } catch (error) {
        console.error("Failed to fetch base URL:", error);
      }
    };

    fetchBaseUrl();
  }, []);

  return (
    <div className='w-screen h-screen bg-slate-900 flex flex-col items-center justify-center'>
      <div className='w-1/3 bg-slate-700 rounded-md p-4'>
        <h1 className='text-lg font-semibold text-white mb-2'>Sign Up</h1>
        <Formik
          initialValues={{ email: '', password: '', confirmpassword: '' }}
          onSubmit={async (values, { setStatus }) => {
            try {
              if (values.password === values.confirmpassword) {
                const response = await axios.post(
                  `${baseUrl}/auth/signup`, // Use the base URL here
                  values,
                  {
                    headers: {
                      'Content-Type': 'application/json'
                    }
                  }
                );

                // Store the token if available
                localStorage.setItem('token', response.data.token);

                await login({
                  email: values.email
                });
                navigate('/home');
              } else {
                setStatus('Passwords must match.');
              }
            } catch (error) {
              setStatus(error.response ? error.response.data.error : 'Something went wrong. Please try again.');
            }
          }}
        >
          {({ status }) => (
            <Form className='flex flex-col gap-4'>
              <Field name="email" type="email" placeholder="Email" className="bg-slate-900 rounded block p-2 text-white" />
              <Field name="password" type="password" placeholder="Password" className="bg-slate-900 rounded block p-2 text-white" />
              <Field name="confirmpassword" type="password" placeholder="Confirm Password" className="bg-slate-900 rounded block p-2 text-white" />
              {status && <div className="text-red-500 text-sm">{status}</div>}
              <button className="bg-blue-800 p-2 rounded text-white text-md font-semibold" type="submit">Sign Up</button>
            </Form>
          )}
        </Formik>
        <button className="w-full bg-slate-700 mt-2 p-2 text-white mx-auto" onClick={() => { navigate('/') }}>Already have an account? Login</button>
      </div>
    </div>
  );
};

export default SignUp;

import React from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Login from './pages/Login';
import SignUp from './pages/Signup';
import Home from './pages/Home';
import { AuthProvider } from './utils/Context';

const Router = createBrowserRouter([
  {
    path: "/",
    element: <Login />
  },
  {
    path: "/signup",
    element: <SignUp />
  },
  {
    path: "/home",
    element: <Home />
  }
]
)

const App = () => {
  return (
    <AuthProvider>
      <RouterProvider router={Router}/>
    </AuthProvider>
  );
};

export default App;

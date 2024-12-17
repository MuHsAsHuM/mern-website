import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import OAuth from '../components/OAuth';

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      setLoading(true);
      const res = await fetch('/api/auth/signup', 
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      const data = await res.json();  
      if(data.success === false){
        setError(data.message);
        setLoading(false);
        return;
      }
      setLoading(false);
      setError(null);
      navigate('/sign-in'); 
    }
    catch (error)  {
      setLoading(false);
      setError(error.message || 'An error occurred'  );
    }  
  };
  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value });
  };

  return (
    <div className='p-3 w-[30%] mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input type="text" className='border p-3 rounded-lg' id="username" placeholder='Username' onChange={handleChange}/>
        <input type="email" className='border p-3 rounded-lg' id="email" placeholder='Email' onChange={handleChange}/>
        <input type="password" className='border p-3 rounded-lg' id="password" placeholder='Password' onChange={handleChange}/>
        <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>Sign up</button>
      </form>
      <div className='flex flex-col mt-4 '>
      
      </div>
      <div className='flex gap-2 mt-5'>
        <p>Have an account?</p>
        <Link to={"/sign-in"}>
          <span className='text-blue-700'>Sign in</span>
        </Link>
      </div>
      {error && <p className='text-red-500'>{error}</p>}
    </div>
  )
}

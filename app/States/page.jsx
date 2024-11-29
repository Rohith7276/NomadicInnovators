import React from 'react'
// Import the dynamic function
import dynamic from 'next/dynamic';

import States from '../components/State.jsx';
const page = () => {
  return (
    <div>
      <States />
    </div>
  )
}

export default page
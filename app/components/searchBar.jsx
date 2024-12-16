import React, { useState } from 'react';
import Image from 'next/image';
import stateIco0 from '../../public/images/stateicon/0.png';
import stateIco1 from '../../public/images/stateicon/1.png';
import stateIco2 from '../../public/images/stateicon/2.png';
import stateIco3 from '../../public/images/stateicon/3.png';
import stateIco4 from '../../public/images/stateicon/4.png';
import stateIco5 from '../../public/images/stateicon/5.png';
import stateIco6 from '../../public/images/stateicon/6.png';
import stateIco7 from '../../public/images/stateicon/7.png';
import { setCount } from '../redux/counter/counterSlice'; 
import { useDispatch } from 'react-redux' 
import Link from 'next/link';

const SearchWithFocus = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const dispatch = useDispatch() 
  const data = [
    'Karnataka',
    'Andhra Pradesh',
    'New Delhi',
    'Telangana',
    'Bihar',
    'Assam',
    'Hariyana',
    'Tamil Nadu',
  ];
  const icon = {
    'Karnataka': stateIco0,
    'Andhra Pradesh': stateIco1,
    'New Delhi': stateIco2,
    'Telangana': stateIco3,
    'Bihar': stateIco4,
    'Assam': stateIco5,
    'Hariyana': stateIco6,
    'Tamil Nadu': stateIco7,
  };
  const filteredData = data.filter(item =>
    item.toLowerCase().includes(searchTerm.toLowerCase())
  );
const findIndex = (array, value) => {
    return array.findIndex(item => item.toLowerCase() === value.toLowerCase());
};

// Example usage:
// const index = findIndex(data, 'Mango');
// console.log(index); // Output: 5
  return (
    <div className="relative w-64 mx-acvbx mx-10dsf uto mt-1xs">
      <input
        type="text"
        className="w-full p-1 px-3 border text-black rounded focus:outline-none"
        placeholder="Search..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setTimeout(() => setIsFocused(false), 200)}
      />
      {isFocused && (
        <ul className="absolute top-10 left-0 w-full dark:scrollBrown dark:bg-orange-950 bg-white border border-gray-300 rounded max-h-80 overflow-y-auto">
          {filteredData.length > 0 ? (
            filteredData.map((item, index) => (
              <Link
              href="/States"
                key={index}
                className="p-2 hover:bg-gray-100 px-5 dark:hover:bg-orange-400  amsterdam tracking-wider py-4 text-3xl flex justify-between items-center cursor-pointer"
                // onMouseDown={() => setSearchTerm(item)}
                onClick={() => {
                
                    dispatch(setCount(findIndex(data, item)));
                    setSearchTerm(item)
                  }}
              >
                {item}
                <div className='h-fit w-fit'>
                <Image src={icon[item]} width="30" height="30" alt="blah" className='h-fit dark:invert ' unoptimized/>
                </div>
              </Link>
            ))
          ) : (
            <li className="p-2 text-gray-500">No results found</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default SearchWithFocus;

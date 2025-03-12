import React from 'react'
import FundingForm from '../Form/fundingForm'
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function FundingLayout() {
    const [createdForms, setCreatedForms] = useState([]);

    useEffect(() => {
      axios.get('/api/sponsorship_proposals')
        .then(response => {
            if (Array.isArray(response.data)) {
                setCreatedForms(response.data);
              } else {
                console.error('API response is not an array:', response.data);
              }
        })
        .catch(error => {
          console.error('There was an error fetching the created forms!', error);
        });
    }, []);
  return (
    <>
     <div className="flex flex-col md:flex-row min-h-screen">
      <div className="w-full md:w-1/2 p-4">
        <FundingForm />
      </div>
      <div className="w-full md:w-1/2 p-4 bg-gray-100">
        <h2 className="text-2xl font-semibold mb-4 text-center">Forms đã được tạo</h2>
        <ul>
          {createdForms.map((form, index) => (
            <li key={index} className="mb-4 p-4 bg-white rounded-lg shadow-md">
              <h3 className="text-lg font-semibold">{form.reason}</h3>
              <p>Số kinh phí: {form.amount}</p>
              <p>Nội dung: {form.content}</p>
              <p>Ghi chú thêm: {form.notes}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
    </>
  )
}

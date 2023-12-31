import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_ALL_QUOTES } from '../gqloperations/queries';
import { Link } from 'react-router-dom';

export default function Home() {
  const { loading, error, data } = useQuery(GET_ALL_QUOTES);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (error) {
    return <h2>Error fetching quotes: {error.message}</h2>;
  }

  if (data.quotes.length === 0) {
    return <h2>No Quotes available</h2>;
  }

  return (
    <div className="container">
      {data.quotes.map((quote, index) => (
        <blockquote key={index}>
          <h6>{quote.name}</h6>
          <p className="right-align">~
          <Link to={`/profile/${quote.by._id}`}>
              {quote.by.firstName}
            </Link>
            </p>
        </blockquote>
      ))}
    </div>
  );
}

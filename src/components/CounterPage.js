import React from 'react';
import logo from '../utils/logo.svg';
import { Counter } from './Counter';
import './CounterPage.css';

function CounterPage() {
  return (
    <div className="CounterPage">
      <h2 className="text-center mt-2">Counter</h2>
      <img src={logo} className="CounterPage-logo" alt="logo" />
      <Counter />
    </div>
  );
}

export default CounterPage;

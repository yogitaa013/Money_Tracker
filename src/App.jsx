import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [name, setName] = useState('');
  const [datetime, setDatetime] = useState('');
  const [description, setDescription] = useState('');
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
    console.log('All env vars:', import.meta.env);
    console.log('Component mounted, fetching transactions...');
    getTransactions()
      .then(data => {
        console.log('Setting transactions:', data);
        setTransactions(data);
      })
      .catch(error => {
        console.error('Error in useEffect:', error);
      });
  }, []);

  async function getTransactions() {
    // Temporarily hardcode the URL to test connection
    const url = 'http://localhost:4040/api/transactions';
    console.log('Fetching from:', url);
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Received data:', data);
      return data;
    } catch (error) {
      console.error('Fetch error:', error);
      return [];
    }
  }

  async function addNewTransaction(ev) {
    ev.preventDefault();
    // Temporarily hardcode the URL to test connection
    const url = 'http://localhost:4040/api/transaction';
    console.log('Posting to:', url);
    
    const parts = name.split(' ');
    const price = parts[0];
    const transactionName = parts.slice(1).join(' '); // Join all parts after the first

    // Better data preparation
    const transactionData = {
      price: parseFloat(price), // Ensure price is a number
      name: transactionName || 'Unnamed transaction', // Fallback if no name provided
      description,
      datetime
    };
    
    console.log('Sending data:', transactionData);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(transactionData)
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Server response:', errorData);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const json = await response.json();
      console.log('Transaction added:', json);
      setTransactions([...transactions, json]);
      setName('');
      setDatetime('');
      setDescription('');
    } catch (error) {
      console.error('Add transaction error:', error);
    }
  }

  let balance = 0;
  for (const transaction of transactions) {
    balance += transaction.price;
  }

  balance = balance.toFixed(2);
  const fraction = balance.split('.')[1];
  balance = balance.split('.')[0];

  return (
    <main>
      <h1>
        ₹{balance}<span>.{fraction}</span>
      </h1>
      <form onSubmit={addNewTransaction}>
        <div className="basic">
          <input
            type="text"
            value={name}
            onChange={ev => setName(ev.target.value)}
            placeholder={"+200 new samsung tv"}
          />
          <input
            type="datetime-local"
            value={datetime}
            onChange={ev => setDatetime(ev.target.value)}
          />
        </div>
        <div className="description">
          <input
            type="text"
            value={description}
            onChange={ev => setDescription(ev.target.value)}
            placeholder="description"
          />
        </div>
        <button type="submit">Add new transaction</button>
      </form>
      <div className="transactions">
        {transactions.length > 0 && transactions.map(transaction => (
          <div key={transaction._id} className="transaction">
            <div className="left">
              <div className="name">{transaction.name}</div>
              <div className="description">{transaction.description}</div>
            </div>
            <div className="right">
              <div className={"price " + (transaction.price < 0 ? 'red' : 'green')}>
                {transaction.price}
              </div>
              <div className="datetime">{new Date(transaction.datetime).toLocaleString()}</div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

export default App;
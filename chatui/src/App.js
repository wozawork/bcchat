import logo from './logo.svg';
import './App.css';
import ChatUI from './ChatUI';
import { BrowserRouter as Router } from 'react-router-dom';
function App() {
  return (
    <Router>
      <div className="App">
        <ChatUI />
      </div>
    </Router>
  );
}

export default App;

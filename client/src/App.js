import logo from './logo.svg';
import './App.css';
import Navbar from './components/Navbar';
import {BrowserRouter,Routes,Link} from 'react-router-dom'
import Bookingscreen from './screens/Bookingscreen';
import Homescreen from './screens/Homescreen';
import Loginscreen from './screens/Loginscreen';
import Registerscreen from './screens/Registerscreen';
function App() {
  return (
    <div className="App">
      <Navbar/> 
      <BrowserRouter>
        <Routes path="/home" exact component={Homescreen}/>
        <Routes path='/book/:roomid/:fromdate/:todate' exact component={Bookingscreen}/>
        <Routes path='/register' exact component={Registerscreen}/>
        <Routes path='/login' exact component={Loginscreen}/>
      </BrowserRouter>
    </div>
  );
}

export default App;

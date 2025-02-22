
import {BrowserRouter as Router,Routes,Route,} from "react-router-dom";
import {Home} from "./pages/Home"
import {WindowList} from "./pages/WindowList"
import { Monitoring } from "./pages/Monitoring";
import {Admin} from "./pages/Admin"
import {Navbar} from "./Navbar"
export function App() {
  return <div className="App">
    <Router>
     <Navbar/>
      <Routes>
        <Route path='' element={<Home/>}/>
        <Route path='/windowList' element={<WindowList/>}/>
        <Route path='/monitoring' element={<Monitoring/>}/>
        <Route path='/admin' element={<Admin/>}/>
        <Route path='*' element={<h1>PAGE NOT FOUND</h1>}/>
      </Routes>
    </Router>
  </div>
  
}
export default App
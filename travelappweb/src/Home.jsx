import React from 'react'
import { Link } from "react-router-dom";
import LoginForm from './LoginForm'
import "./Home.css";

const Home = () => {
    return (
        <>
            <div>Home</div>
            {/* <LoginForm /> */}
            <nav className="button-bar">
                
                    
                        <Link to="/login" className="nav-button">Login</Link>
                    
                   
                        <Link to="/formHistory" className="nav-button">History Form</Link>
                    
                        <Link to="/formFestival" className="nav-button">Festival Form</Link>
                    
                    
                        <Link to="/formArtical" className="nav-button">Article Form</Link>
                   
                        <Link to="/favorite" className="nav-button">Favorite Places</Link>
                 
                        <Link to="/" className="nav-button">Home</Link>
            </nav>

        </>
    )
}

export default Home
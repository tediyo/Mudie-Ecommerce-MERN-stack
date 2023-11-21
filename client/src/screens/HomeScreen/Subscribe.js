import Container from "../../components/Container";
//import Container from "../../components/Container";
import classes from "./Subscribe.module.css";
import { useRef } from 'react';
import React, { useState } from "react";
import * as emailjs from "emailjs-com";

const Subscribe= () => {
////////////////////

////////
    const initialFormState = {
        name: "",
        email: "",
        
    };
    const [active, setActive] = useState(false);
    const handleClick = () => {
      setActive(!active);
    };
    
   
    const [contactData, setContactData] = useState({ ...initialFormState });

    const handleChange = ({ target }) => {
        setContactData({
            ...contactData,
            [target.name]: target.value,
        });
    };
    /////////////////


/*const handleClose = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
  
      setOpen(false);
    };*/
///////////  

    const handleSubmit = (e) => {
        e.preventDefault();

        emailjs
            .sendForm(
                "service_5skrn8r",
                "template_1xa0825",
                e.target,
                "C5OJHCLywrUl3vnq8",
            )
            .then(
                (result) => {
                    console.log(result.text);
                },
                (error) => {
                    console.log(error.text);
                },
            );

        //reset the form after submission
        setContactData({ ...initialFormState });
    };

    return (
      /////////
      <div className={classes.container}>
      <Container>
        <div className={classes.content}>
          <div className={classes.intro}>
            <h3>Get update from anywhere</h3>
            <p>
            Get more for your money
            </p>
          </div>
          <div className={classes.signUp}>
            <form className={classes.form} onSubmit={handleSubmit}>
            <div className="row">
                      <div className="col-sm-6 form-group">
                     <input className={classes.input} type="text"
                         name="name" value={contactData.name}
                         onChange={handleChange}
                                required
                          placeholder="Enter your name"/>
                          
                       </div>
                       <div className="col-sm-6 form-group">
                        <input className={classes.input} type="email"
                         name="email" value={contactData.email}
                         onChange={handleChange}
                                required
                          placeholder="Enter your email"/>
                      </div> 
                </div>
                 
                      
                    
                        
                        
                            
                        
                   
                    <div className="row mt-1">
                    <div class="center">
                    <button type="submit"  onSubmit={handleSubmit}  onClick={handleClick}  style={{ backgroundColor: active ? "white" : "#241b5a" }}
         className={classes.btn} >
          { active ? "Subscribed"   : "Subscribe" } </button>
                        </div>
                    </div>
            
              
            </form>
          </div>
        </div>
      </Container>
    
      
        </div>
    );
}
export default Subscribe;

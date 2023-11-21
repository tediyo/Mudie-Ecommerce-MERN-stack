import Container from "../../components/Container";
import classes from "./FooterArea.module.css";
import { Link } from "react-router-dom";
/////////////////
import { FiAtSign, FiPhone } from 'react-icons/fi';
import { contactsData } from './contactsData';
///////////////////
const FooterArea = () => {
  return (
    <div className={classes.container}>
      <Container>
        <div className={classes.content}>
          <div className={classes.mission}>
            <h2>Our Mission</h2>
            <p>
            Welcome to Mudie, your ultimate online destination for all kinds of products! 
            We offer a vast selection of electronics, home appliances, fashion, beauty products, and much more, 
            all in one convenient place. Our online store is designed to provide you with a seamless shopping experience, with easy navigation, secure payment options, and fast and reliable shipping. At Mudie, we're committed to offering our customers the best products at competitive prices, and we constantly update our inventory to make sure we have the latest and greatest products available.
             So why wait? Start shopping at Mudie today and find everything you need in one place!
            </p>
            
          </div>
          <div className={classes.quickLink}>
            <h3>Quick Links</h3>
            <ul>
              <Link to="/">Home</Link>
              <Link to="/shop" >Shop</Link>
              
            </ul>
          </div>
          <div className={classes.contact}>
            <h3>Contact Us</h3>
            <div className={classes.wrapContact}>
              <div className={classes.card}>
                <div className={classes.icon}>
                  <i className="fas fa-location-arrow"></i>
                </div>
                <div className={classes["card-content"]}>
                  <h4>Head Office</h4>
                  <p>Bahir Dar , Ethiopia </p>
                </div>
              </div>
              <div className={classes.card}>
                <div className={classes.icon}>
                  <a ><i className="fas fa-phone" ></i></a>
                </div>
                <div className={classes["card-content"]}>
                  <h4>Phone Number</h4>
                  <p>+251947087598</p>
                  <p>+251929898575</p>
                </div>
              </div>
              <div className={classes.card}>
                <div className={classes.icon}>
                  <a href="https://mail.google.com/mail/u/?authuser=thedronberhanu05r@gmail.com"><i className="fas fa-envelope"></i></a>
                </div>
                <div className={classes["card-content"]}>
                  <h4>Email</h4>
                  <p>mudie.TDT@gmail.com</p>
                </div>
              </div>
            </div>
          </div>
        

       
        
</div>

  <div className="row">
      <div class="d-flex justify-content-center mb-4">
          <div><a class="btn btn-light btn-social mr-2" href="mailto:mudie.TDT@gmail.com"><i class="fas fa-envelope-square"></i></a></div>
          <div> <a class="btn btn-light btn-social mr-2" href="https://twitter.com/Thedron16"><i class="fab fa-twitter"></i></a></div>
          <a class="btn btn-light btn-social mr-2" href="https://www.facebook.com/profile.php?id=100093579848856"><i class="fab fa-facebook-f"></i></a>
          <a class="btn btn-light btn-social mr-2" href="https://www.linkedin.com/in/thedron-berhanu-953750230/"><i class="fab fa-linkedin-in"></i></a>
          <a class="btn btn-light btn-social" href="https://instagram.com/mudie_ecommerce?igshid=MzNlNGNkZWQ4Mg=="><i class="fab fa-instagram"></i></a>
          <a class="btn btn-light btn-social"  href="http://t.me/thedron16"><i class="fab fa-telegram"></i></a>
      </div>
      
      

</div>
      </Container>
    </div>
    
  );
};

export default FooterArea;

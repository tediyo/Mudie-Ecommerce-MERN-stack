import classes from "./SaleSection.module.css";
import Container from "../../components/Container";
const SaleSection = () => {
  return (
    <div className={classes.container}>
      <Container>
        <div className={classes.content}>
          <h3>Up to 50% Discount</h3>
          <h4>Promote Your Product</h4>
          <p>Shop ASAP</p>
          <a href="/shop">Shop Now</a>
        </div>
      </Container>
    </div>
  );
};

export default SaleSection;

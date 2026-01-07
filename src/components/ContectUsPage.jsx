import ContectUs from "../components/ContactUs.jsx";
import Navbar from "../components/Navbar.jsx";

function ContectUsPage() {

  return (
    <div>
      <div>
        <Navbar showoptions={false} />
      </div>
      <ContectUs />
    </div>
  );
}

export default ContectUsPage;

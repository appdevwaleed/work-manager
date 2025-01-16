import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function InnerLayout({ children }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}

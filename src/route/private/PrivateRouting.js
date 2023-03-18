import Home from "../../component/Home";
import Cart from "../../component/Cart";
import Admin from "../../component/Admin";
const PrivateRouting = [
  {
    path: "/home",
    Component: Home,
    exact: true,
  },
  {
    path: "/cart",
    Component: Cart,
  },
  {
    path: "/admin",
    Component: Admin,
  },
];

export default PrivateRouting;

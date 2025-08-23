import {BrowserRouter, Route, Routes} from "react-router-dom"
import {Provider} from "react-redux"
import appStore from "./store/appStore"
import Body from "./component/Body"
import Feed from "./component/Feed"
import SigninSignup from "./auth/SigninSignup"
import VeryEmail from "./auth/VeryEmail"
import EnterOTP from "./auth/EnterOtp"
import ForgotPassword from "./auth/ForgotPassword"

function App() {
  return (
    <>
    <Provider store={appStore}>
      <BrowserRouter basename="/">
      <Routes>
        <Route path="/" element={<Body/>}>
        <Route path="/" element={<Feed/>}/>
        <Route path="/auth" element={<SigninSignup/>}/>
        <Route path="/verify" element={<VeryEmail/>}/>
        <Route path="/otp" element={<EnterOTP/>}/>
        <Route path="reset-password" element={<ForgotPassword/>}/>
        </Route>
      </Routes>
      </BrowserRouter>
    </Provider>
    </>
  )
}

export default App
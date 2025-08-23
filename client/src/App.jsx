import {BrowserRouter, Route, Routes} from "react-router-dom"
import {Provider} from "react-redux"
import appStore from "./store/appStore"
import Body from "./component/Body"
import Feed from "./component/Feed"
import SigninSignup from "./auth/SigninSignup"

function App() {
  return (
    <>
    <Provider store={appStore}>
      <BrowserRouter basename="/">
      <Routes>
        <Route path="/" element={<Body/>}>
        <Route path="/" element={<Feed/>}/>
        <Route path="/auth" element={<SigninSignup/>}/>
        </Route>
      </Routes>
      </BrowserRouter>
    </Provider>
    </>
  )
}

export default App
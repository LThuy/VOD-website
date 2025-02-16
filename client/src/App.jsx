import React, { useState, Suspense, lazy } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Header from "./Components/Partials/Header";
import Footer from "./Components/Partials/Footer";
import TypeFilm from "./Components/Body/typeFlim";
import WatchFilm from "./Components/Body/WatchFilm";
import SearchResult from "./Components/Body/SearchResult";
import GenreFilm from "./Components/Body/GenreFilm";
import Login from "./Components/Login/Login";
import LoginAdmin from "./Admin/Components/AdminLogin";
import NoticeVerify from "./Components/Body/NoticeVerify";
import Register from "./Components/Login/Register";
import VerifyEmail from "./Ultil/Account/VerifyEmail";
import VerifyEmailAdmin from "./Ultil/Admin-Account/VerifyEmail";
import SuccessNotice from "./Components/Body/SuccesNotive";
import SuccessVerifyAdmin from "./Admin/Components/SuccessVerify";
import Test from "./Components/test";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer } from "react-toastify";
import Profile from "./Components/Body/Profile";
import ChangePassword from "./Components/Body/ChangePassword";
import FavoriteFilm from "./Components/Body/FavoriteFilm";
import HistoryFilm from "./Components/Body/HistoryFilm";
import ProtectedRoute from "./Components/CheckToken/TokenCheckHandle";
import ForgetPass from "./Components/Login/ForgetPass";
import ResetPassword from "./Components/Login/ResetPassword";
import CountryFilm from "./Components/Body/CountryFilm";
import CreateNewFilm from "./Components/Body/CreateNewFilm";
import YearFilm from "./Components/Body/YearFilm";
import ChangePasswordModal from "./Components/Parts/ChangePasswordModal";
import { Analytics } from "@vercel/analytics/react";

const FilmDetail = lazy(() => import("./Components/Body/FilmDetail"));
const Home = lazy(() => import("./Components/Body/Home"));

function App() {
  const location = useLocation();
  const [userEmail, setUserEmail] = useState(null);
  const shouldDisplayLayout = (pathname) => {
    const excludedPaths = [
      "/login",
      "/register",
      "/verify",
      "/successnotice",
      "/admin/login",
      "/admin/register",
      "/admin/verify",
      "/admin/success-verify",
      "/forgetpassword",
      "/reset-password",
    ];
    return !excludedPaths.some((path) => pathname.startsWith(path));
  };

  const displayLayout = shouldDisplayLayout(location.pathname);

  const LazyComponent = ({ component: Component }) => (
    <Suspense fallback={<div>Loading, please wait...</div>}>
      <Component />
    </Suspense>
  );
  return (
    <div className="App">
      <ToastContainer position="top-right" autoClose={3000} />
      {displayLayout && <Header />}
      <div id="body-content">
        <Routes>
          {/* <Route path="/" element={<Home />} /> */}
          <Route path="/test" element={<Test />} />
          <Route path="/verify" element={<NoticeVerify />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/admin/verify-email" element={<VerifyEmailAdmin />} />
          <Route path="/successnotice" element={<SuccessNotice />} />
          <Route
            path="/admin/success-verify"
            element={<SuccessVerifyAdmin />}
          />
          <Route
            path="/login"
            element={<Login setUserEmail={setUserEmail} />}
          />
          <Route
            path="/admin/login"
            element={<LoginAdmin setUserEmail={setUserEmail} />}
          />
          <Route path="/register" element={<Register />} />
          <Route path="/forgetpassword" element={<ForgetPass />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Suspense fallback={<div>Đang tải, vui lòng đợi...</div>}>
                  <Home />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-newfilm"
            element={
              <ProtectedRoute>
                <CreateNewFilm />
              </ProtectedRoute>
            }
          />
          {/* <Route
                        path="/user-management"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    /> */}
          <Route
            path="/changepassword"
            element={
              <ProtectedRoute>
                <ChangePassword />
              </ProtectedRoute>
            }
          />

          <Route
            path="/favorite"
            element={
              <ProtectedRoute>
                <FavoriteFilm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <HistoryFilm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/danh-sach/:slug"
            element={
              <ProtectedRoute>
                <TypeFilm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/filmDetail/:slug"
            element={
              <ProtectedRoute>
                <Suspense fallback={<div>Đang tải, vui lòng đợi...</div>}>
                  <FilmDetail />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/watchFilm/:slug"
            element={
              <ProtectedRoute>
                <WatchFilm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/searchFilm/:slug"
            element={
              <ProtectedRoute>
                <SearchResult />
              </ProtectedRoute>
            }
          />
          <Route
            path="/genre/:slug"
            element={
              <ProtectedRoute>
                <GenreFilm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/year/:slug"
            element={
              <ProtectedRoute>
                <YearFilm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/country/:slug"
            element={
              <ProtectedRoute>
                <CountryFilm />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
      {displayLayout && <Footer />}
      <Analytics />
    </div>
  );
}

export default App;

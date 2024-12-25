import React, { useState, Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import Header from './Components/Partials/Header'
import Footer from './Components/Partials/Footer'
// import Home from './Components/Body/Home'
import TypeFilm from './Components/Body/typeFlim'
// import FilmDetail from './Components/Body/FilmDetail'
import WatchFilm from './Components/Body/WatchFilm'
import SearchResult from './Components/Body/SearchResult'
import GenreFilm from './Components/Body/GenreFilm'
import Login from './Components/Body/Login'
import LoginAdmin from './Admin/Components/AdminLogin'
import NoticeVerify from './Components/Body/NoticeVerify'
import Register from './Components/Body/Register'
import RegisterAdmin from './Admin/Components/AdminRegister'
import VerifyEmail from './Ultil/Account/VerifyEmail';
import VerifyEmailAdmin from './Ultil/Admin-Account/VerifyEmail';
import SuccessNotice from './Components/Body/SuccesNotive';
import SuccessVerifyAdmin from './Admin/Components/SuccessVerify';
import Test from './Components/test'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from 'react-toastify';
import Profile from './Components/Body/Profile';
import ChangePassword from './Components/Body/ChangePassword';
import FavoriteFilm from './Components/Body/FavoriteFilm';
import HistoryFilm from './Components/Body/HistoryFilm';
import ProtectedRoute from './Components/CheckToken/TokenCheckHandle';
import ForgetPass from './Components/Body/ForgetPass';
import ResetPassword from './Components/Body/ResetPassword';
import CountryFilm from './Components/Body/CountryFilm';
import CreateNewFilm from './Components/Body/CreateNewFilm';
import YearFilm from './Components/Body/YearFilm';

// const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

const FilmDetail = lazy(() => import('./Components/Body/FilmDetail'));
const Home = lazy(() => import('./Components/Body/Home'));


function App() {
    const location = useLocation();
    const isLoginPage = location.pathname === '/login';
    const isForgetPassPage = location.pathname === '/forgetpassword';
    const isResetPassPage = location.pathname.startsWith('/reset-password');
    const isLoginAdminPage = location.pathname === '/admin/login';
    const isRegisterPage = location.pathname === '/register';
    const isRegisterAdminPage = location.pathname === '/admin/register';
    const isNoticeVerify = location.pathname === '/verify';
    const isNoticeVerifyAdmin = location.pathname === '/admin/verify';
    const isSuccessVerify = location.pathname === '/successnotice';
    const isSuccessVerifyAdmin = location.pathname === '/admin/success-verify';

    const [userEmail, setUserEmail] = useState(null);

    return (
        <div className="App">
            <ToastContainer position="top-right" autoClose={3000} />
            {!isLoginPage && !isRegisterPage && !isNoticeVerify && !isSuccessVerify && !isLoginAdminPage
                && !isRegisterAdminPage && !isNoticeVerifyAdmin && !isSuccessVerifyAdmin && !isForgetPassPage && !isResetPassPage && (
                    <div id="header-container">
                        <Header />
                    </div>
                )}

            <div id="body-content">

                <Routes>
                    {/* <Route path="/" element={<Home />} /> */}
                    <Route path="/test" element={<Test />} />
                    <Route path="/verify" element={<NoticeVerify />} />
                    <Route path="/verify-email" element={<VerifyEmail />} />
                    <Route path="/admin/verify-email" element={<VerifyEmailAdmin />} />
                    <Route path="/successnotice" element={<SuccessNotice />} />
                    <Route path="/admin/success-verify" element={<SuccessVerifyAdmin />} />
                    <Route path="/login" element={<Login setUserEmail={setUserEmail} />} />
                    <Route path="/admin/login" element={<LoginAdmin setUserEmail={setUserEmail} />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgetpassword" element={<ForgetPass />} />
                    <Route path="/reset-password/:token" element={<ResetPassword />} />
                    {/* <Route path="/admin/register" element={<RegisterAdmin />} /> */}
                    {/* <Route path="/profile" element={<Profile/>} />
          <Route path="/changepassword" element={<ChangePassword/>} />
          <Route path="/favorite" element={<FavoriteFilm/>} />
          <Route path="/history" element={<HistoryFilm/>} />
          <Route path="/danh-sach/:slug" element={<TypeFilm />} />
          <Route path="/filmDetail/:slug" element={<FilmDetail />} />
          <Route path="/watchFilm/:slug" element={<WatchFilm />} />
          <Route path="/searchFilm/:slug" element={<SearchResult />} />
          <Route path="/genre/:slug" element={<GenreFilm />} /> */}
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
            {
                !isLoginPage && !isRegisterPage && !isNoticeVerify && !isSuccessVerify && !isLoginAdminPage
                && !isRegisterAdminPage && !isNoticeVerifyAdmin && !isSuccessVerifyAdmin && !isForgetPassPage && !isResetPassPage && (
                    <div id="footer-container">
                        <Footer />
                    </div>
                )
            }

        </div>
    );
}

export default App;
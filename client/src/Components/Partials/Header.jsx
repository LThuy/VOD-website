import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../Style/PartialsCss/Header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList, faMagnifyingGlass, faUser, faStar, faRightFromBracket, faClockRotateLeft, faPeopleRoof, faPlus } from '@fortawesome/free-solid-svg-icons';
import '../../Style/Responsive/Responsive.css'

import { useHandleEnterSearchFilm } from '../../Ultil/Hepler/navigationHelpers'

function Header() {
    const navigate = useNavigate()
    const [isOpen, setOpen] = useState(false)
    const inputBox = useRef(null)
    const handleEnterSearchFilm = useHandleEnterSearchFilm()

    const [isNavOpen, setIsNavOpen] = useState(false);
    const [isActive, setIsActive] = useState(false);

    // Function to open the nav
    const openNav = () => {
        setIsNavOpen(true);
    };

    // Function to close the nav
    const closeNav = () => {
        setIsNavOpen(false);
        setIsActive(false);
    };

    const hanldeSearchIconClick = () => {
        setOpen(!isOpen)
        inputBox.current.focus()
    }
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleEnterSearchFilm(inputBox.current.value)
        }
    };


    // Click handler for the list icon
    const handleClick = () => {
        setIsActive(!isActive); // Toggle 'active' class on headerList
        if (isNavOpen) {
            closeNav();
        } else {
            openNav();
        }
    };
    // render user's email
    const [userEmail, setUserEmail] = useState(null);
    const [userName, setUserName] = useState(null);
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const email = localStorage.getItem("userEmail");
        const userrole = localStorage.getItem('userRole');
        if (email) {
            setUserEmail(email);
            const name = email.split("@")[0];
            setUserName(name);
            setUserRole(userrole)
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userId');
        setUserEmail(null); // Reset state
        setUserName(null); // Reset state
        navigate('/login');
    };

    

    return (
        <header>
            <div className="main-container">
                <div className="grid-container">
                    <header id="header">
                        <div onClick={handleClick} className={`header-list ${isActive ? 'active' : ''}`} >
                            <FontAwesomeIcon className="header-list_icon" icon={faList} />
                        </div>
                        <h2 className="nameWeb">TTFilm</h2>
                        <nav className={`nav ${isNavOpen ? 'open' : ''}`}>
                            <ul className="navcontainer">
                                <li className="nav-item" onClick={closeNav}><Link to="/" className="nav-item_link">Trang Chủ</Link></li>
                                <li className="nav-item nav-item_hover">
                                    <a className="nav-item_link" >Thể Loại</a>
                                    <div className="subnav-genr">
                                        <ul className="genr-list">
                                            <li className="genr-list-item"><Link to="/genre/hanh-dong" className="genr-list-item_link">Hành Động</Link></li>
                                            <li className="genr-list-item"><Link to="/genre/tinh-cam" className="genr-list-item_link">Tình Cảm</Link></li>
                                            <li className="genr-list-item"><Link to="/genre/hai-huoc" className="genr-list-item_link">Hài Hước</Link></li>
                                            <li className="genr-list-item"><Link to="/genre/gia-dinh" className="genr-list-item_link">Gia Đình</Link></li>
                                        </ul>
                                        <ul className="genr-list">
                                            <li className="genr-list-item"><a href="/genre/chinh-kich" className="genr-list-item_link">Chính Kịch</a></li>
                                            <li className="genr-list-item"><a href="/genre/hoat-hinh" className="genr-list-item_link">Anime</a></li>
                                            <li className="genr-list-item"><a href="/genre/khoa-hoc" className="genr-list-item_link">Khoa Học</a></li>
                                            <li className="genr-list-item"><a href="/genre/phieu-luu" className="genr-list-item_link">Phiêu Lưu</a></li>
                                        </ul>
                                        <ul className="genr-list">
                                            <li className="genr-list-item"><a href="/genre/chien-tranh" className="genr-list-item_link">Chiến Tranh</a></li>
                                            <li className="genr-list-item"><a href="/genre/the-thao" className="genr-list-item_link">Thể Thao</a></li>
                                            <li className="genr-list-item"><a href="/genre/lich-su" className="genr-list-item_link">Lịch Sử</a></li>
                                            <li className="genr-list-item"><a href="/genre/bi-an" className="genr-list-item_link">Bí Ẩn</a></li>
                                        </ul>
                                        <ul className="genr-list">
                                            <li className="genr-list-item"><a href="/genre/tam-li" className="genr-list-item_link">Tâm Lí</a></li>
                                            <li className="genr-list-item"><a href="/genre/co-trang" className="genr-list-item_link">Cổ Trang</a></li>
                                            <li className="genr-list-item"><a href="/genre/vo-thuat" className="genr-list-item_link">Võ Thuật</a></li>
                                            <li className="genr-list-item"><a href="/genre/kinh-di" className="genr-list-item_link">Kinh Dị</a></li>
                                        </ul>
                                        <ul className="genr-list">
                                            <li className="genr-list-item"><a href="/genre/truyen-hinh" className="genr-list-item_link">Truyền Hình</a></li>
                                            <li className="genr-list-item"><a href="/genre/than-thoai" className="genr-list-item_link">Thần Thoại</a></li>
                                            <li className="genr-list-item"><a href="/genre/vien-tuong" className="genr-list-item_link">Viễn Tưởng</a></li>
                                            <li className="genr-list-item"><a href="/genre/am-nhac" className="genr-list-item_link">Âm Nhạc</a></li>
                                        </ul>
                                    </div>
                                </li>
                                <li className="nav-item" onClick={closeNav}><Link to="/danh-sach/phim-le" className="nav-item_link">Phim Lẻ</Link></li>
                                <li className="nav-item" onClick={closeNav}><Link to="/danh-sach/phim-bo" className="nav-item_link">Phim Bộ</Link></li>
                                <li className="nav-item topphim-hover">
                                    <a className="nav-item_link" href="">Năm Phát Hành</a>
                                    <div className="subnav-topphim">
                                        <ul className="topphim-list">
                                            <li className="topphim-list-item"><Link className="topphim-list-item_link" to={'/year/2024'}>2024</Link></li>
                                            <li className="topphim-list-item"><Link className="topphim-list-item_link" to={'/year/2023'}>2023</Link></li>
                                            <li className="topphim-list-item"><Link className="topphim-list-item_link" to={'/year/2022'}>2022</Link></li>
                                        </ul>
                                        <ul className="topphim-list">
                                            <li className="topphim-list-item"><Link className="topphim-list-item_link" to={'/year/2021'}>2021</Link></li>
                                            <li className="topphim-list-item"><Link className="topphim-list-item_link" to={'/year/2020'}>2020</Link></li>
                                            <li className="topphim-list-item"><Link className="topphim-list-item_link" to={'/year/2019'}>2019</Link></li>
                                        </ul>
                                    </div>
                                </li>
                            </ul>
                        </nav>
                        <div className="user_search">
                            <div className="user_search-search">
                                <FontAwesomeIcon onClick={hanldeSearchIconClick} className="user_search-searchicon" icon={faMagnifyingGlass} />
                                <div className={`inputbox transition-inputbox ${isOpen ? 'open' : ''}`}>
                                    <input onKeyDown={handleKeyDown} ref={inputBox} placeholder="Search Film Name" className="input-search" type="text" />
                                </div>
                            </div>

                            <div className="account">
                                {userName ? (
                                    <div className='profile-icon-container'>
                                        <Link to='/profile' className='user-afterlogin'>
                                            <div className="usericon-container">
                                                <FontAwesomeIcon className="account-icon" icon={faUser} />
                                                <span className="user-email">{userName}</span>
                                            </div>
                                        </Link>
                                        <div className="sub-profilenav">
                                            <ul className="profile-list">
                                                <Link to={"/profile"} className="profile-list-item">
                                                    <FontAwesomeIcon className="profile-icon" icon={faUser} />
                                                    <span>Hồ Sơ</span>
                                                </Link>
                                                <Link to={"/favorite"} className="profile-list-item">
                                                    <FontAwesomeIcon className="profile-icon" icon={faStar} />
                                                    <span>Phim Yêu Thích</span>
                                                </Link>
                                                <Link to={"/history"} className="profile-list-item">
                                                    <FontAwesomeIcon className="profile-icon" icon={faClockRotateLeft} />
                                                    <span>Lịch sử xem phim</span>
                                                </Link>
                                                {userRole === "admin" && (
                                                    <>
                                                        <a href={`http://localhost:3001/dashboard?username=${encodeURIComponent(userName)}`} className="profile-list-item">
                                                            <FontAwesomeIcon className="profile-icon" icon={faPeopleRoof} />
                                                            <span>Dashboard</span>
                                                        </a>
                                                        <Link to={"/create-newfilm"} className="profile-list-item">
                                                            <FontAwesomeIcon className="profile-icon" icon={faPlus} />
                                                            <span>Đăng phim mới</span>
                                                        </Link>
                                                    </>
                                                )}
                                                <div onClick={handleLogout} className="profile-list-item">
                                                    <FontAwesomeIcon className="profile-icon" icon={faRightFromBracket} />
                                                    <span>Đăng Xuất</span>
                                                </div>
                                            </ul>

                                        </div>
                                    </div>
                                ) : (
                                    <Link to="/login" className="user-link">
                                        <FontAwesomeIcon className="account-icon" icon={faUser} />
                                    </Link>
                                )}
                            </div>

                        </div>
                    </header>
                </div>
            </div>
            <div className={`overlay ${isNavOpen ? 'open' : ''}`} onClick={closeNav} />
        </header>
    );
}

export default Header
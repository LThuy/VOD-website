import React from 'react';
import '../../Style/PartialsCss/Footer.scss'; // Ensure the path to your CSS file is correct
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

function Footer() {
    return (
        <div >
            <div className='footer-container'>
                <footer id="footer">
                    <div className="grid">
                        <div className="row">
                            <ul className="footer-genr-list col col-lg-2 col-md-4 col-6">
                                <li>TTFilm</li>
                                <img className="logo-footer" src="/assets/images/logo-no-background.png" alt="TTFilm logo" />
                            </ul>
                            <ul className="footer-genr-list col col-lg-2 col-md-4 col-6">
                                <li className="footer-genr-list-item"><a style={{ color: '#66ad31' }} href="" className="footer-genr-list-item_link">Fantastic Film</a></li>
                                <li className="footer-genr-list-item"><Link to={"/country/viet-nam"} href="" className="footer-genr-list-item_link">VietNam Film</Link></li>
                                <li className="footer-genr-list-item"><Link to={"/country/au-my"} className="footer-genr-list-item_link">American Film</Link></li>
                                <li className="footer-genr-list-item"><Link to={"/country/han-quoc"} href="" className="footer-genr-list-item_link">Korean Film</Link></li>
                                <li className="footer-genr-list-item"><Link to={"/country/trung-quoc"} href="" className="footer-genr-list-item_link">China Film</Link></li>
                                <li className="footer-genr-list-item"><Link to={"/country/thai-lan"} href="" className="footer-genr-list-item_link">ThaiLand Film</Link></li>
                                <li className="footer-genr-list-item"><Link to={"/country/an-do"} href="" className="footer-genr-list-item_link">India Film</Link></li>
                            </ul>
                            <ul className="footer-genr-list col col-lg-2 col-md-4 col-6">
                                <li className="footer-genr-list-item"><a style={{ color: '#66ad31' }} href="" className="footer-genr-list-item_link">New Film</a></li>
                                <li className="footer-genr-list-item"><Link to="/danh-sach/phim-le" className="footer-genr-list-item_link">Movie Theaters</Link></li>
                                <li className="footer-genr-list-item"><Link to="/danh-sach/phim-bo" className="footer-genr-list-item_link">Series Film</Link></li>
                                <li className="footer-genr-list-item"><Link to={"/danh-sach"} className="footer-genr-list-item_link">Action Film</Link></li>
                                <li className="footer-genr-list-item"><Link to={"/danh-sach"} className="footer-genr-list-item_link">Fantasy Movie</Link></li>
                                <li className="footer-genr-list-item"><Link to={"/danh-sach"} className="footer-genr-list-item_link">Drama Film</Link></li>
                            </ul>
                            <ul className="footer-genr-list col col-lg-2 col-md-4 col-6">
                                <li className="footer-genr-list-item"><a style={{ color: '#66ad31' }} href="" className="footer-genr-list-item_link">About Us</a></li>
                                <ul className="aboutus-icon-list">
                                    <li className="footer-genr-list-item c-3"><a href="https://www.facebook.com/thinhjbeosofficial/?locale=vi_VN" className="aboutus-icon_link"><FontAwesomeIcon icon={faFacebook} className="aboutus-icon" /></a></li>
                                    <li className="footer-genr-list-item c-3"><a href="https://www.instagram.com/thinhbeo1123/" className="aboutus-icon_link"><FontAwesomeIcon icon={faInstagram} className="aboutus-icon" /></a></li>
                                    <li className="footer-genr-list-item c-3"><a href="https://www.linkedin.com/in/th%E1%BB%8Bnh-tr%E1%BA%A7n-501b45217/" className="aboutus-icon_link"><FontAwesomeIcon icon={faLinkedin} className="aboutus-icon" /></a></li>
                                    <li className="footer-genr-list-item c-3"><a href="mailto:kieplulanh93@gmail.com" className="aboutus-icon_link"><FontAwesomeIcon icon={faEnvelope} className="aboutus-icon" /></a></li>
                                </ul>
                            </ul>
                            <ul className="footer-genr-list col col-lg-2 col-md-4 col-6">
                                <li className="footer-genr-list-item"><a style={{ color: '#66ad31' }} href="" className="footer-genr-list-item_link">Contact With Us</a></li>
                                <li className="footer-genr-list-item"><a href="" className="footer-genr-list-item_link">Ask Question</a></li>
                                <li className="footer-genr-list-item"><a href="" className="footer-genr-list-item_link">Contact</a></li>
                                <li className="footer-genr-list-item"><a href="" className="footer-genr-list-item_link">News</a></li>
                            </ul>
                            <ul  className="footer-genr-list col col-lg-2 col-md-4">
                                <li className="footer-genr-list-item"><a style={{ color: '#66ad31' }} href="" className="footer-genr-list-item_link">Information</a></li>
                                <li className="footer-genr-list-item"><a href="" className="footer-genr-list-item_link">Terms of use</a></li>
                                <li className="footer-genr-list-item"><a href="" className="footer-genr-list-item_link">Application Policy</a></li>
                                <li className="footer-genr-list-item"><a href="" className="footer-genr-list-item_link">Copyright complaint</a></li>
                            </ul>
                        </div>
                    </div>
                </footer>
                <div id="footer_copyright">
                    <h2>Copyright © TTFilm</h2>
                </div>
            </div>
        </div>
    );
}

export default Footer;

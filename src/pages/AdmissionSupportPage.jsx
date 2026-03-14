import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/admission-support.css";

import schoolImage from "../assets/images/Sgu.png";
import logoIcon from "../assets/images/favicon.png";
import headerBanner from "../assets/images/sg_background.jpg";
import ChatbotBox from "../components/chatbot/ChatbotBox";

export default function AdmissionSupportPage() {
    return (
        <div className="admission-page-wrapper">
            <section className="top-banner-section">
                <div className="top-banner-image-wrapper">
                    <img
                        src={headerBanner}
                        alt="Sai Gon University"
                        className="top-banner-image"
                    />

                    <div className="top-banner-overlay">
                        <div className="container">
                            <div className="top-banner-content">
                                <p className="admission-badge">SAIGON UNIVERSITY</p>

                                <div className="title-group">
                                    <h1 className="admission-page-title">
                                        TƯ VẤN TUYỂN SINH
                                    </h1>
                                    <div className="title-divider"></div>
                                </div>

                                <p className="admission-page-subtitle banner-subtitle">
                                    Cổng thông tin hỗ trợ tra cứu và tư vấn tuyển sinh
                                    Trường Đại học Sài Gòn.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="admission-main-section py-5">
                <div className="container">
                    <div className="row g-4 align-items-stretch">
                        <div className="col-lg-5">
                            <div className="admission-info-card h-100 fade-in-up">
                                <div className="contact-item d-flex align-items-start gap-3">
                                    <div className="contact-icon-circle">
                                        <img
                                            src={logoIcon}
                                            alt="SGU icon"
                                            className="contact-icon-img"
                                        />
                                    </div>
                                    <div>
                                        <h5>Địa chỉ</h5>
                                        <p>
                                            273 An Dương Vương, Phường Chợ Quán,
                                            TP. Hồ Chí Minh
                                        </p>
                                    </div>
                                </div>

                                <div className="contact-item d-flex align-items-start gap-3">
                                    <div className="contact-icon-circle">
                                        <span className="contact-symbol">☎</span>
                                    </div>
                                    <div>
                                        <h5>Hotline tuyển sinh</h5>
                                        <p>000 000 0000</p>
                                    </div>
                                </div>

                                <div className="contact-item d-flex align-items-start gap-3">
                                    <div className="contact-icon-circle">
                                        <span className="contact-symbol">✉</span>
                                    </div>
                                    <div>
                                        <h5>Email</h5>
                                        <p>tuyensinh@sgu.edu.vn</p>
                                    </div>
                                </div>

                                <div className="school-image-box">
                                    <img
                                        src={schoolImage}
                                        alt="Trường Đại học Sài Gòn"
                                        className="school-main-image"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-7">
                            <ChatbotBox />
                        </div>
                    </div>
                </div>
            </section>

            <footer className="simple-footer">
                <div className="container">
                    <div className="row justify-content-center g-4 footer-two-columns">
                        <div className="col-md-5 col-lg-4">
                            <div className="footer-column-box">
                                <h5 className="footer-heading">Liên hệ</h5>
                                <p className="footer-text mb-2">
                                    Cơ sở chính: 273 An Dương Vương, Phường Chợ Quán,
                                    TP. Hồ Chí Minh
                                </p>
                                <p className="footer-text mb-2">SĐT: 000 000 0000</p>
                                <p className="footer-text mb-0">
                                    Email: tuyensinh@sgu.edu.vn
                                </p>
                            </div>
                        </div>

                        <div className="col-md-5 col-lg-4">
                            <div className="footer-column-box">
                                <h5 className="footer-heading">Theo dõi</h5>
                                <div className="footer-links-list">
                                    <a href="#" className="footer-link-item">
                                        Facebook
                                    </a>
                                    <a href="#" className="footer-link-item">
                                        Website chính thức
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="footer-bottom-line">
                        © 2026 SaiGon University - Hiện thực hóa ý tưởng Kim Anh
                    </div>
                </div>
            </footer>
        </div>
    );
}
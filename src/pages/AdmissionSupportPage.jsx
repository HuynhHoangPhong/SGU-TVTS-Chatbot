import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/admission-support.css";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaFacebookF,
    FaGlobe,
    FaTiktok,
    FaMapMarkerAlt,
    FaPhoneAlt,
    FaEnvelope,
    FaSchool,
    FaHome,
    FaUniversity,
} from "react-icons/fa";

import schoolImage from "../assets/images/Sgu.png";
import headerBanner from "../assets/images/sg_background.jpg";
import ChatbotBox from "../components/chatbot/ChatbotBox";

export default function AdmissionSupportPage() {
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "auto" });
    }, []);

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
                                <div className="score-tool-buttons-list">
                                    <button
                                        type="button"
                                        className="score-suggestion-btn score-suggestion-btn-block"
                                        onClick={() => navigate("/score-calculator")}
                                    >
                                        Công cụ tính điểm demo
                                    </button>

                                    <a
                                        href="https://xettuyen.sgu.edu.vn/public/tinh-diem-thpt"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="score-suggestion-btn score-suggestion-btn-block"
                                    >
                                        Tính điểm THPT
                                    </a>

                                    <a
                                        href="https://xettuyen.sgu.edu.vn/public/tinh-diem-dgnl-view"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="score-suggestion-btn score-suggestion-btn-block"
                                    >
                                        Tính điểm ĐGNL-HCM
                                    </a>

                                    <a
                                        href="https://xettuyen.sgu.edu.vn/public/tinh-diem-vsat-view"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="score-suggestion-btn score-suggestion-btn-block"
                                    >
                                        Tính điểm VSAT
                                    </a>
                                </div>

                                <div className="school-image-box school-image-box-spaced">
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
                        <div className="col-lg-6">
                            <div className="footer-column-box">
                                <h5 className="footer-heading">Liên hệ</h5>

                                <div className="footer-contact-item">
                                    <span className="footer-contact-icon">
                                        <FaMapMarkerAlt />
                                    </span>
                                    <p className="footer-text mb-0">
                                        <strong>Trụ sở chính:</strong> 273 An Dương Vương,
                                        Phường Chợ Quán, TP. HCM
                                    </p>
                                </div>

                                <div className="footer-contact-item">
                                    <span className="footer-contact-icon">
                                        <FaUniversity />
                                    </span>
                                    <p className="footer-text mb-0">
                                        <strong>Cơ sở 1:</strong> 105 Bà Huyện Thanh Quan,
                                        Phường Xuân Hòa, TP. HCM
                                    </p>
                                </div>

                                <div className="footer-contact-item">
                                    <span className="footer-contact-icon">
                                        <FaUniversity />
                                    </span>
                                    <p className="footer-text mb-0">
                                        <strong>Cơ sở 2:</strong> 04 Tôn Đức Thắng,
                                        Phường Sài Gòn, TP. HCM
                                    </p>
                                </div>

                                <div className="footer-contact-item">
                                    <span className="footer-contact-icon">
                                        <FaHome />
                                    </span>
                                    <p className="footer-text mb-0">
                                        <strong>Ký túc xá:</strong> 99 An Dương Vương,
                                        Phường Phú Định, TP. HCM
                                    </p>
                                </div>

                                <div className="footer-contact-item">
                                    <span className="footer-contact-icon">
                                        <FaSchool />
                                    </span>
                                    <p className="footer-text mb-0">
                                        <strong>Trường Trung học Thực hành Sài Gòn:</strong>{" "}
                                        220 Trần Bình Trọng, Phường Chợ Quán, TP. HCM
                                    </p>
                                </div>

                                <div className="footer-contact-item">
                                    <span className="footer-contact-icon">
                                        <FaSchool />
                                    </span>
                                    <p className="footer-text mb-0">
                                        <strong>
                                            Trường Tiểu học Thực hành Đại học Sài Gòn:
                                        </strong>{" "}
                                        18 – 20 Ngô Thời Nhiệm, Phường Xuân Hòa, TP. HCM
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-4">
                            <div className="footer-column-box">
                                <h5 className="footer-heading">Kết nối & thông tin</h5>

                                <div className="footer-contact-item">
                                    <span className="footer-contact-icon">
                                        <FaPhoneAlt />
                                    </span>
                                    <p className="footer-text mb-0">
                                        <strong>Hotline:</strong> 000 000 0000
                                    </p>
                                </div>

                                <div className="footer-contact-item">
                                    <span className="footer-contact-icon">
                                        <FaEnvelope />
                                    </span>
                                    <p className="footer-text mb-0">
                                        <strong>Email:</strong> tuyensinh@sgu.edu.vn
                                    </p>
                                </div>

                                <div className="footer-links-list footer-links-list-spaced">
                                    <a
                                        href="https://www.facebook.com/groups/daihocsaigon.sgu"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="footer-link-item footer-link-with-icon"
                                    >
                                        <span className="footer-link-icon">
                                            <FaFacebookF />
                                        </span>
                                        Facebook
                                    </a>

                                    <a
                                        href="https://tuyensinh.sgu.edu.vn/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="footer-link-item footer-link-with-icon"
                                    >
                                        <span className="footer-link-icon">
                                            <FaGlobe />
                                        </span>
                                        Website chính thức
                                    </a>

                                    <a
                                        href="https://www.tiktok.com/@sinhviendhsg"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="footer-link-item footer-link-with-icon"
                                    >
                                        <span className="footer-link-icon">
                                            <FaTiktok />
                                        </span>
                                        TikTok
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
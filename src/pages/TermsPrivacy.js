
import React from 'react';
import { useNavigate } from 'react-router-dom';

const TermsPrivacy = () => {
    const navigate = useNavigate();

    return (
        <div className="terms-container">
            <div className="terms-header">
                <h1>Terms of Service & Privacy Policy</h1>
                <button className="back-button" onClick={() => navigate(-1)}>Back</button>
            </div>

            <div className="terms-content">
                <section>
                    <h2>1. Terms of Service</h2>
                    <p>Last updated: February 2026</p>

                    <h3>1.1 Acceptance of Terms</h3>
                    <p>By accessing and using Akshuu Transports ("the Service"), you accept and agree to be bound by the terms and provision of this agreement.</p>

                    <h3>1.2 Use of Service</h3>
                    <p>You agree to use this service only for lawful purposes. You are prohibited from violating or attempting to violate the security of the Service.</p>

                    <h3>1.3 Account Responsibilities</h3>
                    <p>You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.</p>
                </section>

                <section>
                    <h2>2. Privacy Policy</h2>
                    <p>Your privacy is important to us. This policy explains how we collect and use your information.</p>

                    <h3>2.1 Information Collection</h3>
                    <p>We collect information that you provide directly to us, such as when you create an account, update your profile, or use our location-based services.</p>

                    <h3>2.2 Use of Information</h3>
                    <p>We use the information we collect to operate, maintain, and provide the features of the Service, including real-time bus tracking and attendance monitoring.</p>

                    <h3>2.3 Data Security</h3>
                    <p>We implement appropriate technical and organizational measures to protect specific personal data against unauthorized or unlawful processing.</p>

                    <h3>2.4 Location Data</h3>
                    <p>Our app requires access to your location data to provide real-time tracking services. This data is only used when the app is active and for the purpose of transportation logistics.</p>
                </section>

                <section>
                    <h2>3. Contact Us</h2>
                    <p>If you have any questions about these Terms, please contact us at support@akshuutransports.com.</p>
                </section>
            </div>

            <style>{`
                .terms-container {
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 40px 20px;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    color: #333;
                    line-height: 1.6;
                }
                .terms-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 2px solid #eee;
                    padding-bottom: 20px;
                    margin-bottom: 30px;
                }
                .terms-header h1 {
                    font-size: 2rem;
                    color: #2c3e50;
                    margin: 0;
                }
                .back-button {
                    background-color: #f8f9fa;
                    border: 1px solid #ddd;
                    padding: 8px 16px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-weight: 600;
                    transition: all 0.2s;
                }
                .back-button:hover {
                    background-color: #e2e6ea;
                }
                section {
                    margin-bottom: 40px;
                    background: #fff;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                }
                h2 {
                    color: #2c3e50;
                    border-bottom: 1px solid #eee;
                    padding-bottom: 10px;
                    margin-top: 0;
                }
                h3 {
                    color: #34495e;
                    margin-top: 20px;
                    font-size: 1.1rem;
                }
                p {
                    color: #666;
                    margin-bottom: 15px;
                }
                @media (max-width: 600px) {
                    .terms-header {
                        flex-direction: column;
                        gap: 15px;
                        text-align: center;
                    }
                }
            `}</style>
        </div>
    );
};

export default TermsPrivacy;

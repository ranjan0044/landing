import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer} id="contact">
            <div className="container">
                <div className={styles.footerContent}>
                    {/* Company Column */}
                    <div className={styles.column}>
                        <div className={styles.logo}>Yantras</div>
                        <p className={styles.tagline}>
                            Building the operating systems for modern businesses
                        </p>
                        <div className={styles.social}>
                            <a href="#" className={styles.socialLink} aria-label="Twitter">
                                <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                                </svg>
                            </a>
                            <a href="#" className={styles.socialLink} aria-label="LinkedIn">
                                <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                                    <circle cx="4" cy="4" r="2" />
                                </svg>
                            </a>
                            <a href="#" className={styles.socialLink} aria-label="GitHub">
                                <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Company Links */}
                    <div className={styles.column}>
                        <h4 className={styles.columnTitle}>Company</h4>
                        <ul className={styles.linkList}>
                            <li><a href="#company">About Us</a></li>
                            <li><a href="#company">Careers</a></li>
                            <li><a href="#company">Press Kit</a></li>
                            <li><a href="#company">Blog</a></li>
                            <li><a href="#contact">Contact</a></li>
                        </ul>
                    </div>

                    {/* Products Links */}
                    <div className={styles.column}>
                        <h4 className={styles.columnTitle}>Products</h4>
                        <ul className={styles.linkList}>
                            <li><a href="#products">Accounting</a></li>
                            <li><a href="#products">CRM</a></li>
                            <li><a href="#products">Point of Sale</a></li>
                            <li><a href="#products">Inventory</a></li>
                            <li><a href="#products">All Products</a></li>
                        </ul>
                    </div>

                    {/* Resources Links */}
                    <div className={styles.column}>
                        <h4 className={styles.columnTitle}>Resources</h4>
                        <ul className={styles.linkList}>
                            <li><a href="#resources">Documentation</a></li>
                            <li><a href="#resources">API Reference</a></li>
                            <li><a href="#resources">Tutorials</a></li>
                            <li><a href="#resources">Community</a></li>
                            <li><a href="#resources">Support</a></li>
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div className={styles.column}>
                        <h4 className={styles.columnTitle}>Legal</h4>
                        <ul className={styles.linkList}>
                            <li><a href="#legal">Privacy Policy</a></li>
                            <li><a href="#legal">Terms of Service</a></li>
                            <li><a href="#legal">Cookie Policy</a></li>
                            <li><a href="#legal">Compliance</a></li>
                            <li><a href="#legal">Security</a></li>
                        </ul>
                    </div>
                </div>

                {/* Footer Bottom */}
                <div className={styles.footerBottom}>
                    <p className={styles.copyright}>
                        © {new Date().getFullYear()} Yantras. All rights reserved.
                    </p>
                    <div className={styles.badges}>
                        <span className={styles.badge}>Made with ❤️ for businesses</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

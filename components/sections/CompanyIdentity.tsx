import styles from './CompanyIdentity.module.css';
import { PuzzleIcon, ZapIcon, WorldIcon, LockIcon } from '@/components/ui/Icons';

export default function CompanyIdentity() {
    return (
        <section className={styles.section} id="company">
            <div className="container">
                <div className={styles.content}>
                    <h2 className={styles.title}>
                        What is <span className="accent-text purple underline">Yantras</span>?
                    </h2>
                    <p className={styles.description}>
                        Yantras is a cutting-edge technology company dedicated to building comprehensive
                        business software solutions. We create powerful ERP modules, automation tools, and
                        integrated systems that scale with your ambitions.
                    </p>

                    <div className={styles.valueGrid}>
                        <div className={`card ${styles.valueCard}`}>
                            <div className={styles.valueIcon}>
                                <PuzzleIcon size={32} />
                            </div>
                            <h3 className={styles.valueTitle}>Modular Products</h3>
                            <p className={styles.valueText}>
                                Choose what you need, when you need it. Our products work seamlessly together or standalone.
                            </p>
                        </div>

                        <div className={`card ${styles.valueCard} ${styles.highlightYellow}`}>
                            <div className={styles.valueIcon}>
                                <ZapIcon size={32} />
                            </div>
                            <h3 className={styles.valueTitle}>Automation-First</h3>
                            <p className={styles.valueText}>
                                Reduce manual work with intelligent automation built into every product.
                            </p>
                        </div>

                        <div className={`card ${styles.valueCard}`}>
                            <div className={styles.valueIcon}>
                                <WorldIcon size={32} />
                            </div>
                            <h3 className={styles.valueTitle}>Scalable for Global Use</h3>
                            <p className={styles.valueText}>
                                From startups to enterprises, our platform grows with your business worldwide.
                            </p>
                        </div>

                        <div className={`card ${styles.valueCard}`}>
                            <div className={styles.valueIcon}>
                                <LockIcon size={32} />
                            </div>
                            <h3 className={styles.valueTitle}>Secure & Role-Based</h3>
                            <p className={styles.valueText}>
                                Enterprise-grade security with granular role-based access control.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
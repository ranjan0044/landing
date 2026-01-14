import styles from './CTASection.module.css';
import { ArrowRightIcon } from '@/components/ui/Icons';

export default function CTASection() {
    return (
        <section className={styles.section} id="demo">
            <div className="container">
                <div className={styles.ctaBox}>
                    <div className={styles.content}>
                        <h2 className={styles.title}>
                            Build Your Business on <span className="accent-text yellow underline">Yantras</span>
                        </h2>
                        <p className={styles.subtitle}>
                            Join hundreds of businesses already transforming their operations with Yantras.
                            Start your free trial today—no credit card required.
                        </p>

                        <div className={styles.ctaButtons}>
                            <a href="#products" className="btn btn-secondary btn-lg">
                                Explore Products
                                <ArrowRightIcon size={20} />
                            </a>
                            <a href="#contact" className={`btn ${styles.btnOutlineWhite} btn-lg`}>
                                Contact Sales
                            </a>
                        </div>

                        <div className={styles.features}>
                            <div className={styles.featureItem}>
                                <span className={styles.checkmark}>✓</span>
                                <span>14-day free trial</span>
                            </div>
                            <div className={styles.featureItem}>
                                <span className={styles.checkmark}>✓</span>
                                <span>No credit card required</span>
                            </div>
                            <div className={styles.featureItem}>
                                <span className={styles.checkmark}>✓</span>
                                <span>Cancel anytime</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
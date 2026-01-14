import styles from './HeroSection.module.css';
import { ArrowRightIcon } from '@/components/ui/Icons';

export default function HeroSection() {
    return (
        <section className={styles.hero} id="home">
            <div className="container">
                <div className={styles.heroContent}>
                    <div className={styles.heroLeft}>
                        <h1 className={styles.headline}>
                            The best place to{' '}
                            <span className="accent-text purple underline">learn</span>{' '}
                            and <span className="accent-text yellow underline">grow</span> for your business
                        </h1>
                        <p className={styles.subtext}>
                            Discover thousands of powerful and integrated business tools to support your company's growth and success.
                        </p>
                        <div className={styles.ctaGroup}>
                            <a href="#products" className="btn btn-primary btn-lg">
                                Get started
                                <ArrowRightIcon size={20} className={styles.btnIcon} />
                            </a>
                            <a href="#contact" className="btn btn-outline btn-lg">
                                Contact Us
                            </a>
                        </div>

                        <div className={styles.trustBadges}>
                            <div className={styles.trustItem}>
                                <div className={styles.trustNumber}>500+</div>
                                <div className={styles.trustLabel}>Businesses</div>
                            </div>
                            <div className={styles.trustItem}>
                                <div className={styles.trustNumber}>99.9%</div>
                                <div className={styles.trustLabel}>Uptime</div>
                            </div>
                            <div className={styles.trustItem}>
                                <div className={styles.trustNumber}>24/7</div>
                                <div className={styles.trustLabel}>Support</div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.heroRight}>
                        <div className={styles.visualContainer}>
                            <div className={styles.decorativeCircle1}></div>
                            <div className={styles.decorativeCircle2}></div>
                            <div className={styles.heroImage}>
                                <div className={styles.imagePlaceholder}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
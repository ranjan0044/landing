import styles from './TechnologyTrust.module.css';
import { CloudIcon, LockIcon, UsersIcon, PlugIcon, TrendingUpIcon, ZapIcon, ShieldIcon } from '@/components/ui/Icons';

export default function TechnologyTrust() {
    return (
        <section className={styles.section} id="resources">
            <div className="container">
                <div className={styles.header}>
                    <h2 className={styles.title}>
                        Built on <span className="accent-text yellow underline">Solid Foundations</span>
                    </h2>
                    <p className={styles.subtitle}>
                        Enterprise-grade technology delivering security, scalability, and performance
                    </p>
                </div>

                <div className={styles.featuresGrid}>
                    <div className={styles.feature}>
                        <div className={styles.featureIcon}>
                            <CloudIcon size={32} />
                        </div>
                        <h3 className={styles.featureTitle}>Cloud-Ready</h3>
                        <p className={styles.featureDesc}>
                            Deployed on AWS infrastructure with 99.9% uptime SLA and automatic scaling.
                        </p>
                    </div>

                    <div className={styles.feature}>
                        <div className={styles.featureIcon}>
                            <LockIcon size={32} />
                        </div>
                        <h3 className={styles.featureTitle}>Secure Multi-Tenant</h3>
                        <p className={styles.featureDesc}>
                            Complete data isolation with enterprise-grade encryption and compliance certifications.
                        </p>
                    </div>

                    <div className={styles.feature}>
                        <div className={styles.featureIcon}>
                            <UsersIcon size={32} />
                        </div>
                        <h3 className={styles.featureTitle}>Role-Based Access</h3>
                        <p className={styles.featureDesc}>
                            Granular permissions and access control for every user and feature in your organization.
                        </p>
                    </div>

                    <div className={styles.feature}>
                        <div className={styles.featureIcon}>
                            <PlugIcon size={32} />
                        </div>
                        <h3 className={styles.featureTitle}>API-First</h3>
                        <p className={styles.featureDesc}>
                            Everything built with APIs first. Integrate with any tool using our comprehensive REST API.
                        </p>
                    </div>

                    <div className={styles.feature}>
                        <div className={styles.featureIcon}>
                            <TrendingUpIcon size={32} />
                        </div>
                        <h3 className={styles.featureTitle}>Scalable Infrastructure</h3>
                        <p className={styles.featureDesc}>
                            From 10 to 10,000 users. Our infrastructure grows automatically with your needs.
                        </p>
                    </div>

                    <div className={styles.feature}>
                        <div className={styles.featureIcon}>
                            <ZapIcon size={32} />
                        </div>
                        <h3 className={styles.featureTitle}>Lightning Fast</h3>
                        <p className={styles.featureDesc}>
                            Optimized for speed with CDN delivery, caching, and sub-second response times globally.
                        </p>
                    </div>
                </div>

                <div className={styles.trustBar}>
                    <div className={styles.trustBadge}>
                        <ShieldIcon size={16} />
                        SOC 2 Type II
                    </div>
                    <div className={styles.trustBadge}>
                        <LockIcon size={16} />
                        ISO 27001
                    </div>
                    <div className={styles.trustBadge}>
                        <ShieldIcon size={16} />
                        GDPR Compliant
                    </div>
                    <div className={styles.trustBadge}>
                        <TrendingUpIcon size={16} />
                        99.9% Uptime
                    </div>
                </div>
            </div>
        </section>
    );
}
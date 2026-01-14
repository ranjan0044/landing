import styles from './TargetAudience.module.css';
import { RocketIcon, BriefcaseIcon, ShieldIcon } from '@/components/ui/Icons';

const BuildingIcon = ({ className = '', size = 24 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M3 21H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5 21V7L13 2L21 7V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 9V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 17V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M13 9V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M13 17V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M17 9V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M17 17V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const PaletteIcon = ({ className = '', size = 24 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="13.5" cy="6.5" r="0.5" fill="currentColor"/>
    <circle cx="17.5" cy="10.5" r="0.5" fill="currentColor"/>
    <circle cx="8.5" cy="7.5" r="0.5" fill="currentColor"/>
    <circle cx="6.5" cy="12.5" r="0.5" fill="currentColor"/>
    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C14.25 22 16.33 21.18 17.97 19.79C18.63 19.21 18.34 18.2 17.5 18.2H16.5C15.67 18.2 14.94 17.9 14.38 17.41C13.82 16.92 13.09 16.62 12.26 16.62C10.08 16.62 8.31 18.39 8.31 20.57C8.31 20.9 8.58 21.17 8.91 21.17H9.91C11.55 21.17 12.91 19.81 12.91 18.17C12.91 16.53 14.27 15.17 15.91 15.17C17.55 15.17 18.91 13.81 18.91 12.17C18.91 10.53 17.55 9.17 15.91 9.17C14.27 9.17 12.91 10.53 12.91 12.17C12.91 12.5 12.64 12.77 12.31 12.77C11.98 12.77 11.71 12.5 11.71 12.17C11.71 9.99 13.48 8.22 15.66 8.22C17.84 8.22 19.61 9.99 19.61 12.17C19.61 14.35 17.84 16.12 15.66 16.12C14.83 16.12 14.1 15.82 13.54 15.33C12.98 14.84 12.25 14.54 11.42 14.54C9.24 14.54 7.47 16.31 7.47 18.49C7.47 20.67 9.24 22.44 11.42 22.44C16.9 22.44 21.44 17.9 21.44 12.42C21.44 6.94 16.9 2.4 12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CodeIcon = ({ className = '', size = 24 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <polyline points="16 18 22 12 16 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="8 6 2 12 8 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function TargetAudience() {
    return (
        <section className={styles.section} id="solutions">
            <div className="container">
                <div className={styles.header}>
                    <h2 className={styles.title}>
                        Who <span className="accent-text purple underline">Yantras</span> Is For
                    </h2>
                    <p className={styles.subtitle}>
                        From startups to enterprises, our platform scales with your ambition
                    </p>
                </div>

                <div className={styles.audienceGrid}>
                    <div className={`card ${styles.audienceCard}`}>
                        <div className={styles.cardIcon}>
                            <RocketIcon size={32} />
                        </div>
                        <h3 className={styles.cardTitle}>Startups</h3>
                        <p className={styles.cardText}>
                            Get started fast with affordable, scalable solutions that grow with your business.
                        </p>
                        <ul className={styles.cardList}>
                            <li>Pay-as-you-grow pricing</li>
                            <li>Quick setup & onboarding</li>
                            <li>No technical expertise needed</li>
                        </ul>
                    </div>

                    <div className={`card ${styles.audienceCard}`}>
                        <div className={styles.cardIcon}>
                            <BuildingIcon size={32} />
                        </div>
                        <h3 className={styles.cardTitle}>SMEs</h3>
                        <p className={styles.cardText}>
                            Streamline operations with integrated tools designed for growing businesses.
                        </p>
                        <ul className={styles.cardList}>
                            <li>Multi-department integration</li>
                            <li>Role-based permissions</li>
                            <li>Advanced reporting</li>
                        </ul>
                    </div>

                    <div className={`card ${styles.audienceCard}`}>
                        <div className={styles.cardIcon}>
                            <ShieldIcon size={32} />
                        </div>
                        <h3 className={styles.cardTitle}>Enterprises</h3>
                        <p className={styles.cardText}>
                            Enterprise-grade security, compliance, and customization for complex needs.
                        </p>
                        <ul className={styles.cardList}>
                            <li>Dedicated infrastructure</li>
                            <li>Custom integrations</li>
                            <li>24/7 premium support</li>
                        </ul>
                    </div>

                    <div className={`card ${styles.audienceCard} ${styles.highlightYellow}`}>
                        <div className={styles.cardIcon}>
                            <PaletteIcon size={32} />
                        </div>
                        <h3 className={styles.cardTitle}>Agencies</h3>
                        <p className={styles.cardText}>
                            Manage multiple clients with white-label options and centralized dashboards.
                        </p>
                        <ul className={styles.cardList}>
                            <li>White-label branding</li>
                            <li>Multi-client management</li>
                            <li>Reseller programs</li>
                        </ul>
                    </div>

                    <div className={`card ${styles.audienceCard}`}>
                        <div className={styles.cardIcon}>
                            <CodeIcon size={32} />
                        </div>
                        <h3 className={styles.cardTitle}>Developers</h3>
                        <p className={styles.cardText}>
                            Build on top of Yantras with our comprehensive APIs and developer tools.
                        </p>
                        <ul className={styles.cardList}>
                            <li>RESTful APIs</li>
                            <li>Webhooks & SDKs</li>
                            <li>Extensive documentation</li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}
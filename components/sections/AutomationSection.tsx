import styles from './AutomationSection.module.css';
import { ArrowRightIcon, ZapIcon, RobotIcon, PlugIcon } from '@/components/ui/Icons';

export default function AutomationSection() {
    return (
        <section className={styles.section} id="automation">
            <div className="container">
                <div className={styles.content}>
                    <div className={styles.textColumn}>
                        <h2 className={styles.title}>
                            <span className="accent-text purple underline">Yantras</span> Automation Studio
                        </h2>
                        <p className={styles.description}>
                            Transform your business processes with intelligent workflow automation.
                            Build custom workflows, integrate with any system, and let AI handle the repetitive tasks.
                        </p>

                        <div className={styles.features}>
                            <div className={styles.feature}>
                                <div className={styles.featureIcon}>
                                    <ZapIcon size={24} />
                                </div>
                                <div>
                                    <h4 className={styles.featureTitle}>Workflow Automation</h4>
                                    <p className={styles.featureText}>Design complex workflows with our visual builder</p>
                                </div>
                            </div>

                            <div className={styles.feature}>
                                <div className={styles.featureIcon}>
                                    <RobotIcon size={24} />
                                </div>
                                <div>
                                    <h4 className={styles.featureTitle}>AI-Driven Processes</h4>
                                    <p className={styles.featureText}>Intelligent automation that learns from your patterns</p>
                                </div>
                            </div>

                            <div className={styles.feature}>
                                <div className={styles.featureIcon}>
                                    <PlugIcon size={24} />
                                </div>
                                <div>
                                    <h4 className={styles.featureTitle}>Seamless Integrations</h4>
                                    <p className={styles.featureText}>Connect with 1000+ apps and services</p>
                                </div>
                            </div>
                        </div>

                        <a href="#products" className="btn btn-primary btn-lg">
                            Explore Automation Studio
                            <ArrowRightIcon size={20} />
                        </a>
                    </div>

                    <div className={styles.visualColumn}>
                        <div className={styles.flowDiagram}>
                            <div className={`${styles.flowStep} ${styles.trigger}`}>
                                <div className={styles.stepIcon}>1</div>
                                <div className={styles.stepLabel}>Trigger</div>
                                <div className={styles.stepDesc}>Event occurs</div>
                            </div>

                            <div className={styles.arrow}>
                                <ArrowRightIcon size={20} />
                            </div>

                            <div className={`${styles.flowStep} ${styles.process}`}>
                                <div className={styles.stepIcon}>2</div>
                                <div className={styles.stepLabel}>Process</div>
                                <div className={styles.stepDesc}>Apply logic</div>
                            </div>

                            <div className={styles.arrow}>
                                <ArrowRightIcon size={20} />
                            </div>

                            <div className={`${styles.flowStep} ${styles.action}`}>
                                <div className={styles.stepIcon}>3</div>
                                <div className={styles.stepLabel}>Action</div>
                                <div className={styles.stepDesc}>Execute task</div>
                            </div>

                            <div className={styles.arrow}>
                                <ArrowRightIcon size={20} />
                            </div>

                            <div className={`${styles.flowStep} ${styles.result}`}>
                                <div className={styles.stepIcon}>4</div>
                                <div className={styles.stepLabel}>Result</div>
                                <div className={styles.stepDesc}>Job complete</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
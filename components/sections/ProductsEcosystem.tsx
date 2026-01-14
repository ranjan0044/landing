'use client';

import styles from './ProductsEcosystem.module.css';
import { ArrowRightIcon } from '@/components/ui/Icons';
import { 
    ChartIcon, UsersIcon, ShoppingCartIcon, BoxIcon, BriefcaseIcon, 
    HeadphonesIcon, GlobeIcon, MailIcon, FactoryIcon, RobotIcon, 
    ShoppingBagIcon, ClipboardIcon 
} from '@/components/ui/Icons';

interface Product {
    name: string;
    description: string;
    status: 'live' | 'soon' | 'dev';
    icon: React.ReactNode;
    color: 'purple' | 'yellow' | 'pink' | 'blue' | 'green' | 'orange';
}

const products: Product[] = [
    {
        name: 'Accounting',
        description: 'Complete financial management and accounting system',
        status: 'live',
        icon: <ChartIcon size={32} />,
        color: 'purple'
    },
    {
        name: 'CRM',
        description: 'Customer relationship management platform',
        status: 'live',
        icon: <UsersIcon size={32} />,
        color: 'blue'
    },
    {
        name: 'Point of Sale',
        description: 'Modern POS system for retail and restaurants',
        status: 'dev',
        icon: <ShoppingCartIcon size={32} />,
        color: 'pink'
    },
    {
        name: 'Inventory',
        description: 'Smart inventory and warehouse management',
        status: 'live',
        icon: <BoxIcon size={32} />,
        color: 'yellow'
    },
    {
        name: 'HR Management',
        description: 'Complete human resources and payroll system',
        status: 'dev',
        icon: <BriefcaseIcon size={32} />,
        color: 'green'
    },
    {
        name: 'Helpdesk',
        description: 'Customer support and ticket management',
        status: 'soon',
        icon: <HeadphonesIcon size={32} />,
        color: 'orange'
    },
    {
        name: 'Website Builder',
        description: 'Drag-and-drop website and landing page builder',
        status: 'soon',
        icon: <GlobeIcon size={32} />,
        color: 'purple'
    },
    {
        name: 'Email Marketing',
        description: 'Email campaigns and marketing automation',
        status: 'soon',
        icon: <MailIcon size={32} />,
        color: 'blue'
    },
    {
        name: 'Manufacturing',
        description: 'Production planning and manufacturing execution',
        status: 'soon',
        icon: <FactoryIcon size={32} />,
        color: 'pink'
    },
    {
        name: 'Automation Studio',
        description: 'Workflow automation and process builder',
        status: 'dev',
        icon: <RobotIcon size={32} />,
        color: 'yellow'
    },
    {
        name: 'E-Commerce',
        description: 'Complete online store and marketplace platform',
        status: 'soon',
        icon: <ShoppingBagIcon size={32} />,
        color: 'green'
    },
    {
        name: 'Project Management',
        description: 'Team collaboration and project tracking',
        status: 'dev',
        icon: <ClipboardIcon size={32} />,
        color: 'orange'
    }
];

export default function ProductsEcosystem() {
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'live':
                return <span className="badge badge-live">Live</span>;
            case 'dev':
                return <span className="badge badge-dev">In Development</span>;
            case 'soon':
                return <span className="badge badge-soon">Coming Soon</span>;
            default:
                return null;
        }
    };

    return (
        <section className={styles.section} id="products">
            <div className="container-wide">
                <div className={styles.header}>
                    <h2 className={styles.title}>
                        Yantras <span className="accent-text yellow underline">Products</span>
                    </h2>
                    <p className={styles.subtitle}>
                        A complete ecosystem of business tools. Choose what you need, when you need it.
                    </p>
                </div>

                <div className={styles.productsGrid}>
                    {products.map((product, index) => (
                        <div
                            key={index}
                            className={`card ${styles.productCard} ${styles[product.color]}`}
                        >
                            <div className={styles.productIcon}>{product.icon}</div>
                            <div className={styles.productContent}>
                                <h3 className={styles.productName}>{product.name}</h3>
                                <p className={styles.productDesc}>{product.description}</p>
                            </div>
                            <div className={styles.productFooter}>
                                {getStatusBadge(product.status)}
                                <button className={`btn ${styles.viewBtn}`}>
                                    View Product
                                    <ArrowRightIcon size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className={styles.cta}>
                    <p className={styles.ctaText}>
                        Can't find what you're looking for?
                    </p>
                    <a href="#contact" className="btn btn-primary btn-lg">
                        Request a Custom Solution
                        <ArrowRightIcon size={20} />
                    </a>
                </div>
            </div>
        </section>
    );
}
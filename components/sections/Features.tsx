import React from 'react'
import Card from '../ui/Card'

const features = [
    {
        title: 'Lightning Fast',
        description: 'Built on Next.js 14 for optimal performance',
        icon: '⚡',
    },
    {
        title: 'Fully Responsive',
        description: 'Looks great on all devices and screen sizes',
        icon: '📱',
    },
    {
        title: 'SEO Optimized',
        description: 'Built-in SEO best practices for better rankings',
        icon: '🚀',
    },
    {
        title: 'Easy to Customize',
        description: 'Clean code structure for easy modifications',
        icon: '🎨',
    },
]

export default function Features() {
    return (
        <section className="features-section">
            <div className="container">
                <h2 className="section-title">Features</h2>
                <p className="section-description">
                    Everything you need to build an amazing landing page
                </p>
                <div className="features-grid">
                    {features.map((feature, index) => (
                        <Card key={index}>
                            <div className="feature-icon">{feature.icon}</div>
                            <h3 className="feature-title">{feature.title}</h3>
                            <p className="feature-description">{feature.description}</p>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}

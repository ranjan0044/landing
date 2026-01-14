'use client'

import React from 'react'
import Button from '../ui/Button'

export default function Hero() {
    return (
        <section className="hero-section">
            <div className="container">
                <div className="hero-content">
                    <h1 className="hero-title">
                        Build Your SaaS Product Faster
                    </h1>
                    <p className="hero-description">
                        The modern landing page solution for your next big idea.
                        Launch faster, grow bigger, scale smarter.
                    </p>
                    <div className="hero-cta">
                        <Button variant="primary" size="lg">
                            Get Started
                        </Button>
                        <Button variant="outline" size="lg">
                            Learn More
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}

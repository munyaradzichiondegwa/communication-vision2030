import React, { lazy, Suspense } from 'react';

// Dynamically import section components
const Programs = lazy(() => import('./sections/Programs'));
const EconomicSectors = lazy(() => import('./sections/EconomicSectors'));
const GovernmentProjects = lazy(() => import('./sections/GovernmentProjects'));
const Ministries = lazy(() => import('./sections/Ministries'));
const News = lazy(() => import('./sections/News'));
const Engage = lazy(() => import('./sections/Engage'));
const Home = lazy(() => import('./sections/Home'));

function MainContent({ activeSection }) {
    const renderContent = () => {
        const SectionComponent = {
            'programs': Programs,
            'economic-sectors': EconomicSectors,
            'government-projects': GovernmentProjects,
            'ministries': Ministries,
            'news': News,
            'engage': Engage,
            'home': Home
        }[activeSection] || Home;

        return (
            <Suspense fallback={<div>Loading...</div>}>
                <SectionComponent />
            </Suspense>
        );
    };

    return (
        <main className="flex-1 p-6 bg-gray-100">
            {renderContent()}
        </main>
    );
}

export default MainContent;
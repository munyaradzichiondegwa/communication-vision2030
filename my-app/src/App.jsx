import React, { useState } from 'react';
import Navigation from './components/Navigation';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import Footer from './components/Footer';

function App() {
    const [activeSection, setActiveSection] = useState('home');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <Navigation 
                setActiveSection={setActiveSection}
                toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            />
            <div className="flex flex-1">
                <Sidebar 
                    isOpen={sidebarOpen} 
                    activeSection={activeSection}
                />
                <MainContent 
                    activeSection={activeSection}
                />
            </div>
            <Footer />
        </div>
    );
}

export default App;
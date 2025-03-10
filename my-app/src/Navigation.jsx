import React from 'react';
import { Menu } from 'lucide-react';

const navigationItems = [
    { id: 'programs', label: 'Programs' },
    { id: 'economic-sectors', label: 'Economic Sectors' },
    { id: 'government-projects', label: 'Government Projects' },
    { id: 'ministries', label: 'Ministries' },
    { id: 'news', label: 'News' },
    { id: 'engage', label: 'Engage' }
];

function Navigation({ setActiveSection, toggleSidebar }) {
    return (
        <nav className="bg-blue-800 text-white p-4 flex justify-between items-center">
            <div className="flex items-center">
                <button 
                    onClick={toggleSidebar} 
                    className="mr-4 md:hidden"
                >
                    <Menu />
                </button>
                <img 
                    src="/zimbabwe-logo.png" 
                    alt="Zimbabwe Vision 2030" 
                    className="h-10 mr-4"
                />
            </div>
            <ul className="hidden md:flex space-x-6">
                {navigationItems.map((item) => (
                    <li 
                        key={item.id}
                        onClick={() => setActiveSection(item.id)}
                        className="cursor-pointer hover:text-yellow-300 transition"
                    >
                        {item.label}
                    </li>
                ))}
            </ul>
        </nav>
    );
}

export default Navigation;
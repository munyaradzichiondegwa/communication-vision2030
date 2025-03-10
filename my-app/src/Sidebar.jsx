import React from 'react';
import { 
    TrendingUp, 
    Image, 
    Download, 
    BarChart 
} from 'lucide-react';

function Sidebar({ isOpen, activeSection }) {
    const sidebarItems = [
        { 
            id: 'kpis', 
            label: 'Live KPI Dashboard', 
            icon: <BarChart className="mr-2" /> 
        },
        { 
            id: 'media-gallery', 
            label: 'Media Gallery', 
            icon: <Image className="mr-2" /> 
        },
        { 
            id: 'resources', 
            label: 'Resources', 
            icon: <Download className="mr-2" /> 
        }
    ];

    return (
        <div className={`
            ${isOpen ? 'block' : 'hidden'} 
            md:block 
            w-64 
            bg-white 
            shadow-lg 
            p-4
        `}>
            <h2 className="text-xl font-bold mb-4 flex items-center">
                <TrendingUp className="mr-2" /> Quick Access
            </h2>
            <ul>
                {sidebarItems.map((item) => (
                    <li 
                        key={item.id}
                        className={`
                            flex 
                            items-center 
                            p-2 
                            hover:bg-blue-100 
                            rounded 
                            cursor-pointer
                            ${activeSection === item.id ? 'bg-blue-200' : ''}
                        `}
                    >
                        {item.icon}
                        {item.label}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Sidebar;
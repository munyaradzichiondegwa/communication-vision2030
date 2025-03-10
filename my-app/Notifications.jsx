import React from 'react';
import { useAppContext } from './AppContext';
import { 
    CheckCircle, 
    AlertCircle, 
    Info, 
    X 
} from 'lucide-react';

function Notifications() {
    const { state, dispatch } = useAppContext();

    const getIcon = (type) => {
        switch (type) {
            case 'success': return <CheckCircle className="text-green-500" />;
            case 'error': return <AlertCircle className="text-red-500" />;
            default: return <Info className="text-blue-500" />;
        }
    };

    const removeNotification = (index) => {
        const newNotifications = [...state.notifications];
        newNotifications.splice(index, 1);
        dispatch({ 
            type: 'SET_NOTIFICATIONS', 
            payload: newNotifications 
        });
    };

    return (
        <div className="fixed top-4 right-4 z-50 space-y-2">
            {state.notifications.map((notification, index) => (
                <div 
                    key={index} 
                    className={`
                        flex items-center 
                        p-4 rounded-lg shadow-lg 
                        bg-white
                        animate-slide-in
                    `}
                >
                    <div className="mr-4">
                        {getIcon(notification.type)}
                    </div>
                    <div className="flex-grow">
                        <p>{notification.message}</p>
                    </div>
                    <button 
                        onClick={() => removeNotification(index)}
                        className="ml-4 hover:bg-gray-100 rounded-full p-1"
                    >
                        <X size={16} />
                    </button>
                </div>
            ))}
        </div>
    );
}

export default Notifications;
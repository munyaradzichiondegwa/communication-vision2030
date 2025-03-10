class DataService {
    static async fetchEconomicSectors() {
        try {
            const response = await fetch('/api/economic-sectors');
            return await response.json();
        } catch (error) {
            console.error('Failed to fetch economic sectors', error);
            return [];
        }
    }

    static async fetchGovernmentProjects() {
        try {
            const response = await fetch('/api/government-projects');
            return await response.json();
        } catch (error) {
            console.error('Failed to fetch government projects', error);
            return [];
        }
    }

    static async fetchNews() {
        try {
            const response = await fetch('/api/news');
            return await response.json();
        } catch (error) {
            console.error('Failed to fetch news', error);
            return [];
        }
    }
}

export default DataService;
// Simple API Service using JSONBin
class ApiService {
    constructor() {
        // Replace with your JSONBin details
        this.binId = 'YOUR_BIN_ID';
        this.apiKey = 'YOUR_API_KEY';
        this.baseUrl = 'https://api.jsonbin.io/v3/b';
    }

    async getAllItems() {
        try {
            const response = await fetch(`${this.baseUrl}/${this.binId}/latest`, {
                method: 'GET',
                headers: {
                    'X-Master-Key': this.apiKey,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                return data.record.items || [];
            }
            return [];
        } catch (error) {
            console.error('Error fetching items:', error);
            return [];
        }
    }

    async saveItems(items) {
        try {
            const response = await fetch(`${this.baseUrl}/${this.binId}`, {
                method: 'PUT',
                headers: {
                    'X-Master-Key': this.apiKey,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ items })
            });
            
            return response.ok;
        } catch (error) {
            console.error('Error saving items:', error);
            return false;
        }
    }

    async addItem(newItem) {
        try {
            // Get current items
            const items = await this.getAllItems();
            
            // Add new item with unique ID
            newItem.id = Date.now();
            items.unshift(newItem);
            
            // Save back
            const success = await this.saveItems(items);
            return success ? { success: true, id: newItem.id } : { success: false };
        } catch (error) {
            console.error('Error adding item:', error);
            return { success: false };
        }
    }
}

// Export service
window.apiService = new ApiService();
